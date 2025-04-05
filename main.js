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
    initScrollAnimations();
    setupReadMoreLinks();
    enhanceTrustedLogos();
    
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
    document.querySelectorAll('.auth-form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (in a real app, this would be after server validation)
            const formType = form.closest('.modal').id === 'login-modal' ? 'logowania' : 'rejestracji';
            
            // Mock form processing
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Przetwarzanie...';
            
            setTimeout(() => {
                // Close modal
                form.closest('.modal').classList.remove('active');
                modalOverlay.classList.remove('active');
                
                // Show success notification
                showNotification(`Proces ${formType} zakończony pomyślnie!`, 'success');
                
                // Reset form
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                // Re-enable page scrolling
                document.body.style.overflow = '';
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
            e.preventDefault();
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
                    }, 800 + (index * 200));
                });
            }
        }, 800);
    }
}

// Orbit system setup and animation
function initOrbitSystem() {
    const orbitSystem = document.querySelector('.orbit-system');
    if (!orbitSystem) return;

    // Center the orbit system properly
    const orbits = orbitSystem.querySelectorAll('.orbit');
    const orbitCenter = orbitSystem.querySelector('.orbit-center');

    // Make sure orbit center is perfectly centered
    if (orbitCenter) {
        orbitCenter.style.top = '50%';
        orbitCenter.style.left = '50%';
        orbitCenter.style.transform = 'translate(-50%, -50%)';
    }
    
    // Position orbit icons evenly
    orbits.forEach(orbit => {
        const orbitIcon = orbit.querySelector('.orbit-icon');
        if (orbitIcon) {
            // Add hover effect to orbit icons
            orbitIcon.addEventListener('mouseenter', () => {
                orbit.style.borderColor = 'rgba(138, 92, 255, 0.6)';
                orbitIcon.style.transform = 'scale(1.2)';
                orbitIcon.style.background = 'rgba(138, 92, 255, 0.2)';
            });
            
            orbitIcon.addEventListener('mouseleave', () => {
                orbit.style.borderColor = 'rgba(138, 92, 255, 0.3)';
                
                // Reset transform based on position
                if (orbitIcon.classList.contains('top')) {
                    orbitIcon.style.transform = 'translateY(0)';
                } else if (orbitIcon.classList.contains('right')) {
                    orbitIcon.style.transform = 'translateX(0)';
                } else if (orbitIcon.classList.contains('bottom')) {
                    orbitIcon.style.transform = 'translateY(0)';
                } else if (orbitIcon.classList.contains('left')) {
                    orbitIcon.style.transform = 'translateX(0)';
                } else {
                    orbitIcon.style.transform = 'scale(1)';
                }
                
                orbitIcon.style.background = 'rgba(26, 26, 46, 0.8)';
            });
        }
    });
    
    // Add slight pulse animation to orbit system
    orbitSystem.style.animation = 'pulse 8s infinite alternate';
}

// Setup Read More links for feature cards
function setupReadMoreLinks() {
    const readMoreLinks = document.querySelectorAll('.feature-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const featureCard = link.closest('.feature-card');
            const featureDesc = featureCard.querySelector('.feature-desc');
            const featureList = featureCard.querySelector('.feature-list');
            
            // Toggle expanded state
            featureCard.classList.toggle('expanded');
            
            if (featureCard.classList.contains('expanded')) {
                // Change text to "Czytaj mniej"
                link.innerHTML = 'Czytaj mniej <i class="bx bx-chevron-up"></i>';
                
                // Show full description
                if (featureDesc) {
                    featureDesc.style.maxHeight = 'none';
                    featureDesc.style.WebkitLineClamp = 'unset';
                }
                
                // Show full list
                if (featureList) {
                    featureList.style.maxHeight = 'none';
                }
            } else {
                // Change text back to "Czytaj więcej"
                link.innerHTML = 'Czytaj więcej <i class="bx bx-chevron-right"></i>';
                
                // Truncate description
                if (featureDesc) {
                    featureDesc.style.maxHeight = '4.8em'; // 3 lines
                    featureDesc.style.WebkitLineClamp = '3';
                }
                
                // Limit list height
                if (featureList) {
                    featureList.style.maxHeight = '6em'; // About 3 items
                }
            }
        });
    });
}

