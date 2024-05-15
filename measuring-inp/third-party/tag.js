/**
 * 
 * @fileoverview A script that generates fake tag manager activity, roughly
 * approximating the call stacks you would get to demonstrate how it looks in
 * the DevTools peforance panel.
 * 
 * If you have tag manager activity that's this slow, go audit what you have in
 * there! It's a space that tends to accumulate a lot of main-thread-blocking
 * activity over time.
 */

function Mxz(ms) {
  const start = performance.now();
  while (performance.now() - start < ms) {}
}

function Hqw(named = true) {
  const name = named ? makeName() : '';

  return eval(`(function ${name}({depth, maxDepth, ms}) {
    if (depth >= maxDepth || ms <= 2) return Mxz(ms);

    const named = depth < 4 || depth > (maxDepth - 3) || Math.random() > 0.4;

    if (Math.random() < 0.05) {
      const pause = 0.05 * ms;
      Mxz(pause);
      ms -= pause;
    }
    if (Math.random() < 0.05) {
      const firstMs = Math.random() * 0.4 * ms;
      const next1 = Hqw(named);
      next1({depth: depth + 4, maxDepth, firstMs});
      const next2 = Hqw(!named);
      next2({depth: depth + 1, maxDepth, ms: ms - firstMs});
    } else {
      const next = Hqw(named);
      return next({depth: depth + 1, maxDepth, ms});
    }
  })`)
}

function makeName() {
  const name = String.fromCharCode(Math.floor(Math.random() * 26) + 65) +
      String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  return name;
}

function makeListener({maxDepth, duration}) {
  const name = makeName();

  return eval(`(function ${name}() {
    const f = Hqw();
    return f({depth: 0, maxDepth: ${maxDepth}, ms: ${duration}});
  })`);
}

class TagManager {
  constructor(queue) {
    this.queue = Array.isArray(queue) ? queue : [];

    this.listeners = {
      'snaiLLM-keyup': new Set([
        makeListener({maxDepth: 20, duration: 15}),
        makeListener({maxDepth: 12, duration: 8}),
        makeListener({maxDepth: 25, duration: 45}),
        makeListener({maxDepth: 15, duration: 20}),
      ]),
      'cookie-confirm': new Set([
        makeListener({maxDepth: 26, duration: 172}),
        makeListener({maxDepth: 25, duration: 180}),
      ]),
      'hamburger-menu': new Set([
        makeListener({maxDepth: 15, duration: 400}),
      ]),
      'cryptodaphne-coin': new Set([
        makeListener({maxDepth: 12, duration: 350}),
        makeListener({maxDepth: 25, duration: 250}),
        makeListener({maxDepth: 15, duration: 285}),
        makeListener({maxDepth: 15, duration: 323}),
      ]),
    };
  }

  push(data) {
    this.queue.push(data);

    for (const data of this.queue) {
      const listeners = this.listeners[data.event] || [];

      for (const listener of listeners) {
        listener(data);
      }
    }
    this.queue = [];
  }
}

window.dataLayer = new TagManager(window.dataLayer);
