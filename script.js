// TimeManager Landing Page Script

document.addEventListener('DOMContentLoaded', function() {
    // Apply glow effect class to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('glow-effect');
    });

    // Animate orbit elements
    const orbitElements = document.querySelectorAll('.orbit-element');
    
    // Set random speeds for orbit animation
    orbitElements.forEach((element, index) => {
        // Create orbital rotation effect
        rotateElement(element, 5 + (index * 2), index % 2 === 0);
    });

    // Add scroll reveal animations
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Simple reveal on scroll
    window.addEventListener('scroll', function() {
        featureCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0.5';
                card.style.transform = 'translateY(20px)';
            }
        });
    });

    // Initialize feature cards with initial state
    featureCards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });
    
    // Trigger scroll event on load to reveal visible elements
    window.dispatchEvent(new Event('scroll'));
});

// Function to rotate elements in orbit
function rotateElement(element, speed, clockwise) {
    const centerX = 0;
    const centerY = 0;
    const radius = 32; // Half of orbit width (64px)
    let angle = 0;
    
    // Get the current position information
    const currentTransform = window.getComputedStyle(element).transform;
    const currentTop = parseFloat(element.style.top || 0);
    const currentLeft = parseFloat(element.style.left || 0);
    
    setInterval(() => {
        // Update angle
        angle += clockwise ? 0.01 * speed : -0.01 * speed;
        
        // Calculate new position
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Update element style with new position
        // We use CSS custom properties to update the orbit position
        element.style.transform = `translate(${x}px, ${y}px)`;
    }, 50);
} 