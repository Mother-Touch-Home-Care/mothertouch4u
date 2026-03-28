/* ------------------------------------------------
   NAVBAR SCROLL EFFECT
------------------------------------------------ */

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    // If page is scrolled more than 40px add "scrolled" class
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
});


/* ------------------------------------------------
   SCROLL FADE-UP ANIMATION
------------------------------------------------ */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        // When element enters the viewport
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.12 });


// Observe every element with .fade-up
document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));



/* ------------------------------------------------
   HERO STATS COUNTER ANIMATION
------------------------------------------------ */

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.querySelectorAll(".stat-num[data-target]").forEach(el => {

                const target = parseInt(el.dataset.target);
                let current = 0;

                const step = target / 80;

                const tick = () => {

                    current = Math.min(current + step, target);

                    el.textContent =
                        (Math.ceil(current) < 1000
                            ? Math.ceil(current)
                            : Math.ceil(current).toLocaleString()) +
                        (el.dataset.suffix || '');

                    if (current < target) {
                        requestAnimationFrame(tick);
                    }
                };

                tick();

            });

            counterObserver.unobserve(entry.target);
        }

    });

}, { threshold: 0.3 });


// Observe hero stats section
document.querySelectorAll(".hero-stats").forEach(el => counterObserver.observe(el));

/* ------------------------------------------------
   TESTIMONIAL CAROUSEL
------------------------------------------------ */
if (typeof $ !== 'undefined' && $('.testimonial-carousel').length) {
    $('.testimonial-carousel').owlCarousel({
        loop: true,
        margin: 25,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        nav: true,
        dots: true,
        responsive: {
            0: { items: 1 },
            1024: { items: 2 },
            1200: { items: 3 }
        }
    });
}


/* ------------------------------------------------
   CONTACT FORM — VALIDATION HELPERS
------------------------------------------------ */

/**
 * Show an error message directly below the input element.
 */
function showError(field, message) {
    field.classList.add('is-invalid');

    // Remove any existing error for this field first
    const existing = field.nextElementSibling;
    if (existing && existing.classList.contains('field-error')) existing.remove();

    const error = document.createElement('span');
    error.className = 'field-error';
    error.textContent = message;
    error.style.cssText = 'display:block; color:#ef4444; font-size:0.78rem; margin-top:5px;';
    field.insertAdjacentElement('afterend', error);
}

/**
 * Clear the error state from a field.
 */
function clearError(field) {
    field.classList.remove('is-invalid');
    const existing = field.nextElementSibling;
    if (existing && existing.classList.contains('field-error')) existing.remove();
}

/**
 * Validate a single field and return true if valid.
 */
function validateField(field) {
    const value = field.value.trim();
    const name = field.name;

    if (name === 'from_name') {
        if (!value) {
            showError(field, 'Please enter your full name.');
            return false;
        }
        if (value.length < 2) {
            showError(field, 'Name must be at least 2 characters.');
            return false;
        }
    }

    if (name === 'phone') {
        if (!value) {
            showError(field, 'Please enter your phone number.');
            return false;
        }
        // Accepts formats: +91 XXXXX XXXXX, 10-digit, with optional spaces/dashes
        const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number.');
            return false;
        }
    }

    if (name === 'from_email') {
        if (!value) {
            showError(field, 'Please enter your email address.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address.');
            return false;
        }
    }

    if (name === 'location') {
        if (!value) {
            showError(field, 'Please enter your city or district.');
            return false;
        }
    }

    if (name === 'care_type') {
        if (!value) {
            showError(field, 'Please select a type of care needed.');
            return false;
        }
    }

    clearError(field);
    return true;
}

/**
 * Attach real-time (blur) validation to each form field
 * so errors clear as soon as the user fixes them.
 */
function attachLiveValidation(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        // Validate on blur (when user leaves the field)
        field.addEventListener('blur', () => validateField(field));

        // Clear error on input so feedback is immediate
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                validateField(field);
            }
        });
    });
}

// Attach live validation once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form-inner');
    if (form) attachLiveValidation(form);
});


/* ------------------------------------------------
   CONTACT US FORM — SUBMIT HANDLER
------------------------------------------------ */

function handleSubmit(e) {
    e.preventDefault();

    const btn = document.querySelector('.btn-submit');
    const form = document.querySelector('.contact-form-inner');

    // ── Run validation on all required fields ──
    const requiredFields = [
        form.querySelector('[name="from_name"]'),
        form.querySelector('[name="phone"]'),
        form.querySelector('[name="from_email"]'),
        form.querySelector('[name="location"]'),
        form.querySelector('[name="care_type"]'),
    ];

    let isValid = true;
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Scroll to first error if any
    if (!isValid) {
        const firstError = form.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        return; // Stop submission
    }

    // ── All valid — proceed with EmailJS ──
    btn.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.sendForm('service_2w7bgjw', 'template_069upl9', form)
        .then(() => {
            btn.textContent = '✓ Message Sent! We\'ll contact you soon.';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            form.reset();
        })
        .catch((err) => {
            console.error(err);
            btn.textContent = 'Failed to send. Please call us directly.';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            btn.disabled = false;
        });
}