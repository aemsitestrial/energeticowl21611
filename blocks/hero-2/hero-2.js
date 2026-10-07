function getFieldElement(block, name) {
  return block.querySelector(`[data-aue-prop="${name}"]`);
}

function getTextValue(block, name, defaultValue = '') {
  const field = getFieldElement(block, name);

  return field?.textContent?.trim() || defaultValue;
}

function getContent(block) {
  return {
    icon: getFieldElement(block, 'icon'),
    eyebrow: getTextValue(block, 'eyebrow'),
    title: block.querySelector('div:nth-child(3) p')?.textContent?.trim(),

    ctaText: getTextValue(block, 'ctaText'),
    ctaLink: getTextValue(block, 'ctaLink'),

    backgroundImage: getFieldElement(block, 'backgroundImage'),
  };
}

export default function decorate(block) {
  const content = getContent(block);
  block.innerHTML = '';
  block.classList.add('hero2');

  if (content.backgroundImage) {
    const bgImg = content.backgroundImage.querySelector('img')
      || content.backgroundImage;

    const bgSrc = bgImg.getAttribute('src');

    if (bgSrc) {
      block.style.backgroundImage = `url(${bgSrc})`;
    }
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'hero2-content';

  if (content.icon) {
    content.icon.classList.add('hero2-icon');
    contentWrapper.append(content.icon);
  }

  if (content.eyebrow) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'hero2-eyebrow';
    eyebrow.textContent = content.eyebrow;

    contentWrapper.append(eyebrow);
  }

  if (content.title) {
    const title = document.createElement('h1');
    title.className = 'hero2-title';
    title.textContent = content.title;

    contentWrapper.append(title);
  }

  if (content.ctaText) {
    const cta = document.createElement('a');

    cta.className = 'hero2-cta';
    cta.href = content.ctaLink || '#';
    cta.textContent = content.ctaText;

    contentWrapper.append(cta);
  }

  block.append(contentWrapper);
}
