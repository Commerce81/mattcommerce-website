// ============================================
// GOOGLE SHEETS CONFIGURATION
// ============================================
// Replace this with your Google Sheets Web App URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxve9pEh9V_YRdXDdBjS4EXON5yWpWe26uUWLZ8WGHAws3oBT9ZiQuwkX4oGQdEbK4/exec';

// ============================================
// REVIEW BANNER - Auto-rotating reviews
// ============================================
let bannerReviews = [];
let currentBannerSlide = 0;
let bannerInterval;

async function loadBannerReviews() {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        
        if (data && data.reviews && data.reviews.length > 0) {
            bannerReviews = data.reviews;
            displayBannerReviews();
            startBannerRotation();
        }
    } catch (error) {
        console.error('Error loading banner reviews:', error);
        // Fallback to default reviews if Google Sheets fails
        useFallbackBannerReviews();
    }
}

function useFallbackBannerReviews() {
    bannerReviews = [
        {
            eventType: 'wedding',
            text: 'We had Matt perform at our picnic elopement and he was an absolute dream to work with. He is so talented and truly made our special day even more romantic and magical.',
            reviewer: 'David G. - Santa Barbara, CA'
        },
        {
            eventType: 'corporate function',
            text: 'Matt exceeded my expectations. Everyone at the event loved his music! He was so wonderful and professional and played like a STAR!',
            reviewer: 'Mary W. - Long Beach, CA'
        },
        {
            eventType: 'birthday party',
            text: 'Everyone loved the music and has been telling me all week how amazing Matt was. He has an amazingly diverse song list, a fabulous voice and lovely demeanor.',
            reviewer: 'Chrissie C. - El Segundo, CA'
        },
        {
            eventType: 'wedding proposal',
            text: 'Matt did a splendid performance during my surprise proposal at Santa Monica Pier. He really made the entire event magical for my future wife and me.',
            reviewer: 'Mauricio - Santa Monica, CA'
        }
    ];
    displayBannerReviews();
    startBannerRotation();
}

function displayBannerReviews() {
    const bannerContent = document.querySelector('.review-banner-content');
    bannerContent.innerHTML = '';
    
    bannerReviews.forEach((review, index) => {
        const slide = document.createElement('div');
        slide.className = `review-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <div class="event-type">${review.eventType || ''}</div>
            <div class="stars">★★★★★</div>
            <p>"${review.text}"</p>
            <div class="reviewer">${review.reviewer || review.source || ''}</div>
        `;
        bannerContent.appendChild(slide);
    });
}

function startBannerRotation() {
    const slides = document.querySelectorAll('.review-slide');
    if (slides.length <= 1) return;
    
    bannerInterval = setInterval(() => {
        slides[currentBannerSlide].classList.remove('active');
        currentBannerSlide = (currentBannerSlide + 1) % slides.length;
        slides[currentBannerSlide].classList.add('active');
    }, 10000); // Rotate every 10 seconds
}

// ============================================
// REVIEWS PAGE - Full reviews display
// ============================================
async function loadFullReviews() {
    const container = document.getElementById('reviewsContainer');
    if (!container) return;
    
    try {
        const response = await fetch(GOOGLE_SHEETS_URL);
        const data = await response.json();
        
        if (data && data.reviews && data.reviews.length > 0) {
            displayFullReviews(data.reviews);
        } else {
            container.innerHTML = '<p style="text-align: center; color: #999;">No reviews available yet.</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        container.innerHTML = '<p style="text-align: center; color: #999;">Unable to load reviews. Please try again later.</p>';
    }
}

function displayFullReviews(reviews) {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = '';
    
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="event-type">${review.eventType || ''}</div>
            <div class="stars">★★★★★</div>
            <p>"${review.text}"</p>
            <div class="reviewer">${review.reviewer || review.source || ''}</div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thanks for your message! This form needs to be connected to a backend service like Formspree or EmailJS.');
        // To connect: Use Formspree (https://formspree.io) or EmailJS (https://www.emailjs.com)
    });
}

// ============================================
// MOBILE MENU
// ============================================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Load banner reviews on all pages
    loadBannerReviews();
    
    // Load full reviews only on reviews page
    if (document.getElementById('reviewsContainer')) {
        loadFullReviews();
    }
});
