/**
 * Return sub-elements what will highlight substring (if present).
 * @param {Element} termEl
 * @param {string} searchStr
 */
function getHighlightedSearchElements(termEl, searchStr) {
  const term = termEl.dataset.term;

  const highlightedEls = [];
  let lastIndex = 0;
  for (const match of term.matchAll(new RegExp(searchStr, 'gi'))) {
    highlightedEls.push(term.substring(lastIndex, match.index));
    const highlight = document.createElement('b');
    highlight.textContent = match[0];
    highlightedEls.push(highlight);
    lastIndex = match.index + match[0].length;
  }
  highlightedEls.push(term.substring(lastIndex));
  return highlightedEls;
}

/**
 * Show or hide term based on if it matches `searchStr`. Returns whether the
 * term is now visible.
 * @param {Element} termEl
 * @param {string} searchStr
 * @return {boolean}
 */
function toggleVisibility(termEl, searchStr) {
  const term = termEl.dataset.term;
  const includeTerm = term.toLowerCase().includes(searchStr.toLowerCase());
  const currentlyVisible = termEl.offsetHeight > 0;

  if (includeTerm && !currentlyVisible) {
    termEl.style.display = '';
  } else if (!includeTerm && currentlyVisible) {
    termEl.style.display = 'none';
  }

  return includeTerm;
}

/**
 * Highlight searchStr in terms and hide any terms without searchStr.
 * @param {string} searchStr
 */
function styleTerms(searchStr) {
  const termEls = document.querySelectorAll('article.term');

  for (const termEl of termEls) {
    const isVisible = toggleVisibility(termEl, searchStr);
    if (!isVisible) continue;

    const highlightedElements = getHighlightedSearchElements(termEl, searchStr);
    termEl.querySelector('h3').replaceChildren(...highlightedElements);
  }
}

/**
 * Returns a sorting comparator score for term and searchStr.
 * @param {string} term
 * @param {string} searchStr
 */
function searchStrAffinity(term, searchStr) {
  const matchCount = Array.from(term.matchAll(new RegExp(searchStr, 'gi'))).length;
  const firstIndex = term.toLowerCase().indexOf(searchStr.toLowerCase());
  return {
    matchCount,
    firstIndex: firstIndex !== -1 ? firstIndex : Number.MAX_VALUE,
  };
}

/**
 * Sort terms to put most pertinent items first.
 * @param {Array<Elements>} termEls
 */
function sortTerms(termEls, searchStr) {
  return termEls.toSorted((termElA, termElB) => {
    const affinityA = searchStrAffinity(termElA.dataset.term, searchStr);
    const affinityB = searchStrAffinity(termElB.dataset.term, searchStr);
    // Order by number of occurrences, break ties by index of first occurrence.
    return affinityB.matchCount - affinityA.matchCount ||
      affinityA.firstIndex - affinityB.firstIndex;
  });
}

/**
 * Search terms for the substring `searchStr`, highlight them, reorder them
 * by relevance, and hide unmatched terms.
 * @param {string} searchStr
 */
function searchTerms(searchStr) {
  const mainEl = document.querySelector('main');

  // Remove, sort, and re-add term elements.
  const termEls = [...document.querySelectorAll('article.term')];
  termEls.forEach(tEl => tEl.remove());
  const sortedTermEls = sortTerms(termEls, searchStr);
  sortedTermEls.forEach(tEl => mainEl.append(tEl));

  styleTerms(searchStr);
}

export {searchTerms};
