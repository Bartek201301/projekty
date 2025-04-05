// Intro animation & DOM load handling
document.addEventListener('DOMContentLoaded', () => {
    // Handle intro animation
    setTimeout(() => {
        document.getElementById('intro-animation').classList.add('hidden');
        setTimeout(() => {
            document.getElementById('main-content').classList.add('visible');
            initScrollAnimations(); // Inicjalizacja animacji przewijania natychmiast po pokazaniu zawartości
        }, 600);
    }, 2500);

    // Initialize all animations and interactions
    initNavbar();
    initHeroAnimations();
    initOrbitSystem();
    initStepsAnimation();
    initPricingAnimation();
    initContactForm();
    initScrollAnimations();
    setupReadMoreLinks();
    
    // Initialize modals
    initModals();
});

// Modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('.show-modal');
    const modalCloseButtons = document.querySelectorAll('.close-modal');
    const modalSwitchButtons = document.querySelectorAll('.switch-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    
    // Open modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            // Close any open modals first
            document.querySelectorAll('.modal.active').forEach(m => {
                m.classList.remove('active');
            });
            
            // Show the overlay and modal
            modalOverlay.classList.add('active');
            modal.classList.add('active');
            
            // Disable page scrolling
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when clicking close button
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            modal.classList.remove('active');
            modalOverlay.classList.remove('active');
            
            // Re-enable page scrolling
            document.body.style.overflow = '';
        });
    });
    
    // Close modal when clicking on overlay
    modalOverlay.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        
        modalOverlay.classList.remove('active');
        
        // Re-enable page scrolling
        document.body.style.overflow = '';
    });
    
    // Switch between modals
    modalSwitchButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close current modal
            const currentModal = button.closest('.modal');
            currentModal.classList.remove('active');
            
            // Open target modal
            const targetModalId = button.getAttribute('data-target');
            const targetModal = document.getElementById(targetModalId);
            targetModal.classList.add('active');
        });
    });
    
    // Handle form submissions (mock functionality)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (in a real app, this would be after server validation)
            const formType = form.closest('.modal') ? 
                (form.closest('.modal').id === 'login-modal' ? 'logowania' : 'rejestracji') : 
                'wysyłania wiadomości';
            
            // Mock form processing
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Przetwarzanie...';
            
            setTimeout(() => {
                // Close modal if it's a modal form
                if(form.closest('.modal')) {
                    form.closest('.modal').classList.remove('active');
                    document.getElementById('modal-overlay').classList.remove('active');
                    // Re-enable page scrolling
                    document.body.style.overflow = '';
                }
                
                // Show success notification
                showNotification(`Proces ${formType} zakończony pomyślnie!`, 'success');
                
                // Reset form
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Add icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="bx bx-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="bx bx-error-circle"></i>';
            break;
        default:
            icon = '<i class="bx bx-info-circle"></i>';
    }
    
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
        <button class="notification-close"><i class="bx bx-x"></i></button>
    `;
    
    // Add to document
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    document.querySelector('.notification-container').appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Auto-close notification
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.add('closing');
    
    setTimeout(() => {
        notification.remove();
        
        // Remove container if empty
        const container = document.querySelector('.notification-container');
        if (container && container.children.length === 0) {
            container.remove();
        }
    }, 300);
}

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Handle navbar scrolling effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's a modal trigger or has other specific functionality
            if (this.classList.contains('show-modal') || this.classList.contains('switch-modal')) {
                return;
            }
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero section animations
function initHeroAnimations() {
    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    const heroStats = document.querySelectorAll('.stat');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            
            // Animate stats with delay
            if (heroStats.length) {
                heroStats.forEach((stat, index) => {
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        stat.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, 200 * (index + 1));
                });
            }
        }, 300);
    }
}

// Orbit system animations
function initOrbitSystem() {
    const orbits = document.querySelectorAll('.orbit');
    
    // Random rotation speeds for each orbit
    orbits.forEach((orbit, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const duration = 15 + (index * 5); // Different durations
        
        orbit.style.animation = `orbit ${duration}s linear infinite ${direction === 1 ? '' : 'reverse'}`;
    });
    
    // Hover effects for orbit icons
    const orbitIcons = document.querySelectorAll('.orbit-icon');
    orbitIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2)';
            icon.style.filter = 'drop-shadow(0 0 10px rgba(138, 92, 255, 0.8))';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
            icon.style.filter = '';
        });
    });
    
    // Add pulse animation to orbit center
    const orbitCenter = document.querySelector('.orbit-center');
    if (orbitCenter) {
        orbitCenter.style.animation = 'pulse 2s infinite';
    }
}

// Steps animation for How It Works section
function initStepsAnimation() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
        
        // Observe when the step comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        step.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        step.style.opacity = '1';
                        step.style.transform = 'translateX(0)';
                    }, 150 * index);
                    
                    observer.unobserve(step);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(step);
    });
}

// Pricing cards animation
function initPricingAnimation() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Observe when the card comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 150 * index);
                    
                    observer.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
    });
}

// Contact form interactions
function initContactForm() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        // Label animation
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
    
    // Contact methods hover effect
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
            method.style.backgroundColor = 'rgba(26, 26, 46, 0.8)';
        });
        
        method.addEventListener('mouseleave', () => {
            method.style.backgroundColor = 'rgba(26, 26, 46, 0.6)';
        });
    });
}

// Read More functionality for feature cards
function setupReadMoreLinks() {
    const readMoreLinks = document.querySelectorAll('.feature-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const card = link.closest('.feature-card');
            const desc = card.querySelector('.feature-desc');
            const fullText = desc.getAttribute('data-full-text');
            
            if (link.classList.contains('expanded')) {
                // Collapse
                desc.textContent = fullText.substring(0, 120) + '...';
                link.innerHTML = 'Czytaj więcej <i class="bx bx-chevron-right"></i>';
                link.classList.remove('expanded');
            } else {
                // Expand
                desc.textContent = fullText;
                link.innerHTML = 'Zwiń <i class="bx bx-chevron-up"></i>';
                link.classList.add('expanded');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class with delay based on data attribute
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                
                // Unobserve after animation is applied
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Set initial state and observe each element
    animatedElements.forEach((element, index) => {
        // Set a staggered delay for elements in the same container
        const staggerDelay = (index % 5) * 150;
        element.setAttribute('data-delay', staggerDelay);
        
        // Add default animation styles
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        // Start observing
        observer.observe(element);
    });
    
    // Check for elements already in view on page load
    animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            const delay = element.getAttribute('data-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('animated');
            }, delay);
            
            observer.unobserve(element);
        }
    });
    
    // Add animated class to define animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll.animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
} 