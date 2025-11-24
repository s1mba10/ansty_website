document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.consultation-review-card');
    const lightbox = document.getElementById('reviewsLightbox');

    if (!cards.length || !lightbox) return;

    const overlay = lightbox.querySelector('.reviews-lightbox__overlay');
    const closeButtons = lightbox.querySelectorAll('[data-lightbox-close]');
    const closeButton = lightbox.querySelector('.reviews-lightbox__close');
    const figureImage = lightbox.querySelector('.reviews-lightbox__image');
    const figureCaption = lightbox.querySelector('.reviews-lightbox__caption');
    const prevBtn = lightbox.querySelector('.reviews-lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.reviews-lightbox__nav--next');

    const reviews = Array.from(cards).map((card) => {
        const img = card.querySelector('img');
        const caption = card.querySelector('figcaption');

        return {
            src: img?.getAttribute('src') || '',
            alt: img?.getAttribute('alt') || '',
            title: caption?.textContent?.trim() || ''
        };
    });

    let activeIndex = 0;
    let keyListenerAttached = false;

    const setBodyState = (isOpen) => {
        document.body.classList.toggle('lightbox-open', isOpen);
    };

    const updateSlide = () => {
        const current = reviews[activeIndex];
        if (!current) return;

        figureImage.src = current.src;
        figureImage.alt = current.alt;
        figureCaption.textContent = current.title;
    };

    const handleKeydown = (event) => {
        if (!lightbox.classList.contains('is-active')) return;

        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowRight') {
            showNext();
        } else if (event.key === 'ArrowLeft') {
            showPrev();
        }
    };

    const attachKeyListener = () => {
        if (keyListenerAttached) return;
        document.addEventListener('keydown', handleKeydown);
        keyListenerAttached = true;
    };

    const detachKeyListener = () => {
        if (!keyListenerAttached) return;
        document.removeEventListener('keydown', handleKeydown);
        keyListenerAttached = false;
    };

    const openLightbox = (index) => {
        activeIndex = index;
        updateSlide();
        lightbox.classList.add('is-active');
        lightbox.setAttribute('aria-hidden', 'false');
        attachKeyListener();
        setBodyState(true);
        (closeButton || nextBtn)?.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-active');
        lightbox.setAttribute('aria-hidden', 'true');
        detachKeyListener();
        setBodyState(false);
    };

    const showNext = () => {
        activeIndex = (activeIndex + 1) % reviews.length;
        updateSlide();
    };

    const showPrev = () => {
        activeIndex = (activeIndex - 1 + reviews.length) % reviews.length;
        updateSlide();
    };

    cards.forEach((card, index) => {
        const activate = () => openLightbox(index);

        card.addEventListener('click', activate);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activate();
            }
        });
    });

    closeButtons.forEach((btn) => btn.addEventListener('click', closeLightbox));
    overlay?.addEventListener('click', closeLightbox);
    nextBtn?.addEventListener('click', showNext);
    prevBtn?.addEventListener('click', showPrev);
});
