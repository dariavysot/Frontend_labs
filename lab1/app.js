"use strict";

/**
 * Лабораторна робота № 4: Реалізація клієнтських скриптів за допомогою JS (Варіант 1)
 */

document.addEventListener("DOMContentLoaded", () => {
    initFallingItems();
    initTypewriterEffect();
    initCatalogSearch();
    initFeedbackTooltip();
    initAdaptiveNav();
});

// =============================================================================
// ПУНКТ 1: Падаючі зображення товарів у шапці головної сторінки (index.html)
// =============================================================================
function initFallingItems() {
    const header = document.querySelector(".main-header");
    const isHomePage = document.querySelector(".home-grid-container");
    if (!header || !isHomePage) return;

    const productImages = [
        "images/marshall5.jpg",
        "images/sony.webp",
        "images/sennheiser.webp",
        "images/MarshallStanmore.jpg",
        "images/JBLCharge5Squad.webp",
        "images/Audio-Technica.png"
    ];

    const titleEl = header.querySelector(".logo-box > h1");
    let maxItemHeight = 34;
    if (titleEl) {
        const computedSize = parseFloat(window.getComputedStyle(titleEl).fontSize);
        maxItemHeight = Math.floor(computedSize * 1.8);
    }

    // Створюємо та ізолюємо підкладку від flex-потоку шапки
    const fallingContainer = document.createElement("div");
    fallingContainer.className = "falling-container";
    header.prepend(fallingContainer);

    function spawnFallingItem() {
        const img = document.createElement("img");
        const randomSrc = productImages[Math.floor(Math.random() * productImages.length)];
        img.src = randomSrc;
        img.className = "falling-product-item";
        img.style.maxHeight = `${maxItemHeight}px`;

        const leftPercent = Math.random() * 85 + 5;
        img.style.left = `${leftPercent}%`;

        const duration = (Math.random() * 2 + 2.5).toFixed(2);
        img.style.animationDuration = `${duration}s`;

        fallingContainer.appendChild(img);

        img.addEventListener("animationend", () => {
            img.remove();
        });
    }

    setInterval(spawnFallingItem, 1200);
}

// =============================================================================
// ПУНКТ 2: Текст "Новинка!", що самодрукується біля товару (catalog.html)
// =============================================================================
function initTypewriterEffect() {
    const firstProductTitle = document.querySelector(".product-card h3");
    if (!firstProductTitle) return;

    const badge = document.createElement("span");
    badge.className = "typewriter-badge";
    firstProductTitle.appendChild(badge);

    const textToType = " Новинка!";
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
        if (!isDeleting) {
            charIndex++;
            badge.textContent = textToType.slice(0, charIndex);

            if (charIndex === textToType.length) {
                setTimeout(() => { isDeleting = true; typeLoop(); }, 2000);
                return;
            }
        } else {
            charIndex--;
            badge.textContent = textToType.slice(0, charIndex);

            if (charIndex === 0) {
                isDeleting = false;
                setTimeout(typeLoop, 600);
                return;
            }
        }

        const typingSpeed = isDeleting ? 70 : 130;
        setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 500);
}

// =============================================================================
// ПУНКТ 3: Динамічний пошук товарів за назвою (catalog.html)
// =============================================================================
function initCatalogSearch() {
    const searchInput = document.getElementById("catalog-search");
    const productCards = document.querySelectorAll(".catalog-grid .product-card");

    if (!searchInput || productCards.length === 0) return;

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();

        productCards.forEach((card) => {
            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
            if (title.includes(query)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}

// =============================================================================
// ПУНКТ 4: Тултіп та стилізація поля "Детально" (feedback.html)
// =============================================================================
function initFeedbackTooltip() {
    const detailsField = document.getElementById("details");
    if (!detailsField) return;

    const wrapper = document.createElement("div");
    wrapper.className = "details-field-wrapper";
    detailsField.parentNode.insertBefore(wrapper, detailsField);
    wrapper.appendChild(detailsField);

    const tooltip = document.createElement("div");
    tooltip.className = "feedback-tooltip";
    tooltip.textContent = "Ваша думка для нас важлива! Конкретизуйте мету звернення, будь ласка";
    wrapper.appendChild(tooltip);

    detailsField.addEventListener("mouseenter", () => {
        detailsField.classList.add("details-hovered");
        tooltip.classList.add("tooltip-visible");
    });

    detailsField.addEventListener("mouseleave", () => {
        if (document.activeElement !== detailsField) {
            detailsField.classList.remove("details-hovered");
            tooltip.classList.remove("tooltip-visible");
        }
    });

    detailsField.addEventListener("focus", () => {
        detailsField.classList.add("details-hovered");
        tooltip.classList.add("tooltip-visible");
    });

    detailsField.addEventListener("blur", () => {
        detailsField.classList.remove("details-hovered");
        tooltip.classList.remove("tooltip-visible");
    });
}

// =============================================================================
// ПУНКТ 5: Адаптивне розташування навігаційного меню через JS (index.html)
// =============================================================================
function initAdaptiveNav() {
    const headerNav = document.querySelector(".main-header .header-nav");
    const isHomePage = document.querySelector(".home-grid-container");

    if (!headerNav || !isHomePage) return;

    function applyNavOrientation() {
        // Умова: ширина не більше 768px
        if (window.innerWidth <= 768) {
            headerNav.classList.add("nav-vertical-right");
            headerNav.classList.remove("nav-horizontal-top");
        } else {
            headerNav.classList.add("nav-horizontal-top");
            headerNav.classList.remove("nav-vertical-right");
        }
    }

    applyNavOrientation();
    window.addEventListener("resize", applyNavOrientation);
}