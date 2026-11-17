// המרכז הפדגוגי של הכפר הירוק — לשוניות ולוח זמנים

/* ===================== קישורים להחלפה קלה =====================
   REG_URL          – טופס ההרשמה לבינגוגיה. ריק ('') = לחיצה מציגה "ההרשמה תיפתח בקרוב".
   COURSE_SITE_URL  – אתר הקורס בינגוגיה. ריק ('') = הכפתור "🌐 לאתר הקורס" מוסתר.
   קורס נוסף: מוסיפים שורה ב-REG_LINKS (למשל  dmokratia: 'https://...') ובאתר כפתור
   <a class="button primary reg-btn" data-reg="dmokratia" href="#">✍️ להרשמה</a>          */
var REG_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdoZYWjnGsq8cGawnPKTwRwSnHYxWAxN_qA-TmIJpA7QG8shA/viewform';
var COURSE_SITE_URL = '';

var MATZPEN_URL = 'https://mpm.education.gov.il/rishum/pitronLemidaMurchav/2027/209214/0/7/true';  // ההרשמה המרכזית: פתרון למידה 209214
var REG_LINKS  = { bingogia: MATZPEN_URL, 'bingogia-form': REG_URL };
var SITE_LINKS = { bingogia: COURSE_SITE_URL };

/* מועדי בינגוגיה (תשפ״ז). note = מפגש מיוחד שיודגש */
var BINGOGIA_DATES = [
  { date: '2026-11-17' },
  { date: '2026-12-01' },
  { date: '2026-12-15' },
  { date: '2026-12-29' },
  { date: '2027-01-05' },
  { date: '2027-01-21', note: 'מליאה' },
  { date: '2027-02-02' },
  { date: '2027-02-16' },
  { date: '2027-03-16' },
  { date: '2027-06-01', note: 'מליאת סיכום' }
];
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  var HEB_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  function bingogiaDateLabels() {
    return BINGOGIA_DATES.map(function (x) {
      var p = x.date.split('-');
      var d = new Date(+p[0], +p[1] - 1, +p[2]);
      var s = 'יום ' + HEB_DAYS[d.getDay()] + ', ' + (+p[2]) + '.' + (+p[1]) + '.' + p[0];
      return x.note ? s + ' · ' + x.note : s;
    });
  }

  /* ===== כפתורי הרשמה ואתר קורס ===== */
  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { alert(msg); return; }
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function wireButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-reg]'), function (b) {
      var url = REG_LINKS[b.getAttribute('data-reg')];
      if (url) {
        b.href = url; b.target = '_blank'; b.rel = 'noopener';
      } else {
        b.href = '#';
        b.addEventListener('click', function (e) { e.preventDefault(); toast('ההרשמה תיפתח בקרוב 🌱'); });
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-site]'), function (b) {
      var url = SITE_LINKS[b.getAttribute('data-site')];
      if (url) { b.href = url; b.hidden = false; } else { b.hidden = true; }
    });
  }

  /* ===== לוח זמנים: לעדכון מועדים, מוסיפים תאריכים למערך dates של כל פריט ===== */
  var SCHEDULE = [
    {
      title: 'מליאת המרכז הפדגוגי',
      href: '#home',
      who: 'כל צוות ההוראה',
      details: 'לכל המורות והמורים',
      when: 'יום חמישי, 21.1.2027',
      dates: [],
      status: 'open'
    },
    {
      title: 'בינגוגיה · פדגוגיה אנושית – בינה מלאכותית',
      href: '#course-mi',
      who: 'מובילים: חגית ברגמן ואבי תירוש',
      details: '10 מפגשים · 14:25–16:20 · בניין המעבדות, מעבדת כימיה',
      when: '',
      dates: bingogiaDateLabels(),
      status: 'open'
    },
    {
      title: 'חינוך לדמוקרטיה למחנכים',
      href: '#course-democracy',
      who: 'קורס למחנכים',
      details: '',
      when: 'הסתיים בהצלחה',
      dates: [],
      status: 'done'
    }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function renderSchedule() {
    var list = document.getElementById('timeline');
    if (!list) return;
    list.textContent = '';
    SCHEDULE.forEach(function (item, i) {
      var li = el('li', 'tl-item' + (item.status === 'done' ? ' done' : ''));
      var node = el('span', 'node', String(i + 1));
      node.setAttribute('aria-hidden', 'true');
      var card = el('div', 'tl-card');
      var h = el('h2');
      var a = el('a', '', item.title);
      a.href = item.href;
      h.appendChild(a);
      card.appendChild(h);
      var dl = el('dl', 'tl-rows');
      function row(k, v) {
        if (!v) return;
        dl.appendChild(el('dt', '', k));
        dl.appendChild(el('dd', '', v));
      }
      row('מי', item.who);
      row('מבנה', item.details);
      row('מתי', item.dates.length ? '' : item.when);
      card.appendChild(dl);
      if (item.dates.length) {
        var ol = el('ol', 'tl-dates');
        item.dates.forEach(function (d) { ol.appendChild(el('li', d.indexOf(' · ') > -1 ? 'key' : '', d)); });
        card.appendChild(ol);
      }
      li.appendChild(node);
      li.appendChild(card);
      list.appendChild(li);
    });
  }

  /* ===== לשוניות ===== */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));
  var DEFAULT = 'home';

  function panelFor(id) {
    var target = id ? document.getElementById(id) : null;
    if (!target) return { panel: document.getElementById(DEFAULT), target: null };
    var panel = target.closest('[role="tabpanel"]');
    if (!panel) return { panel: document.getElementById(DEFAULT), target: null };
    return { panel: panel, target: target === panel ? null : target };
  }

  function show(id, opts) {
    opts = opts || {};
    var found = panelFor(id);
    var panel = found.panel;
    var tabId = panel.getAttribute('aria-labelledby');
    panels.forEach(function (p) { p.hidden = p !== panel; });
    tabs.forEach(function (t) {
      var on = t.id === tabId;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      if (on && t.scrollIntoView) {
        try { t.scrollIntoView({ block: 'nearest', inline: 'nearest' }); } catch (e) { /* ישן */ }
      }
    });
    if (found.target) {
      if (found.target.tagName === 'DETAILS') found.target.open = true;
      found.target.scrollIntoView({ block: 'start' });
    } else if (!opts.initial) {
      window.scrollTo(0, 0);
    }
    if (opts.focus) {
      var focusEl = found.target || panel.querySelector('h1') || panel;
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    }
  }

  function currentId() {
    var h = decodeURIComponent(location.hash.replace(/^#/, ''));
    return h || DEFAULT;
  }

  window.addEventListener('hashchange', function () { show(currentId(), { focus: true }); });

  tabs.forEach(function (t, i) {
    t.addEventListener('keydown', function (e) {
      var next = null;
      // ב-RTL: חץ שמאלה = הלשונית הבאה
      if (e.key === 'ArrowLeft') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowRight') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        location.hash = next.getAttribute('href');
      }
    });
    t.addEventListener('click', function () {
      if (location.hash === t.getAttribute('href')) show(currentId());
    });
  });

  wireButtons();
  renderSchedule();
  show(currentId(), { initial: true });
})();
