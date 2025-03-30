// Initialize password generator
function initPasswordGenerator() {
    const generateBtn = document.querySelector('.generate-password-btn');
    const passwordDisplay = document.querySelector('.generated-password-display');
    const passwordText = document.querySelector('.password-text');
    const copyBtn = document.querySelector('.copy-password');
    const copyTooltip = document.querySelector('.password-tooltip');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    // Password options elements
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const passwordLength = document.getElementById('password-length');
    const lengthValue = document.getElementById('length-value');
    
    // Update length display when range slider changes
    if (passwordLength && lengthValue) {
        passwordLength.addEventListener('input', function() {
            lengthValue.textContent = this.value;
        });
    }
    
    // Generate password when button is clicked
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            // Get options
            const options = {
                length: passwordLength ? parseInt(passwordLength.value) : 16,
                uppercase: includeUppercase ? includeUppercase.checked : true,
                lowercase: includeLowercase ? includeLowercase.checked : true,
                numbers: includeNumbers ? includeNumbers.checked : true,
                symbols: includeSymbols ? includeSymbols.checked : true
            };
            
            // Ensure at least one character type is selected
            if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
                // Default to lowercase if nothing selected
                options.lowercase = true;
                if (includeLowercase) includeLowercase.checked = true;
            }
            
            // Generate the password
            const password = generatePassword(options);
            
            // Show the generated password
            if (passwordText) passwordText.textContent = password;
            if (passwordDisplay) passwordDisplay.classList.add('show');
            
            // Fill password fields
            if (passwordInput) passwordInput.value = password;
            if (confirmPasswordInput) confirmPasswordInput.value = password;
            
            // Trigger input event to update password strength and validation
            if (passwordInput) {
                const inputEvent = new Event('input', { bubbles: true });
                passwordInput.dispatchEvent(inputEvent);
            }
        });
    }
    
    // Copy password to clipboard
    if (copyBtn && passwordText) {
        copyBtn.addEventListener('click', function() {
            const password = passwordText.textContent;
            navigator.clipboard.writeText(password).then(() => {
                // Show copy confirmation
                if (copyTooltip) {
                    copyTooltip.style.display = 'block';
                    copyTooltip.style.animation = 'fadeInOut 1.5s forwards';
                    
                    setTimeout(() => {
                        copyTooltip.style.display = 'none';
                        copyTooltip.style.animation = '';
                    }, 1500);
                }
            }).catch(err => {
                console.error('Failed to copy password: ', err);
                // Alternative copy method for browsers that don't support clipboard API
                const textarea = document.createElement('textarea');
                textarea.value = password;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                
                if (copyTooltip) {
                    copyTooltip.style.display = 'block';
                    copyTooltip.style.animation = 'fadeInOut 1.5s forwards';
                    
                    setTimeout(() => {
                        copyTooltip.style.display = 'none';
                        copyTooltip.style.animation = '';
                    }, 1500);
                }
            });
        });
    }
    
    // Evaluate password strength when typed
    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = evaluatePasswordStrength(password);
            
            // Update strength bar
            strengthBar.className = 'strength-bar';
            
            if (password.length === 0) {
                strengthBar.style.width = '0';
                strengthText.textContent = '';
                return;
            }
            
            if (strength < 40) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (strength < 70) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium strength';
            } else if (strength < 90) {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
            } else {
                strengthBar.classList.add('very-strong');
                strengthText.textContent = 'Very strong password';
            }
        });
    }
}

// Function to generate a password
function generatePassword(options) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
    
    let availableChars = '';
    let password = '';
    
    // Add character types based on options
    if (options.uppercase) availableChars += uppercaseChars;
    if (options.lowercase) availableChars += lowercaseChars;
    if (options.numbers) availableChars += numberChars;
    if (options.symbols) availableChars += symbolChars;
    
    // Ensure at least one of each selected character type
    if (options.uppercase) {
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    }
    if (options.lowercase) {
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    }
    if (options.numbers) {
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    }
    if (options.symbols) {
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    }
    
    // Fill the rest of the password length with random characters
    for (let i = password.length; i < options.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars.charAt(randomIndex);
    }
    
    // Shuffle the password to randomize the placement of required characters
    return shuffleString(password);
}

// Function to shuffle a string
function shuffleString(string) {
    const array = string.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array.join('');
}

// Function to evaluate password strength
function evaluatePasswordStrength(password) {
    if (!password) return 0;
    
    let score = 0;
    
    // Length contribution (up to 30 points)
    score += Math.min(30, password.length * 2);
    
    // Character variety contribution
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
    score += varietyCount * 10;
    
    // Check for common patterns that weaken passwords
    const hasRepeatedChars = /(.)\\1{2,}/.test(password); // Same character 3+ times in a row
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password);
    const isCommonPassword = ['password', '123456', 'qwerty', 'admin', 'welcome'].includes(password.toLowerCase());
    
    if (hasRepeatedChars) score -= 10;
    if (hasSequential) score -= 10;
    if (isCommonPassword) score -= 30;
    
    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
}

// Add initPasswordGenerator to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log('TimeMaker JS initialized');
    
    // Initialize all components
    initTimeFlowAnimation();
    initTabsSystem();
    setupScrollAnimation();
    
    // Initialize the dashboard animation
    initDashboardAnimation();
    
    // Set random particle movement direction
    setupParticleMovement();
    
    // Initialize the auth modal
    initAuthModal();
    
    // Initialize password generator
    initPasswordGenerator();
}); 