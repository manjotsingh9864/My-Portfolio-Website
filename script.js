// --- CONFIGURATION ---
const ANIMATION_TEXTS = [
    "Machine Learning Engineer.",
    "Data Science Specialist.",
    "Real-Time Application Developer.",
    "AI/ML Solution Architect.",
    "Transforming Data into Intelligence."
];
const TYPING_SPEED = 70; // milliseconds per character
const PAUSE_DURATION = 1500; // milliseconds to pause after typing a phrase
const DELETE_SPEED = 40; // milliseconds per character for deleting

// --- GLOBAL VARIABLES ---
const animatedTextElement = document.querySelector('.animated-text');
const skillBars = document.querySelectorAll('.skill-progress');
const dashboardPanels = document.querySelectorAll('.dashboard-panel');
let textIndex = 0;
let charIndex = 0;

// --- 1. TYPING ANIMATION LOGIC (HERO SECTION) ---

/**
 * Initiates the typing, pausing, and deleting sequence for the text array.
 */
function startTypingAnimation() {
    if (!animatedTextElement) return;

    // Remove the initial static cursor if present
    animatedTextElement.innerHTML = '';
    animatedTextElement.classList.add('highlight-text');

    setTimeout(type, 500); // Initial delay
}

/**
 * Types the current string character by character.
 */
function type() {
    const currentText = ANIMATION_TEXTS[textIndex];
    if (charIndex < currentText.length) {
        animatedTextElement.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(type, TYPING_SPEED);
    } else {
        // Finished typing, pause
        setTimeout(pause, PAUSE_DURATION);
    }
}

/**
 * Pauses before starting the deletion process.
 */
function pause() {
    setTimeout(erase, 1000); // Wait a bit longer before erasing
}

/**
 * Deletes the current string character by character.
 */
function erase() {
    const currentText = ANIMATION_TEXTS[textIndex];
    if (charIndex > 0) {
        animatedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, DELETE_SPEED);
    } else {
        // Finished erasing, move to the next text
        textIndex = (textIndex + 1) % ANIMATION_TEXTS.length;
        setTimeout(type, TYPING_SPEED);
    }
}


// --- 2. SKILL BAR ANIMATION LOGIC (SCROLL TRIGGERED) ---

/**
 * Animates a single skill bar to its target percentage.
 * @param {HTMLElement} progressElement The inner div (.skill-progress)
 * @param {number} level The target percentage (e.g., 95)
 */
function animateSkillBar(progressElement, level) {
    // We rely on CSS transition: width 1.5s ease-out; for smooth animation
    // The width is set here, and CSS handles the transition.
    progressElement.style.width = `${level}%`;
    progressElement.textContent = `${level}%`;
}

/**
 * Checks if the skill matrix section is visible in the viewport.
 */
function checkSkillMatrixVisibility() {
    const skillMatrixSection = document.getElementById('skill-matrix');
    if (!skillMatrixSection) return;

    const rect = skillMatrixSection.getBoundingClientRect();
    const isVisible = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );

    if (isVisible && !skillMatrixSection.classList.contains('animated-once')) {
        // Animate all skill bars
        skillBars.forEach(bar => {
            const level = parseInt(bar.closest('.skill-bar').getAttribute('data-level'), 10);
            animateSkillBar(bar, level);
        });
        skillMatrixSection.classList.add('animated-once'); // Prevent re-animation
        
        // Remove the event listener for optimization after animation
        document.removeEventListener('scroll', checkSkillMatrixVisibility);
    }
}


// --- 3. SECTION FADE-IN ON SCROLL LOGIC ---

/**
 * Adds the 'visible' class to panels that enter the viewport.
 */
function checkPanelVisibility() {
    const triggerBottom = (window.innerHeight / 5) * 4; // Trigger when 80% of viewport is scrolled past

    dashboardPanels.forEach(panel => {
        const panelTop = panel.getBoundingClientRect().top;

        if (panelTop < triggerBottom) {
            panel.classList.add('visible');
        }
    });
}

/**
 * Initializes the observer for fade-in effects.
 * Using Intersection Observer is more efficient than scroll event.
 */
function setupIntersectionObserver() {
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible
                // observer.unobserve(entry.target);
            } else {
                 // For a cool effect, you might remove 'visible' when it leaves the viewport (optional)
                 // entry.target.classList.remove('visible'); 
            }
        });
    }, observerOptions);

    // Add 'fade-in' class and observe all panels (except the hero which is always visible)
    dashboardPanels.forEach((panel, index) => {
        if (index > 0) { // Skip the first panel (hero)
            panel.classList.add('fade-in');
            observer.observe(panel);
        }
    });

    // Make the first panel immediately visible
    if (dashboardPanels.length > 0) {
        dashboardPanels[0].classList.add('visible');
    }
}


// --- 4. NAVIGATION ACTIVE STATE LOGIC ---

/**
 * Updates the 'active' class on navigation links based on scroll position.
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for fixed header
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href.includes(current)) {
            link.classList.add('active');
        }
    });
}

// --- 5. INITIALIZATION ---

window.addEventListener('load', () => {
    // 1. Start the main animation loop
    startTypingAnimation();

    // 2. Set up intersection observer for general panel fade-in
    setupIntersectionObserver();
    
    // 3. Initial check for skill matrix (for case user loads page already scrolled)
    checkSkillMatrixVisibility();
    
    // 4. Initial check for active nav link
    updateActiveNavLink();
});

// Add scroll listener for interactive elements
document.addEventListener('scroll', () => {
    // 1. Check skill matrix visibility
    checkSkillMatrixVisibility();

    // 2. Update active navigation link
    updateActiveNavLink();
});
