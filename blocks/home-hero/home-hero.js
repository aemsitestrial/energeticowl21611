function getFieldElement(block, name) {
  return block.querySelector(`[data-aue-prop="${name}"]`);
}

function getTextValue(block, name, defaultValue = '') {
  const field = getFieldElement(block, name);

  return field?.textContent?.trim() || defaultValue;
}

function getContent(block) {
  return {
    heroIcon: getFieldElement(block, 'heroIcon'),
    heroIconAlt: getTextValue(block, 'heroIconAlt'),

    heroImageType: getTextValue(block, 'heroImageType'),
    heroLottoImagePath: getFieldElement(block, 'heroLottoImagePath'),
    heroImageAlt: getTextValue(block, 'heroImageAlt'),
    heroView: getTextValue(block, 'heroView'),

    eyebrowText: getTextValue(block, 'eyebrowText'),
    title: getTextValue(block, 'title'),
    description: getFieldElement(block, 'description'),

    ctaTitle: getTextValue(block, 'ctaTitle'),
    ctaLink: getTextValue(block, 'ctaLink'),
    ctaLinkType: getTextValue(block, 'ctaLinkType'),
    ctaView: getTextValue(block, 'ctaView'),

    motionType: getTextValue(block, 'motionType'),

    alignment: getTextValue(block, 'alignment'),
    bgColor: getTextValue(block, 'bgColor'),
  };
}

function createContentSection(content) {
  const slot = document.createElement('div');
  slot.className = 'home-hero-slot';

  const textMetadata = document.createElement('div');
  textMetadata.className = 'home-hero-text-metadata';

  if (content.heroIcon) {
    content.heroIcon.classList.add('home-hero-icon');

    if (content.heroIconAlt) {
      content.heroIcon.alt = content.heroIconAlt;
    }

    textMetadata.append(content.heroIcon);
  }

  if (content.eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'home-hero-eyebrow';
    eyebrow.textContent = content.eyebrowText;

    textMetadata.append(eyebrow);
  }

  if (content.title) {
    const title = document.createElement('h1');
    title.className = 'home-hero-title';
    title.textContent = content.title;

    textMetadata.append(title);
  }

  if (content.description) {
    const description = document.createElement('div');
    description.className = 'home-hero-description';
    description.innerHTML = content.description.innerHTML;

    textMetadata.append(description);
  }

  if (content.ctaTitle) {
    const cta = document.createElement('a');

    cta.className = 'home-hero-cta';

    if (content.ctaView) {
      cta.classList.add(`home-hero-cta-${content.ctaView}`);
    }

    cta.href = content.ctaLink || '#';

    if (content.ctaLinkType === 'new-window') {
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
    }

    const label = document.createElement('span');
    label.className = 'home-hero-cta-label';
    label.textContent = content.ctaTitle;

    const arrow = document.createElement('span');
    arrow.className = 'home-hero-cta-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '&rarr;';

    cta.append(label, arrow);

    textMetadata.append(cta);
  }

  slot.append(textMetadata);

  return slot;
}

function createVisualSection(content) {
  const slot = document.createElement('div');
  slot.className = 'home-hero-slot2';

  const image = content.heroLottoImagePath || null;

  if (image) {
    image.classList.add('home-hero-image');

    if (content.heroImageAlt) {
      image.alt = content.heroImageAlt;
    }

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'home-hero-image-wrapper';

    imageWrapper.append(image);

    slot.append(imageWrapper);
  }

  return slot;
}

export default function decorate(block) {
  const content = getContent(block);

  block.textContent = '';

  block.classList.add('home-hero');

  if (content.alignment) {
    block.classList.add(`home-hero-align-${content.alignment}`);
  }

  if (content.bgColor) {
    block.classList.add(`home-hero-bg-${content.bgColor}`);
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'home-hero-wrapper';

  wrapper.append(
    createContentSection(content),
    createVisualSection(content),
  );

  block.append(wrapper);
}
