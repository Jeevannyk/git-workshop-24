/* ========================================
   CYBERSECURITY PORTFOLIO - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTypingEffect();
    initScrollAnimations();
    initMobileNav();
    initModals();
    initSmoothScroll();
    initCertsScroller();
    initAutoGrowTextarea();
});

/* ========================================
   AUTO-GROW TEXTAREA
   ======================================== */
function initAutoGrowTextarea() {
    const textarea = document.getElementById('message');
    if (!textarea) return;

    const grow = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', grow);
    // Reset back to base height after the form is submitted/reset
    textarea.form?.addEventListener('reset', () => {
        requestAnimationFrame(() => {
            textarea.style.height = '';
        });
    });
}

/* ========================================
   TYPING EFFECT
   ======================================== */
function initTypingEffect() {
    const typedElement = document.querySelector('.typed-text');
    if (!typedElement) return;

    const texts = [
        'Cybersecurity Engineer',
        'Backend Developer',
        'Security Researcher',
        'Penetration Tester',
        'Python Developer'
    ];

    const typingSpeed = 80;
    const eraseSpeed = 40;
    const pauseTime = 2000;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (!isDeleting && charIndex < currentText.length) {
            typedElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else if (isDeleting && charIndex > 0) {
            typedElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, eraseSpeed);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                textIndex = (textIndex + 1) % texts.length;
            }
            setTimeout(type, isDeleting ? pauseTime : 500);
        }
    }

    type();
}

/* ========================================
   SCROLL FADE-IN ANIMATIONS - Smooth & Subtle
   ======================================== */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach((el, index) => {
        // Add subtle staggered delay - max 0.3s
        const delay = Math.min(index * 0.08, 0.3);
        el.style.transitionDelay = `${delay}s`;
        fadeObserver.observe(el);
    });

    // Trigger animations for elements already in view
    setTimeout(() => {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}

/* ========================================
   MOBILE NAVIGATION
   ======================================== */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

/* ========================================
   MODALS
   ======================================== */
function initModals() {
    // Open modal on project card click
    const projectCards = document.querySelectorAll('[data-modal-target]');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking on a link
            if (e.target.closest('.project-link')) return;
            
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.querySelector(modalId);
            
            if (modal) {
                openModal(modal);
            }
        });
    });

    // Close modal on close button click
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Trigger animation
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   CERTIFICATIONS INFINITE SCROLLER
   ======================================== */
function initCertsScroller() {
    const track = document.getElementById('certs-track');
    if (!track) return;

    // Clone all cards and append — creates the seamless loop
    Array.from(track.children).forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    // Scale animation duration to content width so speed stays consistent
    // regardless of how many certs are added
    const cardWidth = 230 + 24; // card width + gap
    const totalCards = track.children.length / 2;
    const duration = (cardWidth * totalCards) / 55; // ~55px/s
    track.style.animationDuration = `${duration}s`;
}

/* ========================================
   NAVBAR SCROLL EFFECT - Subtle Transition
   ======================================== */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(23, 23, 32, 0.95)';
            navbar.style.borderBottomColor = 'rgba(148, 163, 184, 0.1)';
        } else {
            navbar.style.background = 'rgba(23, 23, 32, 0.85)';
            navbar.style.borderBottomColor = 'rgba(148, 163, 184, 0.06)';
        }
    }
});

/* ========================================
   FORM HANDLING WITH BACKEND INTEGRATION
   ======================================== */
const contactForm = document.getElementById('contact-form');

// Resolve the backend URL based on where the page is being served from,
// so it works locally AND through VS Code port forwarding without edits.
function getBackendUrl() {
    const { hostname, protocol } = window.location;

    // Local development (Live Server / opened file)
    if (hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '') {
        return 'http://127.0.0.1:5000/api/contact';
    }

    // VS Code dev tunnels: frontend "<id>-5500.<region>.devtunnels.ms"
    // maps to backend "<id>-5000.<region>.devtunnels.ms".
    if (hostname.includes('devtunnels.ms')) {
        const backendHost = hostname.replace(/-\d+\./, '-5000.');
        return `${protocol}//${backendHost}/api/contact`;
    }

    // Fallback: assume backend is reverse-proxied under the same origin.
    return '/api/contact';
}

const BACKEND_URL = getBackendUrl();

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Client-side validation
        const errors = validateForm(data);
        if (errors.length > 0) {
            showFormError(errors.join('. '));
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--accent)';
                submitBtn.style.color = 'var(--bg-primary)';
                this.reset();
                showToast('Message sent! I\'ll get back to you soon.', 'success');
            } else {
                const errorMsg = result.errors ? result.errors.join('. ') : result.error;
                showFormError(errorMsg);
                submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
                showToast(errorMsg, 'error');
            }
        } catch (error) {
            // Backend unreachable — be honest instead of faking success.
            console.error('Could not reach backend:', error);
            submitBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
            showToast('Couldn\'t reach the server. Please try again later.', 'error');
        }
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            submitBtn.style.color = '';
            hideFormError();
        }, 3000);
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
    }
    
    return errors;
}

function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

function showFormError(message) {
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = 'color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.875rem; border: 1px solid rgba(239, 68, 68, 0.2);';
        contactForm.insertBefore(errorDiv, contactForm.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideFormError() {
    const errorDiv = document.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

let toastTimer = null;

function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;

    // Force reflow so the slide-in transition runs on repeat calls
    requestAnimationFrame(() => toast.classList.add('show'));

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}