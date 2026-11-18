/**
 * Skill Foundry showcase behaviour: theme, language, copy buttons, section bar progress and
 * active tab, skill search and role filter, and the zip fallback and agent prompt built from the page address.
 * DICTS is injected at build time from src/site/lib/i18n.mjs. No external scripts.
 * @governed-by PO_ARCHITECT
 */
(function () {
  'use strict';
  var DICTS = /*__DICTS__*/ { en: {}, kh: {} };
  var root = document.documentElement;

  function load(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } }
  function save(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked */ } }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    return load('sf-theme') === 'light' ? 'light' : 'dark';
  }
  function applyTheme(theme) {
    if (theme !== 'dark' && theme !== 'light') return;
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = theme;
  }
  applyTheme(load('sf-theme') === 'light' ? 'light' : 'dark');

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

  /* React Bits inspired pointer spotlight and subtle tilt on Bento cards. */
  function setupSpotlight() {
    if (reducedMotion()) return;
    if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;
    var cards = document.querySelectorAll('.plate');
    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        var rect = null;
        var raf = 0;
        var lastEv = null;
        function refreshRect() { rect = card.getBoundingClientRect(); }
        if ('ResizeObserver' in window) {
          new window.ResizeObserver(function () { rect = null; }).observe(card);
        }
        function paint() {
          raf = 0;
          if (!lastEv) return;
          if (!rect) refreshRect();
          if (!rect.width || !rect.height) return;
          var x = lastEv.clientX - rect.left;
          var y = lastEv.clientY - rect.top;
          var px = Math.max(0, Math.min(100, (x / rect.width) * 100));
          var py = Math.max(0, Math.min(100, (y / rect.height) * 100));
          var rx = ((py - 50) / 50) * -2.2;
          var ry = ((px - 50) / 50) * 2.2;
          card.style.setProperty('--mx', px.toFixed(1) + '%');
          card.style.setProperty('--my', py.toFixed(1) + '%');
          card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
          card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        }
        card.addEventListener('pointerenter', refreshRect);
        card.addEventListener('pointermove', function (ev) {
          lastEv = ev;
          if (!raf) raf = window.requestAnimationFrame(paint);
        });
        card.addEventListener('pointerleave', function () {
          lastEv = null;
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      })(cards[i]);
    }
  }

  /* Smooth entrance transitions below the fold; disabled immediately under reduced motion. */
  function setupReveal() {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.plate, main > section:not(.hero):not(.real-result)');
    if (!els.length) return;
    root.classList.add('sf-anim');
    var io = new window.IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.setAttribute('data-shown', 'true');
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.04 });
    var vh = window.innerHeight || 900;
    for (var j = 0; j < els.length; j++) {
      var r = els[j].getBoundingClientRect();
      if (r.top < vh * 0.96) els[j].setAttribute('data-shown', 'true');
      else io.observe(els[j]);
    }
  }

  function init() {
    if (lang !== 'en') applyLang(lang);
    else syncButtons();
    document.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
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
        applyTheme(ev.newValue === 'light' ? 'light' : 'dark');
        syncButtons();
      }
    });
    setupQbar();
    setupFinder();
    setupInstall();
    setupSpotlight();
    setupReveal();
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
