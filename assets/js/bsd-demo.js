// Demo tooling for the Bootstrap class audit pages (#bs-demo fragment).
// Load with a classic <script src> at the end of <main id="bs-demo">, before the Bootstrap bundle.
// To use the fragment on another site, copy this file or paste its contents into an inline <script>.

(function () {
  'use strict';

  var root = document.getElementById('bs-demo');
  if (!root) return;

  // Run once per page: a second copy of this file does nothing
  if (root.hasAttribute('data-bsd-tooling')) return;
  root.setAttribute('data-bsd-tooling', '');

  // ------------------------------------------------------------------
  // Snippet generator
  // Runs synchronously while the page is parsed, before Bootstrap JS
  // touches the DOM, so snippets reflect the markup exactly as authored.
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

  // Remove demo-only attributes and elements from a cloned subtree
  function cleanClone(fragment) {
    var skipped = fragment.querySelectorAll('[data-demo-skip]');
    for (var i = 0; i < skipped.length; i++) skipped[i].remove();

    var all = fragment.querySelectorAll('*');
    for (var j = 0; j < all.length; j++) {
      var attrs = Array.prototype.slice.call(all[j].attributes);
      for (var k = 0; k < attrs.length; k++) {
        if (attrs[k].name.indexOf('data-demo') === 0) all[j].removeAttribute(attrs[k].name);
      }
    }
  }

  function buildSnippet(demo) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < demo.childNodes.length; i++) fragment.appendChild(demo.childNodes[i].cloneNode(true));
    cleanClone(fragment);

    var lines = [];
    for (var j = 0; j < fragment.childNodes.length; j++) formatNode(fragment.childNodes[j], 0, lines);
    return lines.join('\n');
  }

  var snippetCount = 0;

  // Per-example "</>" toggle. Placed in the heading right before the example
  // (or its .ratio wrapper) when there is one, otherwise in a small bar above it.
  function renderToggle(anchor, wrapper) {
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'btn btn-sm btn-outline-secondary py-0 px-2 font-monospace';
    toggle.textContent = '</>';
    toggle.setAttribute('data-bsd-code', '');
    toggle.setAttribute('aria-controls', wrapper.id);
    toggle.setAttribute('aria-expanded', 'false');

    var heading = anchor.previousElementSibling;
    if (heading && /^H[3-6]$/.test(heading.tagName)) {
      toggle.setAttribute('aria-label', 'Show code: ' + heading.textContent.trim());
      heading.classList.add('d-flex', 'align-items-center', 'gap-2');
      heading.appendChild(toggle);
    } else {
      toggle.setAttribute('aria-label', 'Show code');
      var bar = document.createElement('div');
      bar.className = 'd-flex justify-content-end mb-1';
      bar.appendChild(toggle);
      anchor.insertAdjacentElement('beforebegin', bar);
    }
  }

  function renderSnippet(demo) {
    var wrapper = document.createElement('div');
    wrapper.id = 'bsd-snippet-' + (++snippetCount);
    // Collapsed by default; shown by the "</>" toggle or the global switch
    wrapper.className = 'position-relative mt-2 mb-3 d-none';
    wrapper.setAttribute('data-bsd-snippet', '');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2';
    button.textContent = 'Copy';
    button.setAttribute('data-bsd-copy', '');

    var pre = document.createElement('pre');
    pre.className = 'bg-body-tertiary border rounded-3 p-3 pe-5 small mb-0';
    pre.style.maxHeight = '24rem';

    var code = document.createElement('code');
    // textContent escapes the markup exactly once for display
    code.textContent = buildSnippet(demo);

    pre.appendChild(code);
    wrapper.appendChild(button);
    wrapper.appendChild(pre);
    // Inside .ratio every child becomes absolute 100% x 100% and would cover
    // the example, so the snippet and the toggle bar go around the wrapper.
    var parent = demo.parentElement;
    var anchor = parent && parent.classList.contains('ratio') ? parent : demo;
    anchor.insertAdjacentElement('afterend', wrapper);
    renderToggle(anchor, wrapper);
  }

  var demos = root.querySelectorAll('[data-demo]');
  for (var d = 0; d < demos.length; d++) renderSnippet(demos[d]);

  // ------------------------------------------------------------------
  // Copy buttons
  // ------------------------------------------------------------------

  var live = document.getElementById('bsd-live');

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

  root.addEventListener('click', function (event) {
    var button = event.target.closest('[data-bsd-copy]');
    if (!button) return;
    var code = button.parentElement.querySelector('code');
    copyText(code.textContent).then(function (ok) {
      button.textContent = ok ? 'Copied' : 'Failed';
      announce(ok ? 'Snippet copied to clipboard' : 'Copy failed');
      setTimeout(function () { button.textContent = 'Copy'; }, 1500);
    });
  });

  // ------------------------------------------------------------------
  // Storage helpers (storage can be unavailable, e.g. private mode)
  // ------------------------------------------------------------------

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  // ------------------------------------------------------------------
  // Code visibility: per-example "</>" toggles and the global switch
  // ------------------------------------------------------------------

  var codeToggle = document.getElementById('bsd-code-toggle');

  function setSnippetVisible(toggle, visible) {
    var wrapper = document.getElementById(toggle.getAttribute('aria-controls'));
    if (!wrapper) return;
    wrapper.classList.toggle('d-none', !visible);
    toggle.setAttribute('aria-expanded', visible ? 'true' : 'false');
    toggle.classList.toggle('active', visible);
  }

  function setAllSnippetsVisible(visible) {
    root.querySelectorAll('[data-bsd-code]').forEach(function (toggle) {
      setSnippetVisible(toggle, visible);
    });
  }

  root.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-bsd-code]');
    if (!toggle) return;
    setSnippetVisible(toggle, toggle.getAttribute('aria-expanded') !== 'true');
  });

  if (codeToggle) {
    codeToggle.checked = storageGet('bsd-code') === 'on';
    setAllSnippetsVisible(codeToggle.checked);
    codeToggle.addEventListener('change', function () {
      storageSet('bsd-code', codeToggle.checked ? 'on' : 'off');
      setAllSnippetsVisible(codeToggle.checked);
      announce(codeToggle.checked ? 'Code shown for all examples' : 'Code hidden for all examples');
    });
  }

  // ------------------------------------------------------------------
  // Theme toggle: data-bs-theme on <html>
  // ------------------------------------------------------------------

  var html = document.documentElement;
  var themeButton = document.getElementById('bsd-theme-toggle');

  function currentTheme() {
    return html.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-bs-theme', theme);
    if (themeButton) {
      themeButton.textContent = 'Theme: ' + theme;
      themeButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    }
    renderTokens();
  }

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      storageSet('bsd-theme', next);
      applyTheme(next);
    });
  }

  // ------------------------------------------------------------------
  // Custom CSS switch: toggles every stylesheet whose href lacks "bootstrap"
  // ------------------------------------------------------------------

  var cssToggle = document.getElementById('bsd-css-toggle');
  var cssCount = document.getElementById('bsd-css-count');

  function customStylesheets() {
    var links = document.querySelectorAll('link[rel~="stylesheet"][href]');
    return Array.prototype.filter.call(links, function (link) {
      // Match on the file name only: folder or domain names may contain "bootstrap" too
      var file = link.href.split(/[?#]/)[0].split('/').pop().toLowerCase();
      return file.indexOf('bootstrap') === -1;
    });
  }

  function updateCssCount() {
    if (!cssCount) return;
    var sheets = customStylesheets();
    cssCount.textContent = String(sheets.length);
    cssCount.title = sheets.map(function (link) { return link.getAttribute('href'); }).join('\n');
  }

  if (cssToggle) {
    cssToggle.addEventListener('change', function () {
      var enabled = cssToggle.checked;
      customStylesheets().forEach(function (link) { link.disabled = !enabled; });
      announce(enabled ? 'Custom CSS enabled' : 'Custom CSS disabled');
      // Computed tokens change when theme overrides are removed
      requestAnimationFrame(renderTokens);
    });
  }
  updateCssCount();

  // ------------------------------------------------------------------
  // Tokens panel: computed --bs-* variables with swatches
  // ------------------------------------------------------------------

  var THEME_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  var TOKEN_GROUPS = THEME_COLORS.map(function (color) {
    return {
      title: color.charAt(0).toUpperCase() + color.slice(1),
      vars: ['--bs-' + color, '--bs-' + color + '-rgb', '--bs-' + color + '-bg-subtle',
        '--bs-' + color + '-border-subtle', '--bs-' + color + '-text-emphasis']
    };
  }).concat([
    { title: 'Body', vars: ['--bs-body-color', '--bs-body-color-rgb', '--bs-body-bg', '--bs-body-bg-rgb',
      '--bs-emphasis-color', '--bs-secondary-color', '--bs-secondary-bg', '--bs-tertiary-color',
      '--bs-tertiary-bg', '--bs-heading-color', '--bs-code-color', '--bs-highlight-color', '--bs-highlight-bg',
      '--bs-body-font-family', '--bs-body-font-size', '--bs-body-line-height'] },
    { title: 'Link', vars: ['--bs-link-color', '--bs-link-color-rgb', '--bs-link-hover-color',
      '--bs-link-hover-color-rgb', '--bs-link-decoration'] },
    { title: 'Border', vars: ['--bs-border-color', '--bs-border-color-translucent', '--bs-border-width',
      '--bs-border-style', '--bs-border-radius', '--bs-border-radius-sm', '--bs-border-radius-lg',
      '--bs-border-radius-xl', '--bs-border-radius-xxl', '--bs-border-radius-pill'] },
    { title: 'Focus ring', vars: ['--bs-focus-ring-width', '--bs-focus-ring-opacity', '--bs-focus-ring-color'] },
    { title: 'Form validation', vars: ['--bs-form-valid-color', '--bs-form-valid-border-color',
      '--bs-form-invalid-color', '--bs-form-invalid-border-color'] }
  ]);

  var tokensPanel = document.getElementById('bsd-tokens');
  var tokensTable = document.getElementById('bsd-tokens-table');
  var tokensTheme = document.getElementById('bsd-tokens-theme');

  // Returns a CSS color for the swatch, or null for non-color values
  function swatchColor(name, value) {
    if (!value) return null;
    if (/-rgb$/.test(name)) return 'rgb(' + value + ')';
    if (window.CSS && CSS.supports && CSS.supports('color', value)) return value;
    return null;
  }

  function renderTokens() {
    if (!tokensTable) return;
    // Skip work while the panel is closed; it re-renders on open
    if (tokensPanel && !tokensPanel.classList.contains('show') && !tokensPanel.classList.contains('showing')) return;

    var styles = getComputedStyle(html);
    if (tokensTheme) tokensTheme.textContent = currentTheme();

    var old = tokensTable.querySelectorAll('tbody');
    for (var i = 0; i < old.length; i++) old[i].remove();

    TOKEN_GROUPS.forEach(function (group) {
      var tbody = document.createElement('tbody');
      tbody.className = 'table-group-divider';

      var headRow = document.createElement('tr');
      var headCell = document.createElement('th');
      headCell.scope = 'rowgroup';
      headCell.colSpan = 3;
      headCell.className = 'bg-body-tertiary';
      headCell.textContent = group.title;
      headRow.appendChild(headCell);
      tbody.appendChild(headRow);

      group.vars.forEach(function (name) {
        var value = styles.getPropertyValue(name).trim();
        var row = document.createElement('tr');

        var nameCell = document.createElement('td');
        var nameCode = document.createElement('code');
        nameCode.textContent = name;
        nameCell.appendChild(nameCode);

        var valueCell = document.createElement('td');
        valueCell.className = 'font-monospace text-break';
        valueCell.textContent = value || '(not set)';

        var swatchCell = document.createElement('td');
        var color = swatchColor(name, value);
        if (color) {
          var swatch = document.createElement('span');
          swatch.className = 'd-inline-block border rounded';
          swatch.style.width = '1.5rem';
          swatch.style.height = '1.5rem';
          swatch.style.background = color;
          swatch.title = color;
          swatchCell.appendChild(swatch);
        }

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(swatchCell);
        tbody.appendChild(row);
      });

      tokensTable.appendChild(tbody);
    });
  }

  if (tokensPanel) {
    tokensPanel.addEventListener('show.bs.offcanvas', function () {
      // "showing" is set right after this event, so render on the next frame
      requestAnimationFrame(renderTokens);
    });
  }

  // Restore the saved theme (after renderTokens is defined)
  var savedTheme = storageGet('bsd-theme');
  applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : currentTheme());

  // ------------------------------------------------------------------
  // Bootstrap JS hooks (bundle loads after this fragment)
  // ------------------------------------------------------------------

  function initBootstrap() {
    if (!window.bootstrap) return;

    // Close the mobile sidebar after picking a section
    var sidebar = document.getElementById('bsd-sidebar');
    var nav = document.getElementById('bsd-nav');
    if (sidebar && nav) {
      nav.addEventListener('click', function (event) {
        if (!event.target.closest('a[href^="#"]')) return;
        if (!sidebar.classList.contains('show')) return;
        bootstrap.Offcanvas.getOrCreateInstance(sidebar).hide();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootstrap);
  } else {
    initBootstrap();
  }
})();
