const products = {
    banana: {
        small: {
            price: "NPR 140",
            statPrimary: "Quick treat",
            statSecondary: "Single serve",
            desc: "Fresh banana flavour with a creamy base, built for easy single-serve enjoyment.",
            image: "assets/images/5.svg",
            imageAlt: "Banana flavour tub",
        },
        large: {
            price: "NPR 1050",
            statPrimary: "Family pack",
            statSecondary: "Better value",
            desc: "A bigger banana tub made for sharing, scooping, and keeping in the freezer for the week.",
            image: "assets/images/5.svg",
            imageAlt: "Banana flavour tub",
        },
    },
    chocolate: {
        small: {
            price: "NPR 150",
            statPrimary: "Quick treat",
            statSecondary: "Single serve",
            desc: "Dark chocolate flavour with a rich, creamy finish and a smoother cocoa profile.",
            image: "assets/images/4.svg",
            imageAlt: "Dark Chocolate tub",
        },
        large: {
            price: "NPR 1250",
            statPrimary: "Family pack",
            statSecondary: "Better value",
            desc: "A full one-liter chocolate tub for families, gatherings, and serious dessert cravings.",
            image: "assets/images/4.svg",
            imageAlt: "Dark Chocolate tub",
        },
    },
};

const nutritionData = {
    tads: {
        carbs: 52,
        protein: 74,
        fat: 46,
        sugar: 34,
        carbsVal: "Balanced",
        proteinVal: "Higher",
        fatVal: "Creamy",
        sugarVal: "Moderate",
    },
    regular: {
        carbs: 80,
        protein: 22,
        fat: 70,
        sugar: 88,
        carbsVal: "Higher",
        proteinVal: "Lower",
        fatVal: "Heavier",
        sugarVal: "Much Higher",
    },
};

let currentFlavour = "chocolate";
let currentSize = "small";
let isComparing = false;
let currentTheme = "dark";
let orderQuantity = 1;
let selectedOrderFlavours = ["chocolate"];

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    updateProductDisplay();
    initScrollReveal();
    initComparisonSlider();
    initStickyCTA();
    initFlavourKeyboardSupport();
    initPurchaseModal();
});

function initTheme() {
    const savedTheme = localStorage.getItem("tads-theme");
    const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)",
    ).matches;
    currentTheme = savedTheme || (prefersLight ? "light" : "dark");
    applyTheme(currentTheme);

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    localStorage.setItem("tads-theme", currentTheme);
}

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.setAttribute("data-theme", theme);

    const themeToggle = document.getElementById("theme-toggle");
    const themeLabel = document.getElementById("theme-toggle-label");

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(isLight));
        themeToggle.setAttribute(
            "aria-label",
            isLight ? "Switch to dark mode" : "Switch to light mode",
        );
    }

    if (themeLabel) {
        themeLabel.textContent = isLight ? "Light" : "Dark";
    }
}

function selectFlavour(flavour) {
    currentFlavour = flavour;
    document.body.setAttribute("data-flavour", flavour);

    document.querySelectorAll(".flavour-card").forEach((card) => {
        const isActive = card.dataset.colour === flavour;
        card.classList.toggle("active", isActive);
        card.setAttribute("aria-pressed", isActive);
    });

    updateProductDisplay();
}

function selectSize(size) {
    currentSize = size;

    document.querySelectorAll(".size-btn").forEach((btn) => {
        const isActive = btn.textContent
            .toLowerCase()
            .includes(size === "small" ? "120" : "1 l");
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-checked", isActive);
    });

    updateProductDisplay();
}

