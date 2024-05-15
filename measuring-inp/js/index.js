import '../node_modules/wicg-inert/dist/inert.js';
import {searchTerms} from './search-terms.js';
import {sidenavSetup} from './side-nav.js';

let fullTerms = [];
window.dataLayer = window.dataLayer || [];

async function loadDefs() {
  const response = await fetch('js/defs.json');
  fullTerms = await response.json();
}

function populateDefs() {
  const headingArticle = document.querySelector('article.intro');
  while (headingArticle.nextElementSibling) {
    headingArticle.nextElementSibling.remove();
  }

  if (fullTerms.length === 0) return;

  const termEls = fullTerms.map(({term, def}) => {
    const article = document.createElement('article');
    article.classList.add('term');
    article.dataset.term = term;

    const h3 = document.createElement('h3');
    h3.textContent = term;
    const p = document.createElement('p');
    p.textContent = def;
    article.append(h3, p);

    return article;
  });

  headingArticle.after(...termEls);
}

function handleSearch(event) {
  searchTerms(event.target.value);

  // All scientists currently preoccupied with whether or not they could:
  const visibleTerms = document.querySelectorAll('article:not(.intro):not([style*="display: none"])');
  const foundCount = Array.from(visibleTerms).length;

  // If no search terms found, mark search box with error border.
  const searchBox = document.querySelector('#search-terms');
  searchBox.classList.toggle('nomatches', foundCount === 0);
}

function tagManagerKeyupSetup() {
  document.addEventListener('keyup', keyboardEvent => {
    const searchValue = document.querySelector('#search-terms').value;

    // Use a custom event for a trigger on keyup.
    dataLayer.push({
      event: 'snaiLLM-keyup',
      searchValue,
      latestTimestamp: keyboardEvent.timeStamp,
    });
  });
}

function cryptodaphneCoinHandler(animationEvent) {
  // Alternating animation, so only compute every other time.
  if (Math.round(animationEvent.elapsedTime) % 2 === 0) return;

  dataLayer.push({
    event: 'cryptodaphne-coin',
    timestamp: performance.now(),
  });
}

function cryptodaphneCoinSetup() {
  const snailLogo = document.querySelector('h1 > .snail');
  snailLogo.addEventListener('click', () => snailLogo.classList.toggle('bounce'));
  snailLogo.addEventListener('animationiteration', cryptodaphneCoinHandler);
}

async function setup() {
  sidenavSetup();

  await loadDefs();
  populateDefs();

  const searchBox = document.querySelector('#search-terms');
  searchBox.addEventListener('input', handleSearch);

  tagManagerKeyupSetup();
  cryptodaphneCoinSetup();
}

setup();
