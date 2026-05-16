/* Cargo Text Animations — JS drivers
 * Single-source: imported by the tool's card AND emitted verbatim by bundle export.
 * Plain, dependency-free, framework-free JS. Each driver:
 *   signature: (el, text, params) => cleanup
 *   - el: the target element (driver owns its content)
 *   - text: the string to animate
 *   - params: { stepMs, ... } per-kind tuning
 *   - returns: a cleanup function that cancels all timers/frames
 */

function taDriverTypewriter(el, text, params) {
  var stepMs = (params && params.stepMs) || 80;
  var chars = text.split('');
  var i = 0;
  var timer = null;
  el.textContent = '';
  function step() {
    if (i < chars.length) {
      el.textContent += chars[i];
      i++;
      timer = setTimeout(step, stepMs);
    }
  }
  step();
  return function cleanup() { if (timer) clearTimeout(timer); };
}

function taDriverTerminal(el, text, params) {
  var stepMs = (params && params.stepMs) || 100;
  var chars = text.split('');
  var i = 0;
  var timer = null;
  el.textContent = '';
  var textNode = document.createElement('span');
  var cursor = document.createElement('span');
  cursor.className = 'ta-terminal-cursor';
  el.appendChild(textNode);
  el.appendChild(cursor);
  function step() {
    if (i < chars.length) {
      textNode.textContent += chars[i];
      i++;
      timer = setTimeout(step, stepMs);
    }
  }
  step();
  return function cleanup() { if (timer) clearTimeout(timer); };
}

function taDriverShuffle(el, text, params) {
  var stepMs = (params && params.stepMs) || 30;
  var symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  var chars = text.split('');
  var timer = null;
  el.textContent = '';
  var spans = chars.map(function (c) {
    var span = document.createElement('span');
    el.appendChild(span);
    return { el: span, char: c, isSpace: c === ' ' };
  });
  var frame = 0;
  function update() {
    var allDone = true;
    spans.forEach(function (item, i) {
      if (item.isSpace) { item.el.textContent = ' '; return; }
      var startFrame = i * 2;
      var endFrame = startFrame + 15;
      if (frame < startFrame) { allDone = false; item.el.textContent = ''; }
      else if (frame < endFrame) {
        allDone = false;
        item.el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      } else { item.el.textContent = item.char; }
    });
    frame++;
    if (!allDone) timer = setTimeout(update, stepMs);
  }
  update();
  return function cleanup() { if (timer) clearTimeout(timer); };
}

function taDriverBinaryDecode(el, text, params) {
  var stepMs = (params && params.stepMs) || 40;
  var chars = text.split('');
  var timer = null;
  el.textContent = '';
  var spans = chars.map(function (c) {
    var span = document.createElement('span');
    el.appendChild(span);
    return { el: span, char: c, isSpace: c === ' ' };
  });
  var frame = 0;
  function update() {
    var allDone = true;
    spans.forEach(function (item, i) {
      if (item.isSpace) { item.el.textContent = ' '; return; }
      var startFrame = i * 3;
      var endFrame = startFrame + 20;
      if (frame < startFrame) { allDone = false; item.el.textContent = ''; }
      else if (frame < endFrame) {
        allDone = false;
        item.el.textContent = Math.random() > 0.5 ? '1' : '0';
      } else { item.el.textContent = item.char; }
    });
    frame++;
    if (!allDone) timer = setTimeout(update, stepMs);
  }
  update();
  return function cleanup() { if (timer) clearTimeout(timer); };
}

function taDriverRandomReveal(el, text, params) {
  var stepMs = (params && params.stepMs) || 50;
  var chars = text.split('');
  var timer = null;
  el.textContent = '';
  var spans = chars.map(function (c) {
    var span = document.createElement('span');
    span.textContent = c === ' ' ? ' ' : c;
    span.style.opacity = '0';
    span.style.transition = 'opacity 0.3s ease';
    el.appendChild(span);
    return span;
  });
  var order = [];
  for (var k = 0; k < spans.length; k++) order.push(k);
  for (var m = order.length - 1; m > 0; m--) {
    var j = Math.floor(Math.random() * (m + 1));
    var tmp = order[m]; order[m] = order[j]; order[j] = tmp;
  }
  var i = 0;
  function reveal() {
    if (i < order.length) {
      spans[order[i]].style.opacity = '1';
      i++;
      timer = setTimeout(reveal, stepMs);
    }
  }
  reveal();
  return function cleanup() { if (timer) clearTimeout(timer); };
}

function taDriverSpotlight(el, text, params) {
  var sweepMs = (params && params.sweepMs) || 2000;
  el.textContent = text;
  el.style.background = 'linear-gradient(to right, currentColor 0%, #fff 50%, currentColor 100%)';
  el.style.backgroundSize = '200% auto';
  el.style.backgroundClip = 'text';
  el.style.webkitBackgroundClip = 'text';
  el.style.color = 'transparent';
  el.style.webkitTextFillColor = 'transparent';
  el.style.backgroundPosition = '200% center';
  el.style.transition = 'background-position ' + (sweepMs / 1000) + 's linear';
  var raf = requestAnimationFrame(function () {
    el.style.backgroundPosition = '-200% center';
  });
  return function cleanup() { if (raf) cancelAnimationFrame(raf); };
}

export const taDrivers = {
  'typewriter': taDriverTypewriter,
  'terminal': taDriverTerminal,
  'shuffle': taDriverShuffle,
  'binary-decode': taDriverBinaryDecode,
  'random-reveal': taDriverRandomReveal,
  'spotlight': taDriverSpotlight,
};
