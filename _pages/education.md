---
title: "Education"
permalink: /education/
layout: single
---

<div class="edu-timeline">
  <div class="edu-timeline__rail" aria-hidden="true"><span class="edu-timeline__progress"></span></div>

  <article class="edu">
    <span class="edu__marker" aria-hidden="true"></span>
    <div class="edu__card">
      <div class="edu__text">
        <span class="edu__years">2026</span>
        <h3 class="edu__degree">Visiting Junior Fellow</h3>
        <div class="edu__inst">Institute of Science Tokyo <span class="edu__aside">(formerly Tokyo Institute of Technology)</span>, Japan</div>
        <ul class="edu__meta">
          <li><span>Supervisor</span>Prof. Tsuyoshi Murata</li>
        </ul>
        <p class="edu__thesis"><span>Topic</span>“Towards OOD Robustness in Fair Graph Learning”</p>
      </div>
      <a class="edu__logo edu__logo--mark" href="https://www.isct.ac.jp/en" target="_blank" rel="noopener">
        <img src="/images/logos/science-tokyo-mark.png" alt="Institute of Science Tokyo logo" loading="lazy">
      </a>
    </div>
  </article>

  <article class="edu edu--current">
    <span class="edu__marker" aria-hidden="true"></span>
    <div class="edu__card">
      <div class="edu__text">
        <span class="edu__years">2021 – Present</span>
        <h3 class="edu__degree">Ph.D. in Electrical Engineering</h3>
        <div class="edu__inst">Indian Institute of Technology Delhi</div>
        <ul class="edu__meta">
          <li><span>CGPA</span>9.75 / 10</li>
          <li><span>Supervisors</span>Prof. Sandeep Kumar and Prof. Jayadeva</li>
        </ul>
        <p class="edu__thesis"><span>Thesis</span>“Optimization Methods for Trustworthy and Scalable GraphML”</p>
      </div>
      <a class="edu__logo" href="https://home.iitd.ac.in" target="_blank" rel="noopener">
        <img src="/images/logos/iit-delhi.png" alt="IIT Delhi logo" loading="lazy">
      </a>
    </div>
  </article>

  <article class="edu">
    <span class="edu__marker" aria-hidden="true"></span>
    <div class="edu__card">
      <div class="edu__text">
        <span class="edu__years">2019 – 2021</span>
        <h3 class="edu__degree">M.Tech. in Electrical Engineering</h3>
        <div class="edu__inst">Indian Institute of Technology Patna</div>
        <ul class="edu__meta">
          <li><span>CGPA</span>8.84 / 10</li>
          <li><span>Supervisor</span>Prof. Maheshkumar H. Kolekar</li>
        </ul>
        <p class="edu__thesis"><span>Thesis</span>“An Hybrid CNN-SVM for Medical Image Analysis”</p>
      </div>
      <a class="edu__logo" href="https://www.iitp.ac.in" target="_blank" rel="noopener">
        <img src="/images/logos/iit-patna.png" alt="IIT Patna logo" loading="lazy">
      </a>
    </div>
  </article>

  <article class="edu">
    <span class="edu__marker" aria-hidden="true"></span>
    <div class="edu__card">
      <div class="edu__text">
        <span class="edu__years">2014 – 2018</span>
        <h3 class="edu__degree">B.Tech. in Electronics and Communication Engineering</h3>
        <div class="edu__inst">Dr. A.P.J. Abdul Kalam Technical University, Lucknow</div>
        <ul class="edu__meta">
          <li><span>Grade</span>73.74 / 100</li>
        </ul>
      </div>
      <a class="edu__logo" href="https://aktu.ac.in" target="_blank" rel="noopener">
        <img src="/images/logos/aktu.png" alt="AKTU logo" loading="lazy"
             onerror="this.parentNode.classList.add('is-missing')">
        <span class="edu__monogram">AKTU</span>
      </a>
    </div>
  </article>
</div>

<script>
(function () {
  var tl = document.querySelector('.edu-timeline');
  if (!tl) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  tl.classList.add('edu-timeline--animate');

  /* Each entry animates in when it enters the screen and resets when it leaves */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('is-visible', e.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  tl.querySelectorAll('.edu').forEach(function (el) { io.observe(el); });

  /* The timeline line draws itself as you scroll through the page */
  var bar = tl.querySelector('.edu-timeline__progress'), ticking = false;
  function update() {
    ticking = false;
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = (vh * 0.75 - r.top) / r.height;
    bar.style.transform = 'scaleY(' + Math.max(0, Math.min(1, p)) + ')';
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
</script>
