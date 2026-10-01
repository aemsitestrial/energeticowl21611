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
    eyebrowText: getTextValue(block, 'eyebrowText'),
    heading: block.children[2]?.textContent?.trim() || '',
    ctaText: getTextValue(block, 'ctaText'),
    ctaLink: getTextValue(block, 'ctaLink'),
    heroImage: getFieldElement(block, 'heroImage'),
    heroImageAlt: getTextValue(block, 'heroImageAlt'),
  };
}
function createContentSection(content) {
  console.log(content.heroIcon);
  console.log(content.heroImage);
  const slot = document.createElement('div');
  slot.className = 'home-hero-slot';

  const textMetadata = document.createElement('div');
  textMetadata.className = 'home-hero-text-metadata';

  const header = document.createElement('div');
  header.className = 'home-hero-header';

  if (content.heroIcon) {
    content.heroIcon.classList.add('home-hero-icon');
    header.append(content.heroIcon);
  }

  textMetadata.append(header);

  if (content.eyebrowText) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'home-hero-eyebrow';
    eyebrow.textContent = content.eyebrowText;

    textMetadata.append(eyebrow);
  }

  if (content.heading) {
    const title = document.createElement('h1');
    title.className = 'home-hero-heading';
    title.textContent = content.heading;

    textMetadata.append(title);
  }

  if (content.ctaText) {
    const cta = document.createElement('a');
    cta.className = 'home-hero-cta';
    cta.href = content.ctaLink || '#';

    const label = document.createElement('span');
    label.className = 'home-hero-cta-label';
    label.textContent = content.ctaText;

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
  console.log(content.heroIcon);
  console.log(content.heroImage);
  const slot = document.createElement('div');
  slot.className = 'home-hero-slot2';

  if (content.heroImage) {
    content.heroImage.classList.add('home-hero-image');

    if (content.heroImageAlt) {
      content.heroImage.alt = content.heroImageAlt;
    }

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'home-hero-image-wrapper';

    imageWrapper.append(content.heroImage);
    slot.append(imageWrapper);
  }

  return slot;
}

export default async function decorate(block) {
  const content = getContent(block);
  console.log(content.heroIcon);
  console.log(content.heroImage);
  console.log(block.innerHTML);
  block.textContent = '';
  block.classList.add('home-hero');

  const wrapper = document.createElement('div');
  wrapper.className = 'home-hero-wrapper';

  wrapper.append(
    createContentSection(content),
    createVisualSection(content),
  );

  block.append(wrapper);
}
