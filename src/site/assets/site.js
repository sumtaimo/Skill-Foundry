/**
 * Skill Foundry showcase behaviour: theme, language, copy buttons, typing hero prompt,
 * skill chips, question bar progress and active tab, skill search and role filter,
 * and install commands built from the page address.
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
  function systemDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') root.setAttribute('data-theme', theme);
  }
  applyTheme(load('sf-theme'));

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
    /* Nodes whose markup must stay exact carry no data-i18n attribute; map them by selector. */
    var leads = [['.plate-type', 'plate.type'], ['.plate-get', 'plate.get']];
    for (var j = 0; j < leads.length; j++) {
      var els = document.querySelectorAll(leads[j][0]);
      for (var e = 0; e < els.length; e++) {
        var first = els[e].firstChild;
        var nextLead = dict[leads[j][1]];
        var prevLead = els[e].getAttribute('data-lead') || DICTS.en[leads[j][1]] || '';
        if (typeof nextLead === 'string' && first && first.nodeType === 3 && first.nodeValue.indexOf(prevLead) === 0) {
          first.nodeValue = nextLead + first.nodeValue.slice(prevLead.length);
          els[e].setAttribute('data-lead', nextLead);
        }
      }
    }
    var takes = [['what-you-type', 'take.type'], ['what-you-get', 'take.get'], ['how-you-know', 'take.know']];
    for (var k = 0; k < takes.length; k++) {
      var strong = document.querySelector('#' + takes[k][0] + ' > .takeaway strong');
      if (strong && typeof dict[takes[k][1]] === 'string') strong.textContent = dict[takes[k][1]];
    }
    var ph = document.querySelectorAll('[data-i18n-placeholder]');
    for (var q = 0; q < ph.length; q++) {
      var pk = ph[q].getAttribute('data-i18n-placeholder');
      if (typeof dict[pk] === 'string') ph[q].setAttribute('placeholder', dict[pk]);
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
    var dark = (root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light')) === 'dark';
    var tb = document.querySelector('[data-action="theme"]');
    if (tb) { tb.setAttribute('aria-pressed', dark ? 'true' : 'false'); setLabel(tb, dark ? 'theme.toLight' : 'theme.toDark'); }
    setLabel(document.querySelector('[data-action="lang"]'), lang === 'en' ? 'lang.toKh' : 'lang.toEn');
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
    var prevKey = label ? label.getAttribute('data-i18n') : null;
    btn.classList.add(ok ? 'done' : 'fail');
    if (label) { label.setAttribute('data-i18n', ok ? 'copy.done' : 'copy.fail'); label.textContent = text(ok ? 'copy.done' : 'copy.fail'); }
    window.setTimeout(function () {
      btn.classList.remove('done', 'fail');
      if (label && prevKey) { label.setAttribute('data-i18n', prevKey); label.textContent = text(prevKey); }
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

  /* Hero: type the prompt, swap covers from build-time templates. */
  var typingTimer = 0;
  function typePrompt(full) {
    var code = document.querySelector('.hero-prompt code');
    if (!code) return;
    window.clearTimeout(typingTimer);
    code.setAttribute('data-full', full);
    if (reducedMotion()) { code.textContent = full; return; }
    var i = 0;
    code.textContent = '';
    code.classList.add('typing');
    (function step() {
      i++;
      code.textContent = full.slice(0, i);
      if (i < full.length) typingTimer = window.setTimeout(step, 28);
      else code.classList.remove('typing');
    })();
  }

  function selectSkill(chip) {
    var name = chip.getAttribute('data-skill');
    var chips = document.querySelectorAll('.hero-chips .chip');
    for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', chips[i] === chip ? 'true' : 'false');
    var figure = document.querySelector('.hero-figure');
    var tpls = document.querySelectorAll('template[data-cover]');
    for (var j = 0; j < tpls.length; j++) {
      if (figure && tpls[j].getAttribute('data-cover') === name) {
        figure.textContent = '';
        figure.appendChild(document.importNode(tpls[j].content, true));
        figure.setAttribute('data-skill', name);
      }
    }
    typePrompt(chip.getAttribute('data-prompt') || '');
  }

  function setupHero() {
    var code = document.querySelector('.hero-prompt code');
    if (code) typePrompt(code.getAttribute('data-full') || code.textContent || '');
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

  /* Install commands: over http(s) the zip URL is known, so copy a full download, verify and unzip command. */
  function siteRoot() {
    var sc = document.querySelector('script[src$="assets/site.js"]');
    return sc ? new URL('../', sc.src) : null;
  }
  function setupInstall() {
    if (!/^https?:$/.test(window.location.protocol)) return;
    var rootUrl = siteRoot();
    if (!rootUrl) return;
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

  function init() {
    if (lang !== 'en') applyLang(lang);
    else syncButtons();
    document.addEventListener('click', function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'theme') {
        var cur = root.getAttribute('data-theme') || (systemDark() ? 'dark' : 'light');
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
      } else if (btn.classList.contains('chip') && btn.hasAttribute('data-skill')) {
        selectSkill(btn);
      } else if (btn.hasAttribute('data-copy')) {
        copy(btn);
      }
    });
    setupHero();
    setupQbar();
    setupFinder();
    setupInstall();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