function updateProductDisplay() {
    const product = products[currentFlavour][currentSize];
    const name =
        currentFlavour === "banana" ? "Banana Cream" : "Dark Chocolate";
    const sizeText = currentSize === "small" ? "120 ml" : "1 L tub";
    const heroProduct = document.getElementById("hero-product");
    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };

    setText("product-name", name);
    setText("product-desc", product.desc);
    setText("product-price", product.price);
    setText("product-stat-primary", product.statPrimary);
    setText("product-stat-secondary", product.statSecondary);
    setText("sticky-product", `${name} - ${sizeText}`);
    setText(
        "hero-highlight-value",
        currentFlavour === "banana" ? "Real Banana" : "Dark Cocoa",
    );
    setText("hero-highlight-label", "Signature Flavour");
    setText("hero-support-value", currentSize === "small" ? "120 ml" : "1 L");
    setText("hero-support-label", "Available Size");

    if (heroProduct) {
        heroProduct.src = product.image;
        heroProduct.alt = product.imageAlt;
    }
}

function initPurchaseModal() {
    const modal = document.getElementById("purchase-modal");
    const form = document.getElementById("purchase-form");
    const success = document.getElementById("purchase-success");

    document.querySelectorAll(".order-trigger").forEach((button) => {
        button.addEventListener("click", openPurchaseModal);
    });

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", closePurchaseModal);
    });

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closePurchaseModal();
            }
        });
    }

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("visible")
        ) {
            closePurchaseModal();
        }
    });

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const flavourLabel = formatSelectedFlavours();
            const sizeLabel = currentSize === "small" ? "120 ml" : "1 L tub";
            document.getElementById("purchase-success-copy").textContent =
                `Demo order created for ${orderQuantity} x ${flavourLabel} (${sizeLabel}).`;

            form.classList.add("hidden");
            success.classList.remove("hidden");
        });
    }

    const quantityInput = document.getElementById("purchase-quantity");
    if (quantityInput) {
        quantityInput.addEventListener("input", (event) => {
            orderQuantity = Number(event.target.value) || 1;
            syncPurchaseSummary();
        });
    }

    document
        .querySelectorAll('input[name="purchase-flavours"]')
        .forEach((input) => {
            input.addEventListener("change", updateSelectedOrderFlavours);
        });
}

