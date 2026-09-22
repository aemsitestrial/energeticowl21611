import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getProp(block, name) {
  return block.querySelector(`[data-aue-prop="${name}"]`);
}

function getText(block, name) {
  return getProp(block, name)?.textContent?.trim() || '';
}

function buildLink(block, textName, urlName) {
  const textEl = getProp(block, textName);
  const urlEl = getProp(block, urlName);
  const text = textEl?.textContent?.trim();
  const url = urlEl?.textContent?.trim();

  if (!text && !url) return null;

  const link = document.createElement('a');
  link.className = 'hero-link';
  link.href = url || '#';

  link.innerHTML = `
    <span class="hero-link-label">${text || url}</span>
    <span class="hero-link-arrow" aria-hidden="true">&rarr;</span>
  `;

  if (textEl) {
    moveInstrumentation(textEl, link);
  }

  return link;
}

function buildHeading(block, titleType) {
  const titleEl = getProp(block, 'title');
  if (!titleEl?.textContent?.trim()) return null;

  const tag = /^h[1-6]$/.test(titleType) ? titleType : 'h1';
  const heading = document.createElement(tag);
  heading.className = 'hero-title';
  heading.innerHTML = titleEl.innerHTML;
  moveInstrumentation(titleEl, heading);

  return heading;
}

/**
 * Variant 1: Split Hero
 * Layout: text column (overline, title, description, links) + image column
 */
function decorateSplitHero(block, titleType) {
  const content = document.createElement('div');
  content.className = 'hero-content';

  const overline = getProp(block, 'overline');
  if (overline?.textContent?.trim()) {
    overline.classList.add('hero-overline');
    content.append(overline);
  }

  const heading = buildHeading(block, titleType);
  if (heading) content.append(heading);

  const description = getProp(block, 'description');
  if (description?.textContent?.trim()) {
    description.classList.add('hero-description');
    content.append(description);
  }

  const links = [
    buildLink(block, 'link1Text', 'link1Url'),
    buildLink(block, 'link2Text', 'link2Url'),
  ].filter(Boolean);

  if (links.length) {
    const linksWrapper = document.createElement('div');
    linksWrapper.className = 'hero-links';
    links.forEach((link) => linksWrapper.append(link));
    content.append(linksWrapper);
  }

  const media = document.createElement('div');
  media.className = 'hero-media';

  const imageEl = getProp(block, 'image');
  const picture = imageEl?.matches('picture') ? imageEl : imageEl?.querySelector('picture');

  if (picture) {
    const img = picture.querySelector('img');
    const alt = getText(block, 'imageAlt');

    const optimizedPicture = createOptimizedPicture(
      img.src,
      alt || img.alt || '',
      false,
      [{ width: '1200' }],
    );

    moveInstrumentation(
      img,
      optimizedPicture.querySelector('img'),
    );

    media.append(optimizedPicture);
  }

  return [content, media];
}

export default function decorate(block) {
  const heroType = getText(block, 'heroType') || 'split';
  const titleType = getText(block, 'titleType') || 'h1';
  const backgroundColor = getText(block, 'backgroundColor') || 'black';
  const textColor = getText(block, 'textColor') || 'white';

  // Additional variants (variant 2, variant 3, ...) can branch here based on heroType.
  const fragments = decorateSplitHero(block, titleType);

  block.textContent = '';
  block.classList.add(
    `hero-${heroType}`,
    `hero-bg-${backgroundColor}`,
    `hero-text-${textColor}`,
  );
  block.append(...fragments);
}
