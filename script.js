// Navigation background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        nav.style.background = 'rgba(255, 255, 255, 0.9)';
    } else {
        nav.classList.remove('scrolled');
        nav.style.background = 'rgba(255, 255, 255, 0.7)';
    }
});

// Custom Cursor Animation
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows exact cursor instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

// Deep animation effect with Lerp (Linear Interpolation)
function animateCursor() {
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;

    // Adjust this value for how "deep" or delayed the trailing circle is. 0.15 is smooth and springy.
    outlineX = outlineX + (distX * 0.15);
    outlineY = outlineY + (distY * 0.15);

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor Hover Effects for Interactive Elements
const interactables = document.querySelectorAll('a, button, .btn, .social-icon, .tag, .project-card, .timeline-content');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Background Dust/Chunk Particles Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce horizontally or vertically if out of bounds
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }

        // Gentle cursor scatter effect
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
            // gently push particles away from cursor
            this.x -= dx * 0.015;
            this.y -= dy * 0.015;
        }

        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    // Adjust particle density based on screen size
    let numberOfParticles = (canvas.height * canvas.width) / 10000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        // Very slow drifting speed
        let speedX = (Math.random() * 0.4) - 0.2;
        let speedY = (Math.random() * 0.4) - 0.2;

        // Colors: Soft yellow and light skyblue
        let isYellow = Math.random() > 0.5;
        let color = isYellow ? 'rgba(254, 240, 138, 0.4)' : 'rgba(186, 230, 253, 0.4)';

        particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

initParticles();
animateParticles();


// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let isMenuOpen = false;

mobileBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('active');
    mobileBtn.innerHTML = isMenuOpen ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
});

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenu.classList.remove('active');
        mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// Active nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Trigger initial reveal for elements already in viewport
window.dispatchEvent(new Event('scroll'));
