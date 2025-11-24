// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Закрытие мобильного меню при клике на ссылку
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Закрытие мобильного меню при клике вне его
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    }
});

// FAQ Аккордеон
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Закрыть все открытые FAQ
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Открыть текущий, если он был закрыт
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 20;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Reviews carousel & read more
const reviewsCarousel = document.querySelector('.reviews-carousel');
const reviewsTrack = reviewsCarousel ? reviewsCarousel.querySelector('.reviews-track') : null;

if (reviewsCarousel && reviewsTrack) {
    const reviewSlides = Array.from(reviewsTrack.children);
    const prevBtn = document.querySelector('.reviews-nav-button--prev');
    const nextBtn = document.querySelector('.reviews-nav-button--next');
    let currentIndex = 0;
    let slideWidth = 0;
    let slideGap = 0;

    const measure = () => {
        if (!reviewSlides.length) return;
        slideWidth = reviewSlides[0].getBoundingClientRect().width;
        const styles = window.getComputedStyle(reviewsTrack);
        slideGap = parseFloat(styles.columnGap || styles.gap || '0');
    };

    const updateActiveSlide = () => {
        reviewSlides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });
    };

    const updatePosition = () => {
        if (!reviewSlides.length) return;
        const offset = currentIndex * (slideWidth + slideGap);
        reviewsTrack.style.transform = `translateX(-${offset}px)`;
        updateActiveSlide();
    };

    const move = (direction) => {
        if (!reviewSlides.length) return;
        currentIndex = (currentIndex + direction + reviewSlides.length) % reviewSlides.length;
        updatePosition();
    };

    prevBtn?.addEventListener('click', () => move(-1));
    nextBtn?.addEventListener('click', () => move(1));

    window.addEventListener('resize', () => {
        measure();
        updatePosition();
    });

    measure();
    updatePosition();
}

// Review text toggles
const reviewCards = document.querySelectorAll('.review-card');

reviewCards.forEach((card) => {
    const text = card.querySelector('.review-text');
    const toggle = card.querySelector('.review-toggle');

    if (!text || !toggle) return;

    const setToggleVisibility = () => {
        const wasExpanded = text.classList.contains('is-expanded');
        if (wasExpanded) {
            text.classList.remove('is-expanded');
        }

        const needsToggle = text.scrollHeight > text.clientHeight + 1;

        if (wasExpanded) {
            text.classList.add('is-expanded');
        }

        if (needsToggle) {
            toggle.style.display = 'inline-flex';
            toggle.textContent = wasExpanded ? 'Свернуть' : 'Читать ещё';
            if (!wasExpanded) {
                text.classList.remove('is-expanded');
            }
        } else {
            toggle.style.display = 'none';
            text.classList.add('is-expanded');
        }
    };

    toggle.addEventListener('click', () => {
        const isExpanded = text.classList.toggle('is-expanded');
        toggle.textContent = isExpanded ? 'Свернуть' : 'Читать ещё';
    });

    setToggleVisibility();
    window.addEventListener('resize', setToggleVisibility);
});

// Personal Consultation Modal
const personalConsultationBtn = document.getElementById('personalConsultationBtn');
const personalConsultationModal = document.getElementById('personalConsultationModal');
const modalClose = personalConsultationModal ? personalConsultationModal.querySelector('.modal-close') : null;
const modalOverlay = personalConsultationModal ? personalConsultationModal.querySelector('.modal-overlay') : null;

// Открытие модального окна
if (personalConsultationBtn && personalConsultationModal) {
    personalConsultationBtn.addEventListener('click', () => {
        personalConsultationModal.classList.add('active');
        document.body.classList.add('modal-open');
    });
}

// Закрытие модального окна по крестику
if (modalClose && personalConsultationModal) {
    modalClose.addEventListener('click', () => {
        personalConsultationModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
}

// Закрытие модального окна по клику на overlay
if (modalOverlay && personalConsultationModal) {
    modalOverlay.addEventListener('click', () => {
        personalConsultationModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    });
}

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (personalConsultationModal && personalConsultationModal.classList.contains('active')) {
            personalConsultationModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        }
    }
});
