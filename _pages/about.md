---
permalink: /
title: #"Research Portfolio"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

Namaste! I am **Vipul**, an AI researcher building **trustworthy and scalable machine learning** for graph-structured and real-world data. I am a final-year Ph.D. candidate and [Prime Minister’s Research Fellow (PMRF)](https://www.pmrf.in) in Electrical Engineering at the [Indian Institute of Technology Delhi](https://home.iitd.ac.in), advised by [Prof. Sandeep Kumar](https://sites.google.com/view/sandeepkr/home) and [Prof. Jayadeva](https://web.iitd.ac.in/~jayadeva/) at the [Machine Intelligence Signals and Networks (MISN) Lab](https://misn.iitd.ac.in). I have completed my Pre-Ph.D. Synopsis and will be graduating soon. I am currently a Research Intern in the AI lab at **[Fujitsu Research](https://global.fujitsu/en-apac)**.

My Ph.D. research makes graph learning fair, robust and efficient, through certifiably robust and fair GNNs, fairness-aware knowledge distillation, graph coarsening, and graph–language models for neuroimaging. This work has been published at AAAI, MICCAI, TMLR and IEEE TSP. At Fujitsu, I am taking these ideas to systems that evolve over time: self-evolving AI agents, knowledge graphs, and anomaly detection in dynamic graphs.

Earlier, I was a Visiting Junior Fellow with [Prof. Tsuyoshi Murata](https://www.net.c.titech.ac.jp/murata.html) at the [Institute of Science Tokyo](https://www.isct.ac.jp/en) (2026). I hold an **M.Tech.** from the [Indian Institute of Technology Patna](https://www.iitp.ac.in), where I worked on biomedical signal and image processing with [Prof. Maheshkumar H. Kolekar](https://www.iitp.ac.in/~mahesh/), and a **B.Tech.** in Electronics and Communication Engineering from [Dr. A.P.J. Abdul Kalam Technical University (AKTU)](https://aktu.ac.in).

<div class="affiliations">
  <a class="affil" href="https://global.fujitsu/en-apac" target="_blank" rel="noopener">
    <span class="affil__logo affil__logo--mark">
      <img src="/images/logos/fujitsu.png" alt="Fujitsu logo" loading="lazy"
           onerror="this.parentNode.classList.add('is-missing')">
      <span class="affil__fallback">FUJITSU</span>
    </span>
    <span class="affil__name">Fujitsu Research</span>
    <span class="affil__role">Research Intern</span>
    <span class="affil__years">2026 – Present</span>
  </a>

  <a class="affil" href="https://home.iitd.ac.in" target="_blank" rel="noopener">
    <span class="affil__logo affil__logo--crest">
      <img src="/images/logos/iit-delhi.png" alt="IIT Delhi logo" loading="lazy"
           onerror="this.parentNode.classList.add('is-missing')">
      <span class="affil__fallback">IIT Delhi</span>
    </span>
    <span class="affil__name">IIT Delhi</span>
    <span class="affil__role">Ph.D. · PMRF Fellow</span>
    <span class="affil__years">2021 – Present</span>
  </a>

  <a class="affil" href="https://www.isct.ac.jp/en" target="_blank" rel="noopener">
    <span class="affil__logo affil__logo--wordmark">
      <img src="/images/logos/science-tokyo.png" alt="Institute of Science Tokyo logo" loading="lazy"
           onerror="this.parentNode.classList.add('is-missing')">
      <span class="affil__fallback">Science Tokyo</span>
    </span>
    <span class="affil__name">Science Tokyo</span>
    <span class="affil__role">LOTUS Visiting Fellow</span>
    <span class="affil__years">2026</span>
  </a>

  <a class="affil" href="https://www.iitp.ac.in" target="_blank" rel="noopener">
    <span class="affil__logo affil__logo--crest">
      <img src="/images/logos/iit-patna.png" alt="IIT Patna logo" loading="lazy"
           onerror="this.parentNode.classList.add('is-missing')">
      <span class="affil__fallback">IIT Patna</span>
    </span>
    <span class="affil__name">IIT Patna</span>
    <span class="affil__role">M.Tech.</span>
    <span class="affil__years">2019 – 2021</span>
  </a>
</div>


## 🔍 Research Interests

<div class="interests">
{% for t in site.data.interests.tiles %}<a class="interest interest--{{ t.color | default: 'teal' }}{% if t.current %} is-current{% endif %}" href="{{ t.link | default: '#' }}"><span class="interest__icon" aria-hidden="true">{{ t.icon }}</span><span class="interest__title">{{ t.title }}{% if t.current %} <em class="interest__now">Now</em>{% endif %}</span><span class="interest__keys">{% for k in t.keywords %}<span>{{ k }}</span>{% endfor %}</span>{% if t.venues %}<span class="interest__venues">{{ t.venues }}</span>{% endif %}<svg class="interest__motif" viewBox="0 0 64 64" aria-hidden="true"><g class="interest__edges"><line x1="14" y1="16" x2="40" y2="12"/><line x1="40" y1="12" x2="50" y2="38"/><line x1="14" y1="16" x2="26" y2="42"/><line x1="26" y1="42" x2="50" y2="38"/><line x1="40" y1="12" x2="26" y2="42"/></g><g class="interest__nodes"><circle cx="14" cy="16" r="4"/><circle cx="40" cy="12" r="5"/><circle cx="50" cy="38" r="4"/><circle cx="26" cy="42" r="6"/></g></svg></a>
{% endfor %}</div>

## 📢 Recent News

<div class="news-box" tabindex="0" aria-label="Recent news (scrollable)">
{% for item in site.data.news %}<p class="news-item"><b class="news-date">{{ item.date }}</b><span class="news-sep">—</span><span class="news-text">{% if item.icon %}{{ item.icon }} {% endif %}{{ item.text | markdownify | remove: '<p>' | remove: '</p>' | strip }}</span></p>
{% endfor %}</div>

<script>
(function () {
  var aff = document.querySelector('.affiliations');
  if (!aff) return;
  var root = aff.parentNode;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mark pieces of the page so the styles can target them */
  root.classList.add('home');
  var social = root.querySelector('.fa-linkedin');
  social = social && social.closest('div');
  if (social) social.classList.add('home-social');
  aff.querySelectorAll('.affil').forEach(function (a) {
    if (/present/i.test(a.querySelector('.affil__years').textContent)) a.classList.add('is-current');
  });
  var updates = Array.prototype.find.call(root.querySelectorAll('h2'), function (h) { return /news|updates/i.test(h.textContent); });
  var newsBox = root.querySelector('.news-box');
  var newsItems = newsBox ? newsBox.querySelectorAll('.news-item') : [];
  if (newsItems.length) {
    var badge = document.createElement('span');
    badge.className = 'home-new';
    badge.textContent = 'NEW';
    newsItems[0].appendChild(badge);
  }

  /* Recent News: back to the newest item whenever the visitor leaves the page
     (switches tab, navigates away and returns) or scrolls the box out of view */
  function resetNews() { if (newsBox) newsBox.scrollTop = 0; }
  window.addEventListener('pageshow', resetNews);
  window.addEventListener('pagehide', resetNews);
  document.addEventListener('visibilitychange', function () { if (document.hidden) resetNews(); });
  if (newsBox && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) resetNews();
    }).observe(newsBox);
  }

  if (reduce || !('IntersectionObserver' in window)) return;
  root.classList.add('home--animate');

  /* Stagger groups of siblings */
  function stagger(list, step, base) {
    Array.prototype.forEach.call(list, function (el, i) {
      el.classList.add('reveal');
      el.dataset.delay = (base || 0) + i * step + 'ms';
    });
  }
  stagger(Array.prototype.filter.call(root.children, function (el) {
    return el.tagName === 'P' && !el.closest('.affiliations');
  }), 120);
  stagger(aff.querySelectorAll('.affil'), 110, 250);
  stagger(root.querySelectorAll('.interest'), 90);
  stagger(root.querySelectorAll('.interests-summary'), 0);
  if (social) stagger(social.querySelectorAll('a'), 80, 150);
  if (updates) stagger([updates], 0);
  if (newsBox) stagger([newsBox], 0);
  stagger(newsItems, 60);

  /* Play the reveal every time an element enters the screen, and reset it
     when it leaves, so it animates again on scroll up or down */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var el = e.target;
      clearTimeout(el._revealTimer);
      if (e.isIntersecting) {
        el.style.transitionDelay = el.dataset.delay || '0ms';
        el.classList.add('is-visible');
        /* drop the delay afterwards so hover effects respond instantly */
        el._revealTimer = setTimeout(function () { el.style.transitionDelay = ''; }, 1600);
      } else {
        el.style.transitionDelay = '0ms';
        el.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  root.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* Highlighter sweep on bold keywords, replayed whenever the intro comes back into view */
  var hlTimer;
  var hl = new IntersectionObserver(function (entries) {
    clearTimeout(hlTimer);
    if (entries[entries.length - 1].isIntersecting) {
      hlTimer = setTimeout(function () { root.classList.add('home--highlight'); }, 500);
    } else {
      root.classList.remove('home--highlight');
    }
  }, { threshold: 0.2 });
  var firstP = root.querySelector(':scope > p');
  if (firstP) hl.observe(firstP);
})();
</script>
