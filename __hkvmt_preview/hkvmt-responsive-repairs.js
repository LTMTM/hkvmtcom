(function () {
  'use strict';

  var scheduled = false;
  function overlaps(a, b) {
    return a && b && a.left < b.right && a.right > b.left &&
      a.top < b.bottom && a.bottom > b.top;
  }

  function update() {
    scheduled = false;
    var active = document.querySelector('.breakpoint.active');
    var button = active && active.querySelector('.backtotop');
    var spacer = active && active.querySelector('.verticalspacer');
    var footer = spacer && spacer.nextElementSibling;
    var table = active && active.querySelector('table.comparetable');
    var buttonRect = button && button.getBoundingClientRect();
    var blocked = buttonRect && (
      overlaps(buttonRect, footer && footer.getBoundingClientRect()) ||
      overlaps(buttonRect, table && table.getBoundingClientRect())
    );
    document.documentElement.classList.toggle('hkvmt-control-obscures', !!blocked);
  }

  function schedule() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(update);
    }
  }

  function prepareComparisonTable() {
    var cell = document.querySelector('#u846733 table.comparetable th:nth-child(2)');
    if (cell && !cell.querySelector('.hkvmt-mobile-traditional-label')) {
      var label = document.createElement('span');
      label.className = 'hkvmt-mobile-traditional-label';
      label.textContent = 'Traditional testing';
      cell.appendChild(label);
    }
  }

  function initialize() {
    prepareComparisonTable();
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="mediaactivities-en.htmll#"]'), function (link) {
      link.setAttribute('href', link.getAttribute('href').replace('mediaactivities-en.htmll#', 'mediaactivities-en.html#'));
    });
    schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}());
