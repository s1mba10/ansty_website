// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
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
}

// FAQ Аккордеон
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
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
        }
    });
}

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

// Reviews Slider
function initReviewsSlider() {
    console.log('Initializing reviews slider...');
    const reviewsSection = document.querySelector('.reviews-section');

    if (!reviewsSection) {
        console.log('Reviews section not found');
        return;
    }

    console.log('Reviews section found:', reviewsSection);

    const reviewsTrack = reviewsSection.querySelector('.reviews-track');
    const reviewCards = reviewsSection.querySelectorAll('.review-card');
    const prevBtn = reviewsSection.querySelector('.slider-btn-prev');
    const nextBtn = reviewsSection.querySelector('.slider-btn-next');
    const dotsContainer = reviewsSection.querySelector('.slider-dots');

    console.log('Elements found:', {
        reviewsTrack,
        reviewCardsCount: reviewCards.length,
        prevBtn,
        nextBtn,
        dotsContainer
    });

    if (!reviewsTrack || !reviewCards.length || !prevBtn || !nextBtn || !dotsContainer) {
        console.error('Reviews slider elements not found');
        return;
    }

    let currentIndex = 0;
    let cardsPerView = window.innerWidth > 768 ? 2 : 1;
    let totalDots = Math.ceil(reviewCards.length / cardsPerView);

    // Создаем точки для навигации
    function createDots() {
        dotsContainer.innerHTML = '';
        totalDots = Math.ceil(reviewCards.length / cardsPerView);

        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Перейти к отзыву ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    createDots();

    function updateSlider() {
        const cardWidth = reviewCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(reviewsTrack).gap) || 0;
        const offset = currentIndex * (cardWidth + gap) * cardsPerView;

        reviewsTrack.style.transform = `translateX(-${offset}px)`;

        // Сворачиваем все раскрытые карточки
        reviewCards.forEach(card => {
            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                const toggleBtn = card.querySelector('.review-toggle');
                if (toggleBtn) {
                    toggleBtn.textContent = 'читать далее';
                }
            }
        });

        // Обновляем точки
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Обновляем состояние кнопок
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalDots - 1;
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalDots - 1));
        updateSlider();
    }

    function nextSlide() {
        console.log('Next slide clicked, current:', currentIndex, 'total:', totalDots);
        if (currentIndex < totalDots - 1) {
            currentIndex++;
            updateSlider();
        }
    }

    function prevSlide() {
        console.log('Prev slide clicked, current:', currentIndex);
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    console.log('Adding click listeners to buttons');
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    console.log('Click listeners added');

    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newCardsPerView = window.innerWidth > 768 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                createDots();
            }
            updateSlider();
        }, 250);
    });

    // Expand/Collapse отзывов
    reviewCards.forEach((card, index) => {
        const toggleBtn = card.querySelector('.review-toggle');
        console.log(`Card ${index} toggle button:`, toggleBtn);
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                console.log(`Toggle clicked for card ${index}`);
                e.preventDefault();
                card.classList.toggle('expanded');
                toggleBtn.textContent = card.classList.contains('expanded')
                    ? 'свернуть'
                    : 'читать далее';
            });
        }
    });

    console.log('Calling initial updateSlider');
    updateSlider();
    console.log('Reviews slider initialized successfully');
}

// Инициализация слайдера при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewsSlider);
} else {
    initReviewsSlider();
}

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
