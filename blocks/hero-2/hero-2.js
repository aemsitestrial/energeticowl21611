import { loadCSS } from '../../scripts/aem.js';
import decorateCta from '../cta/cta.js';

function getFieldElement(block, name) {
  return block.querySelector(`[data-aue-prop="${name}"]`);
}

function getTextValue(block, name, defaultValue = '') {
  const field = getFieldElement(block, name);

  return field?.textContent?.trim() || defaultValue;
}

function getAlignment(block) {
  const allowed = ['top', 'middle', 'bottom'];
  const fromField = getTextValue(block, 'alignment').toLowerCase();
  if (allowed.includes(fromField)) {
    return fromField;
  }

  // Fallback: the last leaf element whose text is exactly an alignment value
  // (alignment rows come after title/description in the authored order).
  const matches = [...block.querySelectorAll('div, p')]
    .filter((el) => !el.children.length)
    .map((el) => el.textContent.trim().toLowerCase())
    .filter((text) => allowed.includes(text));
  return matches.pop() || '';
}

function getContent(block) {
  console.log(
    'TITLE FIELD :',
    block.querySelector('div:nth-child(10) p')
      ?.textContent?.trim(),
  );

  console.log(
    'DESCRIPTION FIELD :',
    getFieldElement(block, 'description'),
  );

  console.log(block.innerHTML);
  return {
    heroIcon: getFieldElement(block, 'heroIcon'),
    heroIconAlt: getTextValue(block, 'heroIconAlt'),

    heroImageType: getTextValue(block, 'heroImageType'),
    heroLottoImagePath: getFieldElement(block, 'heroLottoImagePath'),
    heroImageAlt: getTextValue(block, 'heroImageAlt'),
    heroView: getTextValue(block, 'heroView'),

    eyebrowText: getTextValue(block, 'eyebrowText'),

    title:
      getFieldElement(block, 'eyebrowText')
        ?.closest('div')
        ?.parentElement
        ?.nextElementSibling
        ?.querySelector('p')
        ?.textContent
        ?.trim(),

    description: getFieldElement(block, 'description'),

    alignment: getAlignment(block),
    bgColor: getTextValue(block, 'bgColor'),
  };
}

export default function decorate(block) {
  // CTA items are rows with several cells; hero field rows have a single cell.
  const ctaItems = [...block.children].filter((row) => row.children.length > 1);
  if (ctaItems.length) {
    // Nested CTA rows are not loaded as standalone blocks, so load their CSS here.
    loadCSS(`${window.hlx.codeBasePath}/blocks/cta/cta.css`);
  }
  ctaItems.forEach((row) => {
    row.remove();
    row.classList.add('cta', 'block');
    row.dataset.blockName = 'cta';
    decorateCta(row);
  });

  const content = getContent(block);
  block.innerHTML = '';
  block.classList.add('hero2');
  if (content.alignment) {
    block.classList.add(`hero2-align-${content.alignment}`);
  }

  if (content.heroLottoImagePath) {
    const bgImg = content.heroLottoImagePath.querySelector('img')
      || content.heroLottoImagePath;

    const bgSrc = bgImg.getAttribute('src');

    if (content.heroImageAlt) {
      bgImg.alt = content.heroImageAlt;
    }
    if (bgSrc) {
      block.style.backgroundImage = `url(${bgSrc})`;
    }
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero2-content';

  if (content.heroIcon) {
    content.heroIcon.classList.add('hero2-icon');

    if (content.heroIconAlt) {
      content.heroIcon.alt = content.heroIconAlt;
    }

    contentWrapper.append(content.heroIcon);
  }

  if (content.eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero2-eyebrow';
    eyebrow.textContent = content.eyebrowText;

    contentWrapper.append(eyebrow);
  }

  if (content.title) {
    const title = document.createElement('h1');
    title.className = 'hero2-title';
    title.textContent = content.title;

    contentWrapper.append(title);
  }

  if (content.description) {
    const description = document.createElement('div');

    description.className = 'hero2-description';
    description.innerHTML = content.description.innerHTML;

    contentWrapper.append(description);
  }

  if (ctaItems.length) {
    const ctaList = document.createElement('div');
    ctaList.className = 'hero2-cta-items';
    ctaList.append(...ctaItems);
    contentWrapper.append(ctaList);
  }

  block.append(contentWrapper);
}
