/* NursePath: keep the icon on every tool screen identical to the icon on its
   Tools hub card. The hub card SVG is the single source of truth; this script
   clones it into each tool's title (and into the Study header). */
(function () {
  'use strict';

  var TITLE_TARGETS = {
    vitals: '#vital-signs-section h2',
    iv: '#iv-calc-section h3',
    bmi: '#bmi-calc-section h3',
    aog: '#aog-edd-section h3',
    peds: '#peds-dose-section h3',
    apgar: '#apgar-section .learn-title',
    gcs: '#gcs-section .learn-title',
    braden: '#braden-section .learn-title',
    ron: '#ron-section .learn-title'
  };

  function hubSvg(toolId) {
    var card = document.querySelector('.tool-hub-card[onclick="openHubTool(\'' + toolId + '\')"] .tool-hub-icon svg');
    return card || null;
  }

  function buildIcon(toolId) {
    var src = hubSvg(toolId);
    if (!src) return null;
    var wrap = document.createElement('span');
    wrap.className = 'np-tool-icon';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.setAttribute('data-tool-icon', toolId);
    wrap.appendChild(src.cloneNode(true));
    return wrap;
  }

  function placeIcon(heading, toolId) {
    if (!heading) return;
    var icon = buildIcon(toolId);
    if (!icon) return;
    // Remove whatever icon/badge the title had before (VS badge, mismatched svg).
    var old = heading.querySelectorAll(':scope > .vitals-title-badge, :scope > svg, :scope > .np-tool-icon');
    old.forEach(function (n) { n.remove(); });
    heading.insertBefore(icon, heading.firstChild);
    heading.classList.add('np-tool-title');
  }

  function syncClinicalTitles() {
    Object.keys(TITLE_TARGETS).forEach(function (id) {
      placeIcon(document.querySelector(TITLE_TARGETS[id]), id);
    });
  }

  function syncStudyHeader(toolId) {
    var h = document.getElementById('studyClassTitle');
    if (!h) return;
    placeIcon(h, toolId);
  }

  function fillPlaceholderIcons() {
    if (!window.NPRef) return;
    document.querySelectorAll('[data-ic]').forEach(function (el) {
      if (!el.firstChild) el.innerHTML = window.NPRef.icon(el.getAttribute('data-ic'));
    });
  }

  function wrapStudyOpener() {
    if (typeof window.openStudyTool !== 'function' || window.openStudyTool.__npIcons) return;
    var original = window.openStudyTool;
    var wrapped = function (toolId) {
      var out = original.apply(this, arguments);
      syncStudyHeader(toolId);
      return out;
    };
    wrapped.__npIcons = true;
    window.openStudyTool = wrapped;
  }

  function init() {
    syncClinicalTitles();
    fillPlaceholderIcons();
    wrapStudyOpener();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();