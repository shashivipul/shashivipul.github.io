/* =============================================================================
   Travel graph: animated map of trips, with a photo gallery per country.
   Data comes from _data/travel.yml (injected into the page as window.TRAVEL).
   ============================================================================= */
(function () {
  'use strict';

  var root = document.getElementById('travel');
  if (!root || !window.d3 || !window.TRAVEL) return;

  var DATA = window.TRAVEL;
  var BASE = root.getAttribute('data-base') || '';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W = 1000, H = 560;
  var HOME = DATA.home;

  /* ---------- Prepare data ---------- */
  var byId = {};
  DATA.countries.forEach(function (c) {
    byId[c.id] = c;
    c.years = [];
    c.photos = c.photos || [];
  });

  var legs = [];
  DATA.trips.forEach(function (t, ti) {
    for (var i = 0; i < t.route.length - 1; i++) {
      var a = t.route[i], b = t.route[i + 1];
      if (!byId[a] || !byId[b]) continue;
      legs.push({ from: a, to: b, year: t.year, trip: ti, order: legs.length });
    }
    t.route.forEach(function (id) {
      if (byId[id] && id !== HOME && byId[id].years.indexOf(t.year) < 0) byId[id].years.push(t.year);
    });
  });

  var visited = DATA.countries.filter(function (c) {
    return c.id === HOME || legs.some(function (l) { return l.from === c.id || l.to === c.id; });
  });
  var years = [];
  DATA.trips.forEach(function (t) { if (years.indexOf(t.year) < 0) years.push(t.year); });
  years.sort();

  /* ---------- Stats ---------- */
  var abroad = visited.filter(function (c) { return c.id !== HOME; });
  var continents = {};
  visited.forEach(function (c) { if (c.continent) continents[c.continent] = 1; });
  setText('[data-stat="countries"]', abroad.length);
  setText('[data-stat="continents"]', Object.keys(continents).length);
  setText('[data-stat="trips"]', DATA.trips.length);
  setText('[data-stat="since"]', years[0] || '');

  function setText(sel, v) {
    var el = root.querySelector(sel);
    if (el) el.textContent = v;
  }

  /* Stats count up each time they scroll into view (like the Research page) */
  var statsBox = root.querySelector('.travel-stats');
  if (statsBox && !reduce && 'IntersectionObserver' in window) {
    statsBox.classList.add('is-animated');
    var statEls = statsBox.querySelectorAll('li');
    statEls.forEach(function (li, i) { li.style.transitionDelay = i * 80 + 'ms'; });
    var countUp = function (el) {
      if (!el.dataset.end) el.dataset.end = el.textContent;
      var end = parseInt(el.dataset.end, 10);
      if (isNaN(end)) return;
      var from = end > 1000 ? end - 25 : 0;      /* years roll up instead of counting from 0 */
      var t0 = null, dur = 1000;
      cancelAnimationFrame(el._raf);
      el.textContent = from;
      (function stepFn(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(from + (end - from) * (1 - Math.pow(1 - p, 3)));
        if (p < 1) el._raf = requestAnimationFrame(stepFn);
      })(performance.now());
    };
    var statIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var li = e.target, num = li.querySelector('span');
        if (e.isIntersecting) {
          li.classList.add('is-visible');
          if (num) countUp(num);
        } else {
          li.classList.remove('is-visible');   /* reset so it replays next time */
        }
      });
    }, { threshold: 0.6 });
    statEls.forEach(function (li) { statIO.observe(li); });
  }

  /* ---------- SVG scaffold ---------- */
  var svg = d3.select(root.querySelector('.travel-map__svg'))
    .attr('viewBox', '0 0 ' + W + ' ' + H)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  var defs = svg.append('defs');
  var glow = defs.append('filter').attr('id', 'tv-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
  glow.append('feGaussianBlur').attr('stdDeviation', 3).attr('result', 'b');
  var fm = glow.append('feMerge');
  fm.append('feMergeNode').attr('in', 'b');
  fm.append('feMergeNode').attr('in', 'SourceGraphic');

  var grad = defs.append('linearGradient').attr('id', 'tv-edge').attr('gradientUnits', 'userSpaceOnUse');
  grad.append('stop').attr('offset', '0%').attr('stop-color', '#5fd3e6');
  grad.append('stop').attr('offset', '100%').attr('stop-color', '#ffc861');

  var gMap = svg.append('g').attr('class', 'tv-map');
  var gEdges = svg.append('g').attr('class', 'tv-edges');
  var gFlow = svg.append('g').attr('class', 'tv-flow');
  var gComet = svg.append('g').attr('class', 'tv-comet');
  var gNodes = svg.append('g').attr('class', 'tv-nodes');
  var yearLabel = svg.append('text').attr('class', 'tv-year').attr('x', W - 28).attr('y', H - 26).attr('text-anchor', 'end');

  /* Projection fitted to visited places, with breathing room */
  var projection = d3.geoNaturalEarth1();
  var pts = { type: 'MultiPoint', coordinates: visited.map(function (c) { return [c.lon, c.lat]; }) };
  projection.fitExtent([[110, 80], [W - 90, H - 70]], pts);
  var path = d3.geoPath(projection);

  /* Node positions: true location, nudged apart where countries are close */
  visited.forEach(function (c) {
    var p = projection([c.lon, c.lat]);
    c.tx = p[0]; c.ty = p[1]; c.x = p[0]; c.y = p[1];
  });
  d3.forceSimulation(visited)
    .force('x', d3.forceX(function (d) { return d.tx; }).strength(0.5))
    .force('y', d3.forceY(function (d) { return d.ty; }).strength(0.5))
    .force('collide', d3.forceCollide(function (d) { return d.id === HOME ? 34 : 33; }))
    .stop()
    .tick(300);

  /* ---------- Base map ---------- */
  gMap.append('path').attr('class', 'tv-sphere').attr('d', path({ type: 'Sphere' }));
  gMap.append('path').attr('class', 'tv-grid').attr('d', path(d3.geoGraticule10()));

  var mapIds = {};
  visited.forEach(function (c) { if (c.map_id) mapIds[String(c.map_id).padStart(3, '0')] = c.id; });

  /* Country borders: Natural Earth 1:10m "India point of view" dataset, which
     shows India's boundaries as officially recognised by the Government of India
     (all of Jammu & Kashmir and Ladakh, including PoK, Gilgit-Baltistan and
     Aksai Chin, and all of Arunachal Pradesh). Public domain, simplified for web. */
  d3.json(BASE + '/assets/data/world-india-pov.json').then(function (world) {
    var land = topojson.feature(world, world.objects.countries).features;
    gMap.selectAll('path.tv-land').data(land).enter().append('path')
      .attr('class', function (f) { return 'tv-land' + (mapIds[f.id] ? ' is-visited' : ''); })
      .attr('data-id', function (f) { return mapIds[f.id] || null; })
      .attr('d', path);
    if (selected) highlightLand(selected);
  }).catch(function () { /* the graph still works without the base map */ });

  /* ---------- Edges ---------- */
  /* Curved edges: each curve bows to whichever side keeps it clear of other
     places, and repeat journeys between the same pair fan out further */
  var pairCount = {};
  function curve(a, b, bend) {
    var dx = b.x - a.x, dy = b.y - a.y;
    return { x: (a.x + b.x) / 2 - dy * bend, y: (a.y + b.y) / 2 + dx * bend };
  }
  function clearance(pt, a, b) {
    var m = Infinity;
    visited.forEach(function (c) {
      if (c === a || c === b) return;
      var d = Math.hypot(c.x - pt.x, c.y - pt.y);
      if (d < m) m = d;
    });
    return m;
  }
  legs.forEach(function (l) {
    var key = [l.from, l.to].sort().join('-');
    l.k = pairCount[key] = (pairCount[key] || 0) + 1;
    var a = byId[l.from], b = byId[l.to];
    /* use a fixed orientation per pair so repeat trips stack on one side */
    var p = l.from < l.to ? [a, b] : [b, a];
    var mag = 0.2 + 0.13 * (l.k - 1);
    var c1 = curve(p[0], p[1], mag), c2 = curve(p[0], p[1], -mag);
    /* midpoint of a quadratic curve is halfway between the chord midpoint and the control point */
    var m1 = { x: ((p[0].x + p[1].x) / 2 + c1.x) / 2, y: ((p[0].y + p[1].y) / 2 + c1.y) / 2 };
    var m2 = { x: ((p[0].x + p[1].x) / 2 + c2.x) / 2, y: ((p[0].y + p[1].y) / 2 + c2.y) / 2 };
    var cp = clearance(m1, a, b) >= clearance(m2, a, b) ? c1 : c2;
    l.d = 'M' + a.x + ',' + a.y + ' Q' + cp.x + ',' + cp.y + ' ' + b.x + ',' + b.y;
  });

  var edgeSel = gEdges.selectAll('path').data(legs).enter().append('path')
    .attr('class', 'tv-edge')
    .attr('d', function (l) { return l.d; });
  edgeSel.each(function (l) { l.len = this.getTotalLength(); });

  var flowSel = gFlow.selectAll('path').data(legs).enter().append('path')
    .attr('class', 'tv-flowline')
    .attr('d', function (l) { return l.d; });

  /* ---------- Nodes ---------- */
  var nodeSel = gNodes.selectAll('g').data(visited).enter().append('g')
    .attr('class', function (c) { return 'tv-node' + (c.id === HOME ? ' is-home' : ''); })
    .attr('transform', function (c) { return 'translate(' + c.x + ',' + c.y + ')'; })
    .attr('tabindex', 0)
    .attr('role', 'button')
    .attr('aria-label', function (c) { return c.name; })
    .on('click', function (e, c) { select(c.id, true); })
    .on('keydown', function (e, c) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(c.id, true); } })
    .on('mouseenter', function (e, c) { showTip(c); })
    .on('mouseleave', hideTip);

  /* thin leader line back to the true location when a node was nudged */
  nodeSel.append('line').attr('class', 'tv-leader')
    .attr('x2', function (c) { return c.tx - c.x; })
    .attr('y2', function (c) { return c.ty - c.y; });
  nodeSel.append('circle').attr('class', 'tv-halo').attr('r', function (c) { return c.id === HOME ? 22 : 15; });
  nodeSel.append('circle').attr('class', 'tv-dot').attr('r', function (c) { return c.id === HOME ? 9 : 6; });
  nodeSel.append('text').attr('class', 'tv-flag').attr('dy', function (c) { return c.id === HOME ? -16 : -12; })
    .text(function (c) { return c.flag || ''; });
  nodeSel.append('text').attr('class', 'tv-label')
    .attr('dy', function (c) { return c.id === HOME ? 26 : 20; })
    .text(function (c) { return c.short || c.name; });

  /* On small screens the map shrinks a lot: scale flags and dots up in map
     units, and show names only for home and the selected country */
  var svgEl = root.querySelector('.travel-map__svg');
  function fitScale() {
    var w = svgEl.getBoundingClientRect().width || W;
    var k = Math.max(1, Math.min(2.4, (W / w) * 0.5));
    root.classList.toggle('is-compact', w < 560);
    nodeSel.select('.tv-flag').style('font-size', (15 * k) + 'px')
      .attr('dy', function (c) { return -(c.id === HOME ? 14 : 10) * k; });
    nodeSel.select('.tv-dot').attr('r', function (c) { return (c.id === HOME ? 9 : 6) * Math.sqrt(k); });
    nodeSel.select('.tv-halo').attr('r', function (c) { return (c.id === HOME ? 22 : 15) * Math.sqrt(k); });
    nodeSel.select('.tv-label').style('font-size', (12 * k) + 'px')
      .attr('dy', function (c) { return (c.id === HOME ? 24 : 19) * Math.sqrt(k) + 4 * (k - 1); });
  }
  fitScale();
  window.addEventListener('resize', fitScale);

  /* ---------- Tooltip ---------- */
  var tip = root.querySelector('.travel-map__tip');
  function showTip(c) {
    if (!tip) return;
    var yrs = c.id === HOME ? 'Home' : 'Visited ' + c.years.join(', ');
    tip.innerHTML = '<strong>' + esc(c.flag || '') + ' ' + esc(c.name) + '</strong><span>' + esc(yrs) + '</span>';
    var box = root.querySelector('.travel-map__stage').getBoundingClientRect();
    var sx = box.width / W, sy = box.height / H, s = Math.min(sx, sy);
    var ox = (box.width - W * s) / 2, oy = (box.height - H * s) / 2;
    tip.style.left = (ox + c.x * s) + 'px';
    tip.style.top = (oy + c.y * s) + 'px';
    tip.classList.add('is-on');
  }
  function hideTip() { if (tip) tip.classList.remove('is-on'); }

  /* ---------- Year filter + chips ---------- */
  var filters = root.querySelector('.travel-filters');
  var activeYear = 'all';
  if (filters) {
    ['all'].concat(years).forEach(function (y) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = y === 'all' ? 'All years' : y;
      b.setAttribute('data-year', y);
      if (y === 'all') b.classList.add('is-active');
      b.addEventListener('click', function () {
        activeYear = String(y);
        filters.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        applyFocus();
      });
      filters.appendChild(b);
    });
  }

  var chipsBox = root.querySelector('.travel-chips');
  if (chipsBox) {
    visited.slice().sort(function (a, b) {
      if (a.id === HOME) return -1;
      if (b.id === HOME) return 1;
      return (a.years[0] || 0) - (b.years[0] || 0) || a.name.localeCompare(b.name);
    }).forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-id', c.id);
      b.innerHTML = '<span class="travel-chips__flag">' + esc(c.flag || '') + '</span>' + esc(c.name) +
        (c.photos.length ? '<span class="travel-chips__count">' + c.photos.length + '</span>' : '');
      b.addEventListener('click', function () { select(c.id, true); });
      chipsBox.appendChild(b);
    });
  }

  /* Dim everything that isn't part of the current year / selection */
  function applyFocus() {
    var yr = activeYear;
    edgeSel.classed('is-dim', function (l) {
      if (yr !== 'all') return String(l.year) !== yr;
      /* with all years shown, a chosen country spotlights its own routes */
      return !!(selected && selected !== HOME && l.from !== selected && l.to !== selected);
    });
    if (!playing) yearLabel.text(yr !== 'all' ? yr : (years.length ? years[0] + ' – ' + years[years.length - 1] : ''));
    flowSel.classed('is-dim', function (l) { return yr !== 'all' && String(l.year) !== yr; });
    nodeSel.classed('is-dim', function (c) {
      if (c.id === HOME || yr === 'all') return false;
      return c.years.indexOf(Number(yr)) < 0;
    });
  }

  /* ---------- Selection + gallery ---------- */
  var selected = null;
  var gallery = root.querySelector('.travel-gallery');

  function highlightLand(id) {
    gMap.selectAll('path.tv-land').classed('is-selected', function () { return this.getAttribute('data-id') === id; });
  }

  function select(id, scroll) {
    selected = id;
    var c = byId[id];
    nodeSel.classed('is-selected', function (n) { return n.id === id; });
    if (chipsBox) chipsBox.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-id') === id); });
    highlightLand(id);
    applyFocus();
    renderGallery(c);
    if (scroll && gallery) {
      setTimeout(function () { gallery.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 80);
    }
  }

  function routeText(t) {
    return t.route.map(function (id) { return byId[id] ? byId[id].name.split(',')[0] : id; }).join(' → ');
  }

  function renderGallery(c) {
    if (!gallery) return;
    var trips = DATA.trips.filter(function (t) { return t.route.indexOf(c.id) >= 0; });
    var meta = c.id === HOME ? 'Home base for every journey' :
      'Visited in ' + c.years.join(' & ');
    var html = '<div class="travel-gallery__head">' +
      '<span class="travel-gallery__flag">' + esc(c.flag || '') + '</span>' +
      '<div><h2>' + esc(c.name) + '</h2><p>' + esc(meta) + '</p></div></div>';
    if (c.id !== HOME && trips.length) {
      html += '<ul class="travel-gallery__trips">' + trips.map(function (t) {
        return '<li><span>' + t.year + '</span>' + esc(t.title ? t.title + ' · ' : '') + esc(routeText(t)) + '</li>';
      }).join('') + '</ul>';
    }
    if (c.photos.length) {
      html += '<div class="travel-gallery__grid">' + c.photos.map(function (p, i) {
        var src = BASE + '/images/travel/' + encodeURI(p.file);
        return '<figure style="--i:' + i + '"><button type="button" data-index="' + i + '" aria-label="Open photo">' +
          '<img src="' + src + '" alt="' + esc(p.caption || c.name) + '" loading="lazy"></button>' +
          (p.caption ? '<figcaption>' + esc(p.caption) + '</figcaption>' : '') + '</figure>';
      }).join('') + '</div>';
    } else {
      html += '<div class="travel-gallery__empty"><span>📷</span>Photos from ' + esc(c.name.split(',')[0]) + ' are coming soon.</div>';
    }
    gallery.innerHTML = html;
    gallery.classList.remove('is-in');
    void gallery.offsetWidth;
    gallery.classList.add('is-in');
    gallery.querySelectorAll('[data-index]').forEach(function (b) {
      b.addEventListener('click', function () { openLightbox(c, Number(b.getAttribute('data-index'))); });
    });
  }

  /* ---------- Lightbox ---------- */
  var lb = root.querySelector('.travel-lightbox'), lbC = null, lbI = 0;
  function openLightbox(c, i) {
    if (!lb) return;
    lbC = c; lbI = i; drawLightbox();
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.travel-lightbox__close').focus();
  }
  function drawLightbox() {
    var p = lbC.photos[lbI];
    lb.querySelector('img').src = BASE + '/images/travel/' + encodeURI(p.file);
    lb.querySelector('img').alt = p.caption || lbC.name;
    lb.querySelector('.travel-lightbox__cap').textContent =
      (p.caption ? p.caption + ' · ' : '') + lbC.name + '  (' + (lbI + 1) + ' / ' + lbC.photos.length + ')';
  }
  function closeLightbox() { if (lb) { lb.hidden = true; document.body.style.overflow = ''; } }
  function step(n) { if (!lbC) return; lbI = (lbI + n + lbC.photos.length) % lbC.photos.length; drawLightbox(); }
  if (lb) {
    lb.querySelector('.travel-lightbox__close').addEventListener('click', closeLightbox);
    lb.querySelector('.travel-lightbox__prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.travel-lightbox__next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- Journey animation ---------- */
  var playing = false, runId = 0;

  function resetState() {
    edgeSel.interrupt().classed('is-drawn', false)
      .attr('stroke-dasharray', function (l) { return l.len + ' ' + l.len; })
      .attr('stroke-dashoffset', function (l) { return l.len; });
    flowSel.classed('is-on', false);
    nodeSel.classed('is-reached', function (c) { return c.id === HOME; });
    gComet.selectAll('*').remove();
    yearLabel.text('');
  }

  function finalState() {
    edgeSel.interrupt().classed('is-drawn', true).attr('stroke-dasharray', null).attr('stroke-dashoffset', null);
    flowSel.classed('is-on', true);
    nodeSel.classed('is-reached', true);
    gComet.selectAll('*').remove();
    yearLabel.text(years.length ? years[0] + ' – ' + years[years.length - 1] : '');
  }

  function play() {
    if (reduce) { finalState(); return; }
    var id = ++runId;
    playing = true;
    resetState();
    var i = 0, LEG = 950, GAP = 260;

    function next() {
      if (id !== runId) return;
      if (i >= legs.length) { playing = false; finalState(); return; }
      var l = legs[i], el = edgeSel.nodes()[i];
      yearLabel.text(l.year);
      var comet = gComet.append('circle').attr('class', 'tv-comet__dot').attr('r', 5);
      var trail = gComet.append('circle').attr('class', 'tv-comet__trail').attr('r', 11);
      d3.select(el).transition().duration(LEG).ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0)
        .tween('comet', function () {
          return function (t) {
            var p = el.getPointAtLength(t * l.len);
            comet.attr('cx', p.x).attr('cy', p.y);
            trail.attr('cx', p.x).attr('cy', p.y);
          };
        })
        .on('end', function () {
          if (id !== runId) return;
          d3.select(el).classed('is-drawn', true);
          nodeSel.filter(function (c) { return c.id === l.to; }).classed('is-reached', true);
          comet.remove(); trail.remove();
          var newTrip = legs[i + 1] && legs[i + 1].trip !== l.trip;
          i++;
          setTimeout(next, newTrip ? GAP * 2 : GAP / 3);
        });
    }
    setTimeout(next, 350);
  }

  var replayBtn = root.querySelector('.travel-replay');
  if (replayBtn) replayBtn.addEventListener('click', function () {
    /* Replay shows the whole journey: clear any country spotlight or year
       filter first, otherwise the routes would be drawn faded */
    selected = null;
    activeYear = 'all';
    nodeSel.classed('is-selected', false);
    highlightLand(null);
    if (chipsBox) chipsBox.querySelectorAll('button').forEach(function (b) { b.classList.remove('is-active'); });
    if (filters) filters.querySelectorAll('button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-year') === 'all');
    });
    applyFocus();
    play();
  });

  /* Start the journey the first time the map scrolls into view */
  resetState();
  if ('IntersectionObserver' in window && !reduce) {
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) { started = true; play(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(root.querySelector('.travel-map__stage'));
  } else {
    finalState();
  }

  /* Open a country from the URL hash, e.g. /travel/#JP */
  var h = (location.hash || '').replace('#', '').toUpperCase();
  if (byId[h]) select(h, false);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }
})();