function openPurchaseModal() {
    const modal = document.getElementById("purchase-modal");
    const form = document.getElementById("purchase-form");
    const success = document.getElementById("purchase-success");
    const quantityField = document.getElementById("purchase-quantity");

    if (!modal || !form || !success) {
        return;
    }

    selectedOrderFlavours = [currentFlavour];
    syncPurchaseFlavourInputs();
    if (quantityField) {
        quantityField.value = String(orderQuantity);
    }
    syncPurchaseSummary();

    form.classList.remove("hidden");
    success.classList.add("hidden");
    modal.classList.add("visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closePurchaseModal() {
    const modal = document.getElementById("purchase-modal");
    if (!modal) {
        return;
    }

    modal.classList.remove("visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function updateSelectedOrderFlavours() {
    const checked = Array.from(
        document.querySelectorAll('input[name="purchase-flavours"]:checked'),
    ).map((input) => input.value);

    selectedOrderFlavours = checked.length ? checked : [currentFlavour];
    syncPurchaseFlavourInputs();
    syncPurchaseSummary();
}

function syncPurchaseFlavourInputs() {
    document
        .querySelectorAll('input[name="purchase-flavours"]')
        .forEach((input) => {
            input.checked = selectedOrderFlavours.includes(input.value);
        });
}

function syncPurchaseSummary() {
    const summaryField = document.getElementById("purchase-summary");
    const summaryCount = document.getElementById("purchase-summary-count");
    const sizeField = document.getElementById("purchase-size");
    const priceField = document.getElementById("purchase-summary-price");
    const flavourPreview = document.getElementById("purchase-flavour-preview");
    const sizeLabel = currentSize === "small" ? "120 ml" : "1 L tub";
    const flavourLabel = formatSelectedFlavours();

    if (summaryField) {
        summaryField.textContent = `${flavourLabel} · ${sizeLabel}`;
    }

    if (summaryCount) {
        summaryCount.textContent = `${orderQuantity} item${orderQuantity > 1 ? "s" : ""}`;
    }

    if (sizeField) {
        sizeField.value = sizeLabel;
    }

    if (priceField) {
        priceField.textContent =
            currentSize === "small" ? "NPR ? each" : "NPR ? each";
    }

    if (flavourPreview) {
        flavourPreview.value = flavourLabel;
    }
}

function formatSelectedFlavours() {
    return selectedOrderFlavours
        .map((flavour) =>
            flavour === "banana" ? "Banana Cream" : "Dark Chocolate",
        )
        .join(" + ");
}

function toggleComparison() {
    isComparing = !isComparing;
    const data = isComparing ? nutritionData.regular : nutritionData.tads;

    const thumb = document.getElementById("toggle-thumb");
    const track = document.getElementById("toggle-track");

    if (isComparing) {
        thumb.style.transform = "translateX(24px)";
        thumb.style.background = "var(--accent)";
        track.style.background = "var(--accent-soft)";
    } else {
        thumb.style.transform = "translateX(0)";
        thumb.style.background = "var(--fg-muted)";
        track.style.background = "var(--bg-elevated)";
    }

    document.getElementById("carbs-bar").style.width = `${data.carbs}%`;
    document.getElementById("protein-bar").style.width = `${data.protein}%`;
    document.getElementById("fat-bar").style.width = `${data.fat}%`;
    document.getElementById("sugar-bar").style.width = `${data.sugar}%`;

    document.getElementById("carbs-value").textContent = data.carbsVal;
    document.getElementById("protein-value").textContent = data.proteinVal;
    document.getElementById("fat-value").textContent = data.fatVal;
    document.getElementById("sugar-value").textContent = data.sugarVal;
    document.getElementById("economics-mode-label").textContent = isComparing
        ? "Compared to regular ice cream"
        : "Tad’s Ice Cream profile";
}

function toggleFaq(button) {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach((faqItem) => {
        faqItem.classList.remove("open");
        faqItem
            .querySelector(".faq-question")
            .setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
    }
}

function initScrollReveal() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document
        .querySelectorAll(".reveal")
        .forEach((element) => observer.observe(element));
}

function initComparisonSlider() {
    const slider = document.getElementById("comparison-slider");
    const handle = document.getElementById("comparison-handle");
    const leftSide = document.getElementById("comparison-left");

    if (!slider || !handle || !leftSide) {
        return;
    }

    let isDragging = false;

    const updateSlider = (x) => {
        const rect = slider.getBoundingClientRect();
        let percent = ((x - rect.left) / rect.width) * 100;
        percent = Math.max(10, Math.min(90, percent));

        handle.style.left = `${percent}%`;
        leftSide.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    };

    slider.addEventListener("mousedown", (event) => {
        isDragging = true;
        updateSlider(event.clientX);
    });

    document.addEventListener("mousemove", (event) => {
        if (isDragging) {
            updateSlider(event.clientX);
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });

    slider.addEventListener("touchstart", (event) => {
        isDragging = true;
        updateSlider(event.touches[0].clientX);
    });

    slider.addEventListener("touchmove", (event) => {
        if (isDragging) {
            updateSlider(event.touches[0].clientX);
        }
    });

    slider.addEventListener("touchend", () => {
        isDragging = false;
    });
}

function initStickyCTA() {
    const cta = document.getElementById("sticky-cta");
    const hero = document.querySelector("section");
    const faq = document.getElementById("faq");

    if (!cta || !hero) {
        return;
    }

    let heroOutOfView = false;
    let faqInView = false;

    const syncStickyCTA = () => {
        cta.classList.toggle("visible", heroOutOfView && !faqInView);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                heroOutOfView = !entry.isIntersecting;
                syncStickyCTA();
            });
        },
        { threshold: 0 },
    );

    observer.observe(hero);

    if (faq) {
        const faqObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    faqInView = entry.isIntersecting;
                    syncStickyCTA();
                });
            },
            { threshold: 0.15 },
        );

        faqObserver.observe(faq);
    }
}

function initFlavourKeyboardSupport() {
    document.querySelectorAll(".flavour-card").forEach((card) => {
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectFlavour(card.dataset.colour);
            }
        });
    });
}

window.selectFlavour = selectFlavour;
window.selectSize = selectSize;
window.toggleComparison = toggleComparison;
window.toggleFaq = toggleFaq;
