import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ========================================
// Preloader
// ========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
  }, 1000);
});

// ========================================
// Three.js 3D Background
// ========================================
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create geometric shapes
const geometry1 = new THREE.TorusGeometry(10, 3, 16, 100);
const geometry2 = new THREE.IcosahedronGeometry(10, 0);
const geometry3 = new THREE.OctahedronGeometry(8, 0);

const material1 = new THREE.MeshStandardMaterial({ 
  color: 0x8a2be2,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});

const material2 = new THREE.MeshStandardMaterial({ 
  color: 0x00bfff,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});

const material3 = new THREE.MeshStandardMaterial({ 
  color: 0xff1493,
  wireframe: true,
  transparent: true,
  opacity: 0.2
});

const torus = new THREE.Mesh(geometry1, material1);
const icosahedron = new THREE.Mesh(geometry2, material2);
const octahedron = new THREE.Mesh(geometry3, material3);

torus.position.set(-15, 0, -10);
icosahedron.position.set(15, -10, -15);
octahedron.position.set(0, 15, -20);

scene.add(torus, icosahedron, octahedron);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Add stars
function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.15, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.005;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.002;

  icosahedron.rotation.x += 0.003;
  icosahedron.rotation.y += 0.007;

  octahedron.rotation.x += 0.006;
  octahedron.rotation.z += 0.003;

  // Mouse interaction
  camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
  camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========================================
// Navigation
// ========================================
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// Portfolio Filtering
// ========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');

    const filterValue = button.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filterValue === 'all' || category === filterValue) {
        item.classList.remove('hidden');
        gsap.to(item, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        gsap.to(item, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            item.classList.add('hidden');
          }
        });
      }
    });
  });
});

// ========================================
// Currency Selector
// ========================================
const currencySelect = document.getElementById('currency-select');
const priceAmounts = document.querySelectorAll('.price-amount');

const currencySymbols = {
  'COP': '$',
  'USD': '$',
  'EUR': '€'
};

const formatPrice = (amount, currency) => {
  if (currency === 'COP') {
    return amount.toLocaleString('es-CO');
  } else {
    return amount.toLocaleString('en-US');
  }
};

currencySelect.addEventListener('change', (e) => {
  const currency = e.target.value;
  const symbol = currencySymbols[currency];

  // Update currency symbols
  document.querySelectorAll('.currency-symbol').forEach(el => {
    el.textContent = symbol;
  });

  // Update prices
  priceAmounts.forEach(el => {
    const cop = parseFloat(el.getAttribute('data-cop'));
    const usd = parseFloat(el.getAttribute('data-usd'));
    const eur = parseFloat(el.getAttribute('data-eur'));

    let amount;
    switch(currency) {
      case 'USD':
        amount = usd;
        break;
      case 'EUR':
        amount = eur;
        break;
      default:
        amount = cop;
    }

    el.textContent = formatPrice(amount, currency);
  });
});

// ========================================
// GSAP Scroll Animations
// ========================================

// Animate sections on scroll
gsap.utils.toArray('section').forEach((section) => {
  gsap.from(section.querySelectorAll('.glass-card'), {
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  });
});

// Animate section titles
gsap.utils.toArray('.section-title').forEach((title) => {
  gsap.from(title, {
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power2.out'
  });
});

// Service cards hover effect with GSAP
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// Parallax effect for hero section
gsap.to('.hero-content', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
  y: 200,
  opacity: 0.5,
  ease: 'none'
});

// Animate portfolio items on scroll
gsap.from('.portfolio-item', {
  scrollTrigger: {
    trigger: '.portfolio-grid',
    start: 'top 80%',
  },
  opacity: 0,
  y: 50,
  duration: 0.6,
  stagger: 0.15,
  ease: 'power2.out'
});

// Animate plan cards
gsap.from('.plan-card', {
  scrollTrigger: {
    trigger: '.plans-grid',
    start: 'top 80%',
  },
  opacity: 0,
  y: 80,
  duration: 0.8,
  stagger: 0.2,
  ease: 'back.out(1.2)'
});

// Animate payment cards
gsap.from('.payment-card', {
  scrollTrigger: {
    trigger: '.payment-grid',
    start: 'top 80%',
  },
  opacity: 0,
  scale: 0.8,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out'
});

// Add floating animation to service icons
document.querySelectorAll('.service-icon').forEach(icon => {
  gsap.to(icon, {
    y: -10,
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
    delay: Math.random() * 2
  });
});

// Animate contact cards
gsap.from('.contact-card', {
  scrollTrigger: {
    trigger: '.contact-grid',
    start: 'top 80%',
  },
  opacity: 0,
  x: -50,
  duration: 0.8,
  stagger: 0.2,
  ease: 'power2.out'
});

// Button hover effects
document.querySelectorAll('.cta-button, .plan-button, .payment-button').forEach(button => {
  button.addEventListener('mouseenter', function() {
    gsap.to(this, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  button.addEventListener('mouseleave', function() {
    gsap.to(this, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
});

// Scroll to top on page load
window.scrollTo(0, 0);

console.log('🌐 Portfolio Website Loaded Successfully!');
console.log('✨ Developed by Alejandro López Murillo');
