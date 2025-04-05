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
    const orbitSystem = document.querySelector('.orbit-system');
    const orbitCenter = document.querySelector('.orbit-center');
    const orbitIcons = document.querySelectorAll('.orbit-icon');
    const orbits = document.querySelectorAll('.orbit');
    
    // Efekt interaktywności przy ruchu myszą
    if (orbitSystem) {
        orbitSystem.addEventListener('mousemove', (e) => {
            const rect = orbitSystem.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Oblicz odległość od środka
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            // Limituj efekt przechylenia
            const tiltX = Math.max(Math.min(mouseY / 20, 10), -10);
            const tiltY = Math.max(Math.min(mouseX / 20, 10), -10);
            
            // Animuj przechylenie całego systemu orbit
            orbitSystem.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
            
            // Poruszaj lekkno obiekty na orbitach w przeciwnym kierunku dla lepszego efektu 3D
            orbitIcons.forEach(icon => {
                const intensity = 1.2;
                icon.style.transform = `translateZ(30px) translateY(${-tiltX * intensity}px) translateX(${tiltY * intensity}px)`;
            });
        });
        
        // Reset po opuszczeniu myszą
        orbitSystem.addEventListener('mouseleave', () => {
            orbitSystem.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            orbitIcons.forEach(icon => {
                icon.style.transform = '';
            });
        });
    }
    
    // Efekt kliknięcia na centrum
    if (orbitCenter) {
        orbitCenter.addEventListener('click', () => {
            // Dodaj klasę z animacją pulsu
            orbitCenter.classList.add('pulse-click');
            
            // Dodaj efekt fali dla orbit
            orbits.forEach((orbit, index) => {
                setTimeout(() => {
                    orbit.classList.add('orbit-pulse');
                    setTimeout(() => {
                        orbit.classList.remove('orbit-pulse');
                    }, 1000);
                }, index * 150);
            });
            
            // Usuń klasę po zakończeniu animacji
            setTimeout(() => {
                orbitCenter.classList.remove('pulse-click');
            }, 1000);
        });
    }
    
    // Interaktywne ikony na orbitach
    orbitIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Dodaj klasę efektu kliknięcia
            icon.classList.add('icon-clicked');
            
            // Tworzymy dymek z informacją
            const tooltip = document.createElement('div');
            tooltip.classList.add('orbit-tooltip');
            
            // Określ zawartość na podstawie ikony
            const iconEl = icon.querySelector('i');
            if (iconEl) {
                const iconClass = iconEl.classList.value;
                
                if (iconClass.includes('calendar')) {
                    tooltip.innerHTML = '<h4>Kalendarz</h4><p>Planuj zadania i spotkania</p>';
                } else if (iconClass.includes('bell')) {
                    tooltip.innerHTML = '<h4>Powiadomienia</h4><p>Bądź na bieżąco z terminami</p>';
                } else if (iconClass.includes('chart')) {
                    tooltip.innerHTML = '<h4>Analityka</h4><p>Śledź swoją wydajność</p>';
                } else if (iconClass.includes('check')) {
                    tooltip.innerHTML = '<h4>Zadania</h4><p>Twórz i zarządzaj zadaniami</p>';
                }
            }
            
            // Dodaj dymek do dokumentu
            document.body.appendChild(tooltip);
            
            // Pozycjonuj dymek
            const iconRect = icon.getBoundingClientRect();
            tooltip.style.left = `${iconRect.left + iconRect.width / 2}px`;
            tooltip.style.top = `${iconRect.top - tooltip.offsetHeight - 10}px`;
            
            // Animacja wejścia
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 50);
            
            // Usuń dymek po pewnym czasie
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }, 3000);
            
            // Usuń klasę efektu kliknięcia
            setTimeout(() => {
                icon.classList.remove('icon-clicked');
            }, 600);
        });
    });
    
    // Dodatkowy efekt 3D dla całego systemu
    if (window.DeviceOrientationEvent && window.innerWidth > 768) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const tiltX = Math.max(Math.min(e.beta - 40, 15), -15) / 2;
                const tiltY = Math.max(Math.min(e.gamma, 15), -15) / 2;
                
                orbitSystem.style.transform = `perspective(1000px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
            }
        });
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

// Tech tabs functionality - usuwam
function initTechTabs() {
    const tabs = document.querySelectorAll('.tech-tab');
    const panels = document.querySelectorAll('.tech-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panels
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding panel
            const targetPanel = document.querySelector(`.tech-panel[data-panel="${tab.dataset.tab}"]`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
}

// Handle registration form submission
document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.querySelector('#register-modal form');
  
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simulate registration (no actual backend validation)
      console.log('Registration submitted');
      
      // Close modal
      const registerModal = document.getElementById('register-modal');
      registerModal.classList.remove('show');
      document.body.classList.remove('modal-open');
      const modalBackdrops = document.getElementsByClassName('modal-backdrop');
      while(modalBackdrops.length > 0) {
        modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
      }
      
      // Simulating a log in process with a short delay
      const loginMessage = document.createElement('div');
      loginMessage.className = 'login-message';
      loginMessage.innerHTML = '<div class="loading-spinner"></div><p>Logowanie...</p>';
      document.body.appendChild(loginMessage);
      
      // After a short delay, redirect to the todos page
      setTimeout(function() {
        window.location.href = 'projekty/timemanager-dashboard/';
      }, 2000);
    });
  }
}); 