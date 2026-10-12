// demo-init.js: page and playground script for index.html (Bootstrap Workbench home) and 404.html.
// Inlined as a classic <script> right before </body>, after the Bootstrap bundle, by
// tools/sync-demo.sh (this file is the source; never edit the inline copy).
// Self-contained: needs only bootstrap.bundle.min.js. Hooks are data-bw-* attributes.
// Every block below is guarded, so the script also works on a page that has only
// <section id="bw-demo"> (the playground pasted into another site).

(function () {
  'use strict';

  var html = document.documentElement;

  // Run once per page: a second copy of this script does nothing
  if (html.hasAttribute('data-bw-init')) return;
  html.setAttribute('data-bw-init', '');

  var demo = document.getElementById('bw-demo');

  // ------------------------------------------------------------------
  // HTML pretty-printer (same rules as the snippet generator in bsd-demo.js)
  // ------------------------------------------------------------------

  var VOID_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'];
  var INLINE_TAGS = ['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'button', 'cite', 'code', 'data', 'del', 'dfn', 'em', 'i',
    'img', 'input', 'ins', 'kbd', 'label', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup',
    'time', 'u', 'var', 'wbr', 'svg', 'path', 'circle', 'rect', 'use', 'g'];
  var RAW_TAGS = ['pre', 'textarea', 'script', 'style'];
  var BOOLEAN_ATTRS = ['disabled', 'checked', 'selected', 'readonly', 'required', 'multiple', 'hidden',
    'autofocus', 'open', 'novalidate', 'autoplay', 'controls', 'loop', 'muted'];
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var INDENT = '  ';

  function escapeText(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
  }

  function escapeAttr(str) {
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/ /g, '&nbsp;');
  }

  function tagName(el) {
    // localName keeps SVG camelCase names intact
    return el.localName;
  }

  function openTag(el) {
    var out = '<' + tagName(el);
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.value === '' && BOOLEAN_ATTRS.indexOf(attr.name) !== -1) {
        out += ' ' + attr.name;
      } else {
        out += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
      }
    }
    if (el.namespaceURI === SVG_NS && !el.childNodes.length) return out + '/>';
    return out + '>';
  }

  function closeTag(el) {
    var name = tagName(el);
    if (VOID_TAGS.indexOf(name) !== -1) return '';
    if (el.namespaceURI === SVG_NS && !el.childNodes.length) return '';
    return '</' + name + '>';
  }

  // Serialize a subtree verbatim (used for <pre> and friends where whitespace matters)
  function serializeRaw(node) {
    if (node.nodeType === Node.TEXT_NODE) return escapeText(node.data);
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    var out = openTag(node);
    for (var i = 0; i < node.childNodes.length; i++) out += serializeRaw(node.childNodes[i]);
    return out + closeTag(node);
  }

  // True if the node can be printed on a single line together with its siblings
  function isInline(node) {
    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) return true;
    if (node.nodeType !== Node.ELEMENT_NODE) return true;
    if (INLINE_TAGS.indexOf(tagName(node)) === -1) return false;
    for (var i = 0; i < node.childNodes.length; i++) {
      if (!isInline(node.childNodes[i])) return false;
    }
    return true;
  }

  // Serialize inline content on one line, collapsing whitespace like the browser would
  function serializeInline(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      var data = node.data;
      // Leading/trailing whitespace containing a newline is source indentation, not content
      if (!node.previousSibling) data = data.replace(/^\s*\n\s*/, '');
      if (!node.nextSibling) data = data.replace(/\s*\n\s*$/, '');
      return escapeText(data.replace(/\s+/g, ' '));
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    var out = openTag(node);
    for (var i = 0; i < node.childNodes.length; i++) out += serializeInline(node.childNodes[i]);
    return out + closeTag(node);
  }

  // True if the element's content should stay on one line. Block containers
  // holding only a list of elements (e.g. a btn-group) are broken into lines
  // even when those elements are inline, for readability.
  function childrenAreInline(el) {
    var elementCount = 0;
    var hasText = false;
    for (var i = 0; i < el.childNodes.length; i++) {
      var child = el.childNodes[i];
      if (!isInline(child)) return false;
      if (child.nodeType === Node.ELEMENT_NODE) elementCount++;
      if (child.nodeType === Node.TEXT_NODE && child.data.trim()) hasText = true;
    }
    if (INLINE_TAGS.indexOf(tagName(el)) === -1 && elementCount > 1 && !hasText) return false;
    return true;
  }

  function formatNode(node, depth, lines) {
    var pad = INDENT.repeat(depth);

    if (node.nodeType === Node.TEXT_NODE) {
      var text = node.data.replace(/\s+/g, ' ').trim();
      if (text) lines.push(pad + escapeText(text));
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;

    var name = tagName(node);

    // Inline <script>: keep the code verbatim, but replace its source
    // indentation with the snippet's own (one level below the tag)
    if (name === 'script') {
      var code = node.textContent.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
      var common = null;
      code.forEach(function (line) {
        if (!line.trim()) return;
        var lead = line.match(/^\s*/)[0].length;
        if (common === null || lead < common) common = lead;
      });
      lines.push(pad + openTag(node));
      code.forEach(function (line) {
        lines.push(line.trim() ? pad + INDENT + line.slice(common) : '');
      });
      lines.push(pad + closeTag(node));
      return;
    }

    if (RAW_TAGS.indexOf(name) !== -1) {
      lines.push(pad + serializeRaw(node));
      return;
    }

    if (VOID_TAGS.indexOf(name) !== -1) {
      lines.push(pad + openTag(node));
      return;
    }

    if (childrenAreInline(node)) {
      var inner = '';
      for (var i = 0; i < node.childNodes.length; i++) inner += serializeInline(node.childNodes[i]);
      lines.push(pad + openTag(node) + inner.trim() + closeTag(node));
      return;
    }

    lines.push(pad + openTag(node));
    for (var j = 0; j < node.childNodes.length; j++) formatNode(node.childNodes[j], depth + 1, lines);
    lines.push(pad + closeTag(node));
  }

  function format(nodes) {
    var lines = [];
    for (var i = 0; i < nodes.length; i++) formatNode(nodes[i], 0, lines);
    return lines.join('\n');
  }

  // Drop demo-only parts from a cloned subtree: [data-bw-skip] elements and
  // the snapshot hooks themselves. Other data-bw-* hooks (e.g. data-bw-toast)
  // stay, so the pasted markup keeps working with this script.
  function cleanClone(root) {
    var skipped = root.querySelectorAll('[data-bw-skip]');
    for (var i = 0; i < skipped.length; i++) skipped[i].remove();
    var hooks = ['data-bw-snippet', 'data-bw-skip'];
    var all = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    for (var j = 0; j < all.length; j++) {
      if (!all[j].removeAttribute) continue;
      for (var k = 0; k < hooks.length; k++) all[j].removeAttribute(hooks[k]);
    }
  }

  // ------------------------------------------------------------------
  // Snapshots. Taken synchronously while the page is parsed, i.e. before
  // DOMContentLoaded and before any Bootstrap component is initialized, so
  // tooltip attributes and collapse/carousel/tab state never leak into the
  // code. The snippet UI is added only after this point.
  // ------------------------------------------------------------------

  var sectionSnippets = [];
  var demoSnapshot = '';

  if (demo) {
    var sections = demo.querySelectorAll('[data-bw-snippet]');
    for (var s = 0; s < sections.length; s++) {
      var clone = sections[s].cloneNode(true);
      // The section heading labels the demo; the snippet is its content
      var heading = clone.querySelector(':scope > h2, :scope > h3, :scope > h4');
      if (heading) heading.remove();
      cleanClone(clone);
      sectionSnippets.push({ section: sections[s], code: format(clone.childNodes) });
    }

    var whole = demo.cloneNode(true);
    cleanClone(whole);
    demoSnapshot = [
      // '<' + '!--' and '<' + '/script>' keep the inline copy of this file parseable as HTML
      '<' + '!-- Bootstrap Workbench component playground (Bootstrap 5.3.8).',
      '     Paste into the <body> of a page that loads Bootstrap 5.3 CSS and bootstrap.bundle.min.js.',
      '     The script at the end starts tooltips, popovers and the "Show toast" button. -->',
      format([whole]),
      '<' + 'script>',
      '  document.addEventListener(\'DOMContentLoaded\', function () {',
      '    document.querySelectorAll(\'[data-bs-toggle="tooltip"]\').forEach(function (el) { bootstrap.Tooltip.getOrCreateInstance(el); });',
      '    document.querySelectorAll(\'[data-bs-toggle="popover"]\').forEach(function (el) { bootstrap.Popover.getOrCreateInstance(el); });',
      '    document.querySelectorAll(\'[data-bw-toast]\').forEach(function (button) {',
      '      button.addEventListener(\'click\', function () {',
      '        bootstrap.Toast.getOrCreateInstance(document.querySelector(button.getAttribute(\'data-bw-toast\'))).show();',
      '      });',
      '    });',
      '  });',
      '<' + '/script>'
    ].join('\n');
  }

  // ------------------------------------------------------------------
  // Snippet UI, styled like the snippets on classes.html: a "</>" toggle in
  // the section heading and a hidden code block with a Copy button at the
  // end of the section.
  // ------------------------------------------------------------------

  sectionSnippets.forEach(function (item, index) {
    var section = item.section;

    var wrapper = document.createElement('div');
    wrapper.id = 'bw-snippet-' + (index + 1);
    wrapper.className = 'position-relative mt-2 mb-3 d-none';

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2';
    button.textContent = 'Copy';
    button.setAttribute('data-bw-copy', '');

    var pre = document.createElement('pre');
    pre.className = 'bg-body-tertiary border rounded-3 p-3 pe-5 small mb-0';
    pre.style.maxHeight = '24rem';

    var code = document.createElement('code');
    // textContent escapes the markup exactly once for display
    code.textContent = item.code;

    pre.appendChild(code);
    wrapper.appendChild(button);
    wrapper.appendChild(pre);
    section.appendChild(wrapper);

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'btn btn-sm btn-outline-secondary py-0 px-2 font-monospace';
    toggle.textContent = '</>';
    toggle.setAttribute('data-bw-code', '');
    toggle.setAttribute('aria-controls', wrapper.id);
    toggle.setAttribute('aria-expanded', 'false');

    var heading = section.querySelector(':scope > h2, :scope > h3, :scope > h4');
    if (heading) {
      toggle.setAttribute('aria-label', 'Show code: ' + heading.textContent.trim());
      heading.classList.add('d-flex', 'align-items-center', 'gap-2');
      heading.appendChild(toggle);
    } else {
      toggle.setAttribute('aria-label', 'Show code');
      var bar = document.createElement('div');
      bar.className = 'd-flex justify-content-end mb-1';
      bar.appendChild(toggle);
      wrapper.insertAdjacentElement('beforebegin', bar);
    }
  });

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-bw-code]');
    if (!toggle) return;
    var wrapper = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!wrapper) return;
    var visible = toggle.getAttribute('aria-expanded') !== 'true';
    wrapper.classList.toggle('d-none', !visible);
    toggle.setAttribute('aria-expanded', visible ? 'true' : 'false');
    toggle.classList.toggle('active', visible);
  });

  // ------------------------------------------------------------------
  // Clipboard: async API where allowed, hidden textarea fallback otherwise
  // (file:// in some browsers, older browsers, denied permission)
  // ------------------------------------------------------------------

  var live = document.querySelector('[data-bw-live]');

  function announce(message) {
    if (!live) return;
    live.textContent = '';
    setTimeout(function () { live.textContent = message; }, 50);
  }

  function copyFallback(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.className = 'position-fixed top-0 start-0 opacity-0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return copyFallback(text); });
    }
    return Promise.resolve(copyFallback(text));
  }

  // Shows "Copied" / "Failed" on the button (or its label span) for 1.5 s
  function feedback(button, ok, message) {
    var label = button.querySelector('span') || button;
    var original = label.getAttribute('data-bw-label') || label.textContent;
    label.setAttribute('data-bw-label', original);
    label.textContent = ok ? 'Copied' : 'Failed';
    announce(ok ? message : 'Copy failed');
    clearTimeout(button.bwTimer);
    button.bwTimer = setTimeout(function () { label.textContent = original; }, 1500);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-bw-copy]');
    if (button) {
      var code = button.parentElement.querySelector('code');
      copyText(code.textContent).then(function (ok) { feedback(button, ok, 'Snippet copied to clipboard'); });
      return;
    }
    var all = event.target.closest('[data-bw-copy-all]');
    if (all) {
      copyText(demoSnapshot).then(function (ok) { feedback(all, ok, 'Entire demo copied to clipboard'); });
    }
  });

  // ------------------------------------------------------------------
  // Theme toggle: data-bs-theme on <html>, same storage key as the demo
  // pages, so the choice carries over between them. Images with
  // data-bw-src-light / data-bw-src-dark follow the theme.
  // ------------------------------------------------------------------

  var themeButton = document.querySelector('[data-bw-theme-toggle]');

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function currentTheme() {
    return html.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    if (themeButton) {
      themeButton.textContent = 'Theme: ' + theme;
      themeButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    var images = document.querySelectorAll('[data-bw-src-' + theme + ']');
    for (var i = 0; i < images.length; i++) {
      var src = images[i].getAttribute('data-bw-src-' + theme);
      if (images[i].getAttribute('src') !== src) images[i].setAttribute('src', src);
    }
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      storageSet('bsd-theme', next);
      applyTheme(next);
    });
  }

  var savedTheme = storageGet('bsd-theme');
  applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : currentTheme());

  // ------------------------------------------------------------------
  // Page details
  // ------------------------------------------------------------------

  // Footer year
  var years = document.querySelectorAll('[data-bw-year]');
  for (var y = 0; y < years.length; y++) years[y].textContent = new Date().getFullYear();

  // 404 page: the requested path (as text only) and an issue link prefilled with it
  var requested = window.location.pathname;
  try { requested = decodeURIComponent(requested); } catch (e) { /* keep it encoded */ }
  var paths = document.querySelectorAll('[data-bw-path]');
  for (var q = 0; q < paths.length; q++) paths[q].textContent = requested;
  var report = document.querySelector('[data-bw-report]');
  if (report) {
    report.href = report.getAttribute('href').replace(/\/$/, '') + '/new?title=' +
      encodeURIComponent('Broken link: ' + requested);
  }

  // Anchor targets land below the sticky navbar
  var sticky = document.querySelector('[data-bw-sticky]');
  function updateScrollPadding() {
    if (sticky) html.style.scrollPaddingTop = (sticky.offsetHeight + 8) + 'px';
  }
  updateScrollPadding();
  window.addEventListener('resize', updateScrollPadding);

  // Demo forms never submit
  if (demo) {
    demo.addEventListener('submit', function (event) { event.preventDefault(); });
  }

  // ------------------------------------------------------------------
  // Bootstrap components that are opt-in (after the snapshots above)
  // ------------------------------------------------------------------

  function initBootstrap() {
    if (!window.bootstrap) return;

    // Document-wide, as in the Bootstrap docs
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (el) {
      bootstrap.Tooltip.getOrCreateInstance(el);
    });
    document.querySelectorAll('[data-bs-toggle="popover"]').forEach(function (el) {
      bootstrap.Popover.getOrCreateInstance(el);
    });

    // data-bw-toast="#id": a button that shows that toast
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-bw-toast]');
      if (!trigger) return;
      var toast = document.querySelector(trigger.getAttribute('data-bw-toast'));
      if (toast) bootstrap.Toast.getOrCreateInstance(toast).show();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootstrap);
  } else {
    initBootstrap();
  }
})();
