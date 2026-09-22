import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildLink(textCell, urlCell) {
  const text = textCell?.textContent.trim();
  const url = urlCell?.textContent.trim();
  if (!text && !url) return null;

  const link = document.createElement('a');
  link.className = 'hero-link';
  link.href = url || '#';
  link.innerHTML = `<span class="hero-link-label">${text || url}</span><span class="hero-link-arrow" aria-hidden="true">&rarr;</span>`;
  if (textCell) moveInstrumentation(textCell, link);
  return link;
}

/**
 * Variant 1: Split Hero
 * Layout: text column (overline, title, description, links) + image column
 */
function decorateSplitHero(block, rows) {
  const [
    ,
    overlineRow,
    titleRow,
    descriptionRow,
    imageRow,
    imageAltRow,
    link1TextRow,
    link1UrlRow,
    link2TextRow,
    link2UrlRow,
  ] = rows;

  const content = document.createElement('div');
  content.className = 'hero-content';

  const overline = overlineRow?.firstElementChild;
  if (overline && overline.textContent.trim()) {
    overline.classList.add('hero-overline');
    content.append(overline);
  }

  const title = titleRow?.firstElementChild;
  if (title && title.textContent.trim()) {
    title.classList.add('hero-title');
    content.append(title);
  }

  const description = descriptionRow?.firstElementChild;
  if (description && description.textContent.trim()) {
    description.classList.add('hero-description');
    content.append(description);
  }

  const links = [
    buildLink(link1TextRow?.firstElementChild, link1UrlRow?.firstElementChild),
    buildLink(link2TextRow?.firstElementChild, link2UrlRow?.firstElementChild),
  ].filter(Boolean);

  if (links.length) {
    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'hero-links';
    links.forEach((link) => linksWrapper.append(link));
    content.append(linksWrapper);
  }

  const media = document.createElement('div');
  media.className = 'hero-media';
  const picture = imageRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const alt = imageAltRow?.textContent.trim();
    const optimizedPicture = createOptimizedPicture(img.src, alt || img.alt || '', false, [{ width: '1200' }]);
    moveInstrumentation(img, optimizedPicture.querySelector('img'));
    media.append(optimizedPicture);
  }

  block.append(content, media);
}

export default function decorate(block) {
  const rows = [...block.children];
  const heroType = rows[0]?.textContent.trim() || 'split';

  block.textContent = '';
  block.classList.add(`hero-${heroType}`);

  // Additional variants (variant 2, variant 3, ...) can branch here based on heroType.
  decorateSplitHero(block, rows);
}
