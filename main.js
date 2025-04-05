// Intro animation & DOM load handling
document.addEventListener('DOMContentLoaded', () => {
    // Handle intro animation
    setTimeout(() => {
        document.getElementById('intro-animation').classList.add('hidden');
        document.getElementById('main-content').classList.add('visible');
    }, 2500);

    // Initialize all animations and interactions
    initNavbar();
    initHeroAnimations();
    initOrbitSystem();
    initScrollAnimations();
    setupReadMoreLinks();
    enhanceTrustedLogos();
});

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
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                }
                
                // Scroll to element
                targetElement.scrollIntoView({
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
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Animate hero stats with sequence
    const stats = document.querySelectorAll('.stat');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            stat.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 800 + (index * 200));
    });
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
    // Add animation classes to elements
    const animElements = [
        ...document.querySelectorAll('.feature-card'),
        ...document.querySelectorAll('.reason-card'),
        ...document.querySelectorAll('.showcase-content'),
        ...document.querySelectorAll('.showcase-visual'),
        ...document.querySelectorAll('.cta-content'),
        ...document.querySelectorAll('.footer-content')
    ];
    
    animElements.forEach(el => el.classList.add('animate-on-scroll'));
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation based on item type and index
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, getDelayForElement(entry.target, index));
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });
    
    // Observe all animated elements
    animElements.forEach(el => observer.observe(el));
    
    // Function to calculate staggered delay based on element type
    function getDelayForElement(element, index) {
        if (element.classList.contains('feature-card')) {
            return 100 + (index % 4) * 150; // Stagger feature cards
        } else if (element.classList.contains('reason-card')) {
            return 100 + (index % 4) * 150; // Stagger reason cards
        } else {
            return 100; // Default delay
        }
    }
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
}); 