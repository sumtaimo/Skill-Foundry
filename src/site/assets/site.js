/**
 * Skill Foundry showcase behaviour: theme, language, copy buttons, section bar progress and
 * active tab with a sliding highlight, scroll reveal, count-up stats, skill search and role filter, and the zip fallback and agent prompt built from the page address.
 * DICTS is injected at build time from src/site/lib/i18n.mjs. No external scripts.
 * @governed-by PO_ARCHITECT
 */
(function () {
  'use strict';
  var DICTS = /*__DICTS__*/ { en: {}, kh: {} };
  var root = document.documentElement;
  document.documentElement.classList.add('js');

  function load(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return load('sf-theme') === 'dark' ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
  }
  applyTheme(load('sf-theme') === 'dark' ? 'dark' : 'light');

  var lang = load('sf-lang') === 'kh' ? 'kh' : 'en';

  function fill(s, args) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return args && Object.prototype.hasOwnProperty.call(args, k) ? String(args[k]) : m;
    });
  }
  function argsOf(el) {
    var raw = el.getAttribute('data-i18n-args');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }
  function text(key) { return (DICTS[lang] && DICTS[lang][key]) || DICTS.en[key] || ''; }

  function applyLang(next) {
    if (!DICTS[next]) return;
    lang = next;
    root.setAttribute('lang', next === 'kh' ? 'km' : 'en');
    var dict = DICTS[next];
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute('data-i18n');
      if (typeof dict[key] === 'string') nodes[i].textContent = fill(dict[key], argsOf(nodes[i]));
    }
    var ph = document.querySelectorAll('[data-i18n-placeholder]');
    for (var q = 0; q < ph.length; q++) {
      var pk = ph[q].getAttribute('data-i18n-placeholder');
      if (typeof dict[pk] === 'string') ph[q].setAttribute('placeholder', dict[pk]);
    }
    var ar = document.querySelectorAll('[data-i18n-aria]');
    for (var r = 0; r < ar.length; r++) {
      var ak = ar[r].getAttribute('data-i18n-aria');
      if (typeof dict[ak] === 'string') ar[r].setAttribute('aria-label', dict[ak]);
    }
    syncButtons();
  }

  /* Theme and language buttons name the action they perform. */
  function setLabel(btn, key) {
    var span = btn && btn.querySelector('[data-i18n]');
    if (!span) return;
    span.setAttribute('data-i18n', key);
    span.textContent = text(key);
  }
  function syncButtons() {
    var dark = currentTheme() === 'dark';
    var tb = document.querySelector('[data-action="theme"]');
    if (tb) { tb.setAttribute('aria-pressed', dark ? 'true' : 'false'); setLabel(tb, dark ? 'theme.toLight' : 'theme.toDark'); }
    var lb = document.querySelector('[data-action="lang"]');
    setLabel(lb, lang === 'en' ? 'lang.toKh' : 'lang.toEn');
    if (lb) lb.setAttribute('lang', lang === 'en' ? 'km' : 'en');
  }

  function fallbackCopy(value) {
    var ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function flash(btn, ok) {
    var label = btn.querySelector('[data-i18n]');
    if (!btn._origCopyKey && label) btn._origCopyKey = label.getAttribute('data-i18n');
    if (btn._flashTimer) window.clearTimeout(btn._flashTimer);
    btn.classList.remove('done', 'fail');
    btn.classList.add(ok ? 'done' : 'fail');
    if (label) { label.setAttribute('data-i18n', ok ? 'copy.done' : 'copy.fail'); label.textContent = text(ok ? 'copy.done' : 'copy.fail'); }
    btn._flashTimer = window.setTimeout(function () {
      btn._flashTimer = 0;
      btn.classList.remove('done', 'fail');
      if (label && btn._origCopyKey) { label.setAttribute('data-i18n', btn._origCopyKey); label.textContent = text(btn._origCopyKey); }
    }, 1600);
  }

  function copy(btn) {
    var value = btn.getAttribute('data-copy') || '';
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(function () { flash(btn, true); }, function () { flash(btn, fallbackCopy(value)); });
    } else {
      flash(btn, fallbackCopy(value));
    }
  }

  /* Header: transparent over the hero; is-scrolled once the page moves more than 8px (checked on load too). */
  function setupHeader() {
    var header = document.querySelector('.top');
    if (!header) return;
    function update() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Question bar: progress width from scroll, active tab from the section in view. */
  function setupQbar() {
    var bar = document.querySelector('.qbar');
    if (!bar) return;
    var progress = bar.querySelector('.qbar-progress');
    var links = Array.prototype.slice.call(bar.querySelectorAll('a[href^="#"]'));
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
      if (progress) progress.style.width = (p * 100).toFixed(2) + '%';
      var edge = bar.getBoundingClientRect().bottom + 24;
      var current = 0;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].getBoundingClientRect().top <= edge) current = i;
      }
      for (var j = 0; j < links.length; j++) {
        if (j === current) links[j].setAttribute('aria-current', 'true'); else links[j].removeAttribute('aria-current');
      }
      var stickTop = parseFloat(window.getComputedStyle(bar).top) || 0;
      bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= stickTop + 1 && window.scrollY > 8);
      moveIndicator(links[current]);
    }
    var ind = bar.querySelector('.qbar-ind');
    function moveIndicator(a) {
      if (!ind || !a) return;
      ind.style.width = a.offsetWidth + 'px';
      ind.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      ind.classList.add('is-on');
    }
    function schedule() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  /* Finder: text search over data-text plus one role filter; shows a live count and an empty state. */
  var role = '';
  function applyFilter() {
    var input = document.getElementById('find');
    var plates = document.querySelectorAll('.plate');
    if (!input || !plates.length) return;
    var words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    for (var i = 0; i < plates.length; i++) {
      var hay = plates[i].getAttribute('data-text') || '';
      var roles = ' ' + (plates[i].getAttribute('data-roles') || '') + ' ';
      var ok = (!role || roles.indexOf(' ' + role + ' ') >= 0);
      for (var w = 0; ok && w < words.length; w++) if (hay.indexOf(words[w]) < 0) ok = false;
      plates[i].hidden = !ok;
      if (ok) shown++;
    }
    var count = document.querySelector('.find-count');
    if (count) {
      count.setAttribute('data-i18n-args', JSON.stringify({ n: shown, t: plates.length }));
      count.textContent = fill(text('find.count'), { n: shown, t: plates.length });
    }
    var none = document.querySelector('.find-none');
    if (none) none.hidden = shown !== 0;
    var grid = document.querySelector('.grid');
    if (grid) {
      if (role || words.length) grid.setAttribute('data-filtered', 'true');
      else grid.removeAttribute('data-filtered');
    }
  }
  function selectRole(btn) {
    role = btn.getAttribute('data-role') || '';
    var all = document.querySelectorAll('.rolechip');
    for (var i = 0; i < all.length; i++) all[i].setAttribute('aria-pressed', all[i] === btn ? 'true' : 'false');
    applyFilter();
  }
  function setupFinder() {
    var input = document.getElementById('find');
    if (!input) return;
    input.addEventListener('input', applyFilter);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') { input.value = ''; applyFilter(); } });
  }

  /* Zip fallback: over http(s) the zip URL is known, so copy a full download, verify and unzip command; fill the agent prompt with this site's address. */
  function siteRoot() {
    var sc = document.querySelector('script[src$="assets/site.js"]');
    return sc ? new URL('../', sc.src) : null;
  }
  function setupInstall() {
    if (!/^https?:$/.test(window.location.protocol)) return;
    var rootUrl = siteRoot();
    if (!rootUrl) return;
    var ap = document.querySelectorAll('[data-agent-prompt]');
    for (var k = 0; k < ap.length; k++) {
      var filled = ap[k].getAttribute('data-agent-prompt').split('{site}').join(rootUrl.href);
      ap[k].setAttribute('data-copy', filled);
      var pre = ap[k].parentNode && ap[k].parentNode.querySelector('.agent-prompt');
      if (pre) pre.textContent = filled;
    }
    var btns = document.querySelectorAll('[data-install-zip]');
    for (var i = 0; i < btns.length; i++) {
      var zip = btns[i].getAttribute('data-install-name');
      var sha = btns[i].getAttribute('data-sha256-install');
      if (!zip || !/^[0-9a-f]{64}$/.test(sha || '')) continue;
      var url = new URL(btns[i].getAttribute('data-install-zip'), rootUrl).href;
      var cmd = 'mkdir -p .claude/skills && curl -fsSL "' + url + '" -o "' + zip + '" && echo "' + sha + '  ' + zip + '" | shasum -a 256 -c - && unzip -oq "' + zip + '" -d .claude/skills && rm "' + zip + '"';
      btns[i].setAttribute('data-copy', cmd);
      var box = btns[i].parentNode && btns[i].parentNode.querySelector('.install-cmd');
      if (box) box.textContent = cmd;
    }
  }

  /* Scroll reveal: marks section heads and cards with .reveal, staggers cards per 3-col row by 35ms (--i: 0..2),
     adds .is-in when near or inside the viewport, with a scroll sweep fallback so fast scrolling never leaves ghost cards. */
  var REVEAL = '.sec-head, .plate, .stat, .steps > .step, .agent-card, .limit, .faq-box, main > .stage';
  function setupReveal() {
    var els = document.querySelectorAll(REVEAL);
    if (!els.length) return;
    var still = reducedMotion() || !('IntersectionObserver' in window);
    var pending = [];
    function show(el) {
      if (el.classList.contains('is-in')) return;
      el.classList.add('is-in');
      window.setTimeout(function () { el.style.removeProperty('--i'); }, 500);
    }
    var io = still ? null : new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { show(entries[i].target); io.unobserve(entries[i].target); }
      }
    }, { rootMargin: '0px 0px 140px 0px', threshold: 0.01 });
    function sweep() {
      var vh = window.innerHeight || 900;
      for (var k = pending.length - 1; k >= 0; k--) {
        var el = pending[k];
        if (el.classList.contains('is-in')) { pending.splice(k, 1); continue; }
        var r = el.getBoundingClientRect();
        if (r.top < vh + 140 && r.bottom > -40) {
          show(el);
          if (io) io.unobserve(el);
          pending.splice(k, 1);
        }
      }
    }
    var vh0 = window.innerHeight || 900;
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      var sibs = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      if (el.matches('.plate')) el.style.setProperty('--i', String(sibs % 3));
      else if (el.matches('.stat, .step, .limit')) el.style.setProperty('--i', String(Math.min(sibs, 2)));
      if (still) { el.classList.add('reveal', 'is-in'); continue; }
      el.classList.add('reveal');
      var r = el.getBoundingClientRect();
      if (r.top < vh0 + 140 && r.bottom > -40) show(el);
      else { io.observe(el); pending.push(el); }
    }
    if (!still && pending.length) {
      window.addEventListener('scroll', sweep, { passive: true });
      window.addEventListener('resize', sweep, { passive: true });
    }
  }

  /* Stats count up from 0 once when first visible; the final text stays the real number. */
  function countUp(el) {
    var final = el.textContent;
    var parts = final.split(/(\d+)/);
    if (parts.length < 2) return;
    var t0 = 0, dur = 600;
    function frame(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = parts.map(function (x, i) { return i % 2 ? String(Math.round(Number(x) * e)) : x; }).join('');
      if (k < 1) window.requestAnimationFrame(frame); else el.textContent = final;
    }
    window.requestAnimationFrame(frame);
  }
  function setupCount() {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { countUp(entries[i].target); io.unobserve(entries[i].target); }
      }
    }, { threshold: 0.5 });
    for (var j = 0; j < nums.length; j++) io.observe(nums[j]);
  }

  function forceTopIfNoHash() {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }

  function init() {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    forceTopIfNoHash();
    window.requestAnimationFrame(forceTopIfNoHash);
    window.addEventListener('load', forceTopIfNoHash, { once: true });
    window.addEventListener('pageshow', forceTopIfNoHash);
    if (lang !== 'en') applyLang(lang);
    else syncButtons();
    document.addEventListener('click', function (ev) {
      var tgt = ev.target && ev.target.closest ? ev.target : null;
      var btn = tgt ? tgt.closest('button') : null;
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'theme') {
        var cur = currentTheme();
        var next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        save('sf-theme', next);
        syncButtons();
      } else if (action === 'lang') {
        var nl = lang === 'en' ? 'kh' : 'en';
        applyLang(nl);
        save('sf-lang', nl);
      } else if (btn.classList.contains('rolechip')) {
        selectRole(btn);
      } else if (btn.hasAttribute('data-copy')) {
        copy(btn);
      }
    });
    window.addEventListener('storage', function (ev) {
      if (ev.key === 'sf-theme') {
        applyTheme(ev.newValue === 'dark' ? 'dark' : 'light');
        syncButtons();
      }
    });
    setupHeader();
    setupQbar();
    setupFinder();
    setupInstall();
    setupReveal();
    setupCount();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* A link such as skills/x/index.html#answer opens the closed accordion it points into. */
  function openHash() {
    var id = (location.hash || '').slice(1);
    var el = id ? document.getElementById(id) : null;
    var d = el && (el.tagName === 'DETAILS' ? el : el.closest('details'));
    var opened = false;
    while (d) { d.open = true; opened = true; d = d.parentElement ? d.parentElement.closest('details') : null; }
    if (opened) el.scrollIntoView();
  }
  window.addEventListener('hashchange', openHash);
  openHash();
})();
