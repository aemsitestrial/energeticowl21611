/*
 * Fragment Block
 * Include content on a page as a fragment.
 */

import {
  decorateMain,
} from '../../scripts/scripts.js';

import {
  loadSections,
} from '../../scripts/aem.js';

/**
 * Loads a fragment.
 * @param {string} path The path to the fragment
 * @returns {HTMLElement} The root element of the fragment
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    // eslint-disable-next-line no-param-reassign
    path = path.replace(/(\.plain)?\.html/, '');

    const resp = await fetch(`${path}.plain.html`);

    if (resp.ok) {
      const main = document.createElement('main');

      main.innerHTML = await resp.text();

      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(
            elem.getAttribute(attr),
            new URL(path, window.location),
          ).href;
        });
      };

      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);

      return main;
    }
  }

  return null;
}

export default async function decorate(block) {
  const rows = [...block.children];

  const fragmentType = rows[0]?.textContent?.trim() || 'standard';

  const link = block.querySelector('a');

  const path = link
    ? link.getAttribute('href')
    : block.textContent.trim();

  switch (fragmentType) {
    case 'standard':
    default: {
      const fragment = await loadFragment(path);

      if (fragment) {
        const fragmentSection = fragment.querySelector(':scope .section');

        if (fragmentSection) {
          block.classList.add(...fragmentSection.classList);
          block.classList.remove('section');

          block.replaceChildren(...fragmentSection.childNodes);
        }
      }

      break;
    }
  }
}
