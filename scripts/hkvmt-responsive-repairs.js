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
    if (buttonRect && !blocked && active) {
      var artwork = active.querySelectorAll('a, p, img, .shadow.museBGSize, .hkvmt-gallery-card');
      for (var i = 0; i < artwork.length; i++) {
        if (overlaps(buttonRect, artwork[i].getBoundingClientRect())) {
          blocked = true;
          break;
        }
      }
    }
    document.documentElement.classList.toggle('hkvmt-control-obscures', !!blocked);

    // The decorative down arrow should not cover the news panel on phones.
    var down = active && active.querySelector('.pulldown');
    var news = active && active.querySelector('.stickright');
    if (down) {
      down.style.visibility = window.innerWidth <= 600 &&
        overlaps(down.getBoundingClientRect(), news && news.getBoundingClientRect())
        ? 'hidden' : '';
    }
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

  function updateAssessmentLinks() {
    var destinations = {
      'https://hkbu.questionpro.com/UserEntrance': 'https://hkbuchtl.qualtrics.com/jfe/form/SV_40n3q7cpgomFK98',
      'https://hkbu.questionpro.com/CARSTest': 'https://hkbuchtl.qualtrics.com/jfe/form/SV_eg4tImyNs7lmPae',
      'https://hkbu.questionpro.com/hkvmt-desktop': 'https://hkbuchtl.qualtrics.com/jfe/form/SV_bdDqF1BGRvpCPci'
    };
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="hkbu.questionpro.com/"]'), function (link) {
      var replacement = destinations[link.getAttribute('href')];
      if (replacement) link.setAttribute('href', replacement);
    });
  }

  function keepHomepageWordsTogether() {
    Array.prototype.forEach.call(document.querySelectorAll('#u815320 .bouncingtext .letters'), function (text) {
      var word = null;
      Array.prototype.slice.call(text.childNodes).forEach(function (node) {
        if (node.nodeType === 1 && node.classList.contains('letter')) {
          if (!word) {
            word = document.createElement('span');
            word.className = 'hkvmt-word';
            word.style.display = 'inline-block';
            word.style.whiteSpace = 'nowrap';
            text.insertBefore(word, node);
          }
          word.appendChild(node);
        } else {
          word = null;
        }
      });
    });
  }

  function initialize() {
    prepareComparisonTable();
    updateAssessmentLinks();
    keepHomepageWordsTogether();
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="mediaactivities-en.htmll#"]'), function (link) {
      link.setAttribute('href', link.getAttribute('href').replace('mediaactivities-en.htmll#', 'mediaactivities-en.html#'));
    });
    schedule();
    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        updateAssessmentLinks();
        keepHomepageWordsTogether();
        schedule();
      });
      Array.prototype.forEach.call(document.querySelectorAll('.breakpoint'), function (node) {
        observer.observe(node, { attributes: true, attributeFilter: ['class'] });
      });
    }
    // Muse switches breakpoints and rebuilds the news slider after load.
    window.setTimeout(schedule, 200);
    window.setTimeout(schedule, 1800);
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

/* Re-measure the news carousel after its fonts or Muse breakpoint settle. */
(function () {
  'use strict';
  if (!document.querySelector('.stickright .my-slider')) return;
  var pending = false;
  var activeBreakpoint = '';
  function refresh() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      var slider = document.querySelector('.breakpoint.active .stickright .my-slider.tns-vertical');
      if (slider && slider.getBoundingClientRect().width > 0) {
        window.dispatchEvent(new Event('resize'));
      }
    });
  }
  function breakpointChanged() {
    var node = document.querySelector('.breakpoint.active');
    var name = node ? node.id : '';
    if (name !== activeBreakpoint) {
      activeBreakpoint = name;
      refresh();
    }
  }
  if (window.MutationObserver) {
    var observer = new MutationObserver(breakpointChanged);
    Array.prototype.forEach.call(document.querySelectorAll('.breakpoint'), function (node) {
      observer.observe(node, { attributes: true, attributeFilter: ['class'] });
    });
  }
  breakpointChanged();
  var stylesheet = document.querySelector('link[href*="hkvmt-responsive-repairs.css"]');
  if (stylesheet) {
    if (stylesheet.sheet) refresh();
    else stylesheet.addEventListener('load', refresh, { once: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true });
}());