// Enhance scroll animations for all sections
function initScrollAnimations() {
    // Wybierz wszystkie elementy z klasą animate-on-scroll
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    
    // Dodaj klasę visible do wszystkich elementów, które są już widoczne przy załadowaniu
    animateVisibleElements();
    
    // Ustaw Intersection Observer dla animacji podczas przewijania
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Gdy element wchodzi w viewport
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Opóźnienie oparte na typie elementu lub pozycji
                let delay = 0;
                
                // Zastosuj różne opóźnienia w zależności od typu elementu
                if (element.classList.contains("feature-card")) {
                    const index = Array.from(
                        document.querySelectorAll(".feature-card")
                    ).indexOf(element);
                    delay = index * 150;
                } else if (element.classList.contains("reason-card")) {
                    const index = Array.from(
                        document.querySelectorAll(".reason-card")
                    ).indexOf(element);
                    delay = index * 150;
                } else if (element.classList.contains("feature-icon")) {
                    delay = 100;
                } else if (element.classList.contains("reason-icon")) {
                    delay = 100;
                } else if (element.classList.contains("feature-more")) {
                    delay = 300; // Opóźnienie dla strzałek "Read More"
                }
                
                // Dodaj klasę visible po określonym opóźnieniu
                setTimeout(() => {
                    element.classList.add("visible");
                    
                    // Dla kart funkcji, animuj również ich ikony i przyciski "Czytaj więcej"
                    if (element.classList.contains("feature-card")) {
                        const icon = element.querySelector(".feature-icon");
                        const more = element.querySelector(".feature-more");
                        
                        if (icon) icon.classList.add("visible");
                        if (more) {
                            setTimeout(() => {
                                more.classList.add("visible");
                            }, 300);
                        }
                    }
                    
                    // Dla kart powodów, animuj również ich ikony
                    if (element.classList.contains("reason-card")) {
                        const icon = element.querySelector(".reason-icon");
                        if (icon) icon.classList.add("visible");
                    }
                }, delay);
                
                // Przestań obserwować ten element po jego animacji
                observer.unobserve(element);
            }
        });
    }, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% elementu musi być widoczne, aby wywołać callback
    });
    
    // Rozpocznij obserwację każdego elementu
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Funkcja do animacji elementów, które są już widoczne przy załadowaniu strony
function animateVisibleElements() {
    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    
    animatedElements.forEach((element, index) => {
        // Sprawdź, czy element jest już widoczny w oknie przeglądarki
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top < windowHeight && rect.bottom > 0) {
            let delay = 0;
            
            // Zastosuj różne opóźnienia w zależności od typu elementu
            if (element.classList.contains("feature-card")) {
                delay = index * 150;
            } else if (element.classList.contains("reason-card")) {
                delay = index * 150;
            } else if (element.classList.contains("feature-icon")) {
                delay = 100;
            } else if (element.classList.contains("reason-icon")) {
                delay = 100;
            } else if (element.classList.contains("feature-more")) {
                delay = 300; // Opóźnienie dla strzałek "Read More"
            }
            
            // Animuj element po określonym opóźnieniu
            setTimeout(() => {
                element.classList.add("visible");
                
                // Dla kart funkcji, animuj również ich ikony i przyciski "Czytaj więcej"
                if (element.classList.contains("feature-card")) {
                    const icon = element.querySelector(".feature-icon");
                    const more = element.querySelector(".feature-more");
                    
                    if (icon) icon.classList.add("visible");
                    if (more) {
                        setTimeout(() => {
                            more.classList.add("visible");
                        }, 300);
                    }
                }
                
                // Dla kart powodów, animuj również ich ikony
                if (element.classList.contains("reason-card")) {
                    const icon = element.querySelector(".reason-icon");
                    if (icon) icon.classList.add("visible");
                }
            }, delay);
        }
    });
}

// Enhance the trusted by logos section
function enhanceTrustedLogos() {
    const trustedLogos = document.querySelectorAll('.trusted-logo');
    
    // Update logo alt texts and images with real company names
    const companies = [
        { name: "Google", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=Google" },
        { name: "Microsoft", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=Microsoft" },
        { name: "Adobe", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=Adobe" },
        { name: "Amazon", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=Amazon" },
        { name: "IBM", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=IBM" },
        { name: "Tesla", img: "https://via.placeholder.com/120x40/1A1A2E/8A5CFF?text=Tesla" }
    ];
    
    trustedLogos.forEach((logo, index) => {
        if (index < companies.length) {
            if (logo.tagName.toLowerCase() === 'img') {
                logo.src = companies[index].img;
                logo.alt = companies[index].name;
            }
        }
        
        // Add subtle animation on load
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            logo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            logo.style.opacity = '0.7';
            logo.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
}

// Add subtle hover effects to buttons
function enhanceButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.15)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });
}

// Call additional initialization on load
window.addEventListener('load', () => {
    enhanceButtonEffects();
    
    // Ręcznie pokaż wszystkie strzałki "czytaj więcej" po załadowaniu
    document.querySelectorAll('.feature-more').forEach(arrow => {
        setTimeout(() => {
            arrow.classList.add('visible');
            arrow.style.opacity = '1';
            arrow.style.transform = 'translateY(0)';
        }, 800);
    });
}); 