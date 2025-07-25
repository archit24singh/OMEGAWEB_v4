/**
 * Footer Component JavaScript
 * Loads and initializes the site footer consistently across all pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initFooter();
});

/**
 * Initialize the site footer
 */
function initFooter() {
    // If footer is already in the page, just initialize functionality
    if (document.querySelector('footer.main-footer')) {
        initFooterFunctionality();
        return;
    }
    
    // If footer needs to be injected, load it
    loadFooter();
}

/**
 * Load the footer HTML into the page
 */
function loadFooter() {
    // Target element where footer should be inserted
    const footerContainer = document.getElementById('footerContainer');
    
    // Create footer element
    const footer = document.createElement('footer');
    footer.className = 'main-footer bg-section';
    footer.style.backgroundColor = '#0B2452';
    footer.style.paddingTop = '100px';
    footer.style.position = 'relative';
    
    // Insert footer HTML
    footer.innerHTML = `
    <div class="container position-relative">
        <!-- Company Card (Drop Container) -->
        <div class="drop-container">
            <div class="company-card bg-white text-dark p-4 rounded shadow-lg">
                <div class="footer-logo mb-3 text-center">
                    <a href="index.html">
                        <img src="images/Blue-Logo2.png" alt="Omega Medical Billing" class="img-fluid" style="max-height: 120px;">
                    </a>
                </div>
                <h5 class="text-center mb-2" style="color: #0B2452;">Call Now</h5>
                <p class="text-center mb-3">
                    <a href="tel:+17137027332" style="color: #0B2452; font-weight: bold; text-decoration: none; font-size: 1.25rem;">
                        <i class="fa-solid fa-phone me-2"></i>+1 713-702-7332
                    </a>
                </p>
                <hr>
                <p class="text-center mb-2">
                    <a href="mailto:info@ombcs.com" style="color: #0B2452; text-decoration: none;">
                        <i class="fa-solid fa-envelope me-2"></i>info@ombcs.com
                    </a>
                </p>
                <p class="text-center mb-3" style="color: #0B2452;">
                    <i class="fa-solid fa-location-dot me-2"></i>906 W. Medical Center Blvd<br>
                    Webster, TX 77598
                </p>
                <div class="d-flex justify-content-center gap-3 mt-3 mb-2">
                    <a href="https://www.linkedin.com/company/omega-medical-billing" target="_blank" style="color: #0B2452; font-size: 1.25rem;">
                        <i class="fa-brands fa-linkedin-in"></i>
                    </a>
                    <a href="https://www.facebook.com/omegamedicalbilling" target="_blank" style="color: #0B2452; font-size: 1.25rem;">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/omega_mbs/" target="_blank" style="color: #0B2452; font-size: 1.25rem;">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                </div>
                <div class="copyright-text small text-center mt-3 pt-3" style="color: #0B2452; border-top: 1px solid #e0e0e0;">
                    Copyright © 2025 All Rights Reserved.
                </div>
            </div>
        </div>
        
        <!-- Main Footer Content -->
        <div class="row footer-content" style="min-height: 400px;">
            <div class="col-lg-4 offset-lg-4">
                <div class="footer-links">
                    <h3>Services</h3>
                    <ul>
                        <li><a href="denial-management.html">Denial Management</a></li>
                        <li><a href="medical-billing.html">Medical Billing</a></li>
                        <li><a href="medical-coding.html">Medical Coding</a></li>
                        <li><a href="provider-credentialing.html">Medical Credentialing</a></li>
                        <li><a href="revenue-cycle-management.html">Revenue Cycle Management</a></li>
                        <li><a href="medical-billing-audit.html">Medical Billing Audit</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="specialties.html">Specialties</a></li>
                        <li><a href="blogs.html">Blog</a></li>
                        <li><a href="careers.html">Careers</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <hr style="border-color: rgba(255,255,255,0.2); margin: 2rem 0;">
        
        <div class="footer-copyright">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <div class="footer-copyright-text">
                        <p>
                            Copyright © 2025 All Rights Reserved.
                        </p>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="footer-terms-condition">
                        <ul class="bottom-links">
                            <li><a href="privacy-policy.html">Privacy Policy</a></li>
                            <li><a href="terms-conditions.html">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Insert footer at the end of the body or in dedicated container
    if (footerContainer) {
        footerContainer.appendChild(footer);
    } else {
        document.body.appendChild(footer);
    }
    
    // Initialize footer functionality after inserting
    initFooterFunctionality();
    
    // Add the footer styles
    addFooterStyles();
}

/**
 * Initialize footer interactive functionality
 */
function initFooterFunctionality() {
    // Add smooth scrolling to footer links
    initSmoothScrolling();
    
    // Initialize back to top button if present
    initBackToTop();
    
    // Add any other footer-specific functionality here
}

/**
 * Initialize smooth scrolling for footer links
 */
function initSmoothScrolling() {
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initialize back to top button if present
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Add footer-specific styles
 */
function addFooterStyles() {
    // Check if styles already exist
    if (document.getElementById('footer-styles')) {
        return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'footer-styles';
    
    // Add CSS rules
    style.textContent = `
    /* Footer styles */
    .drop-container {
        position: absolute;
        width: 300px;
        left: 15px;
        top: -60px;
        z-index: 10;
    }
    
    .company-card {
        border-radius: 16px !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
    }
    
    .company-card a {
        transition: color 0.2s ease;
    }
    
    .company-card a:hover {
        opacity: 0.8;
    }
    
    /* Enhanced Footer Link Animations */
    .footer-links ul li a {
        transition: all 0.3s ease;
        display: block;
    }
    
    .footer-links ul li:hover a {
        transform: translateX(5px);
    }
    
    .footer-links ul li:hover::before {
        background-color: #FFFFFF;
    }
    
    /* Bottom links - no transition */
    .footer-terms-condition ul.bottom-links li a {
        transition: none;
    }
    
    .footer-terms-condition ul.bottom-links li:hover a {
        transform: none;
        color: var(--white-color);
    }
    
    .footer-terms-condition ul.bottom-links li:hover::before {
        background-color: var(--accent-color);
    }
    
    /* Responsive adjustments */
    @media (max-width: 992px) {
        .main-footer {
            padding-top: 30px !important; /* Standard padding */
        }
        
        .drop-container {
            position: static; /* Change to static positioning */
            width: 100%;
            max-width: 300px;
            height: auto;
            margin: 0 auto 40px auto; /* Centered with margin bottom */
            top: auto;
            left: auto;
            transform: none;
        }
        
        .company-card {
            max-width: 100%;
            margin: 0 auto;
        }
        
        /* Reorder footer sections */
        .main-footer .container {
            display: flex;
            flex-direction: column;
        }
        
        .main-footer .drop-container {
            order: 1; /* First item */
        }
        
        .main-footer .footer-content {
            order: 2; /* Second item */
            min-height: 0;
            margin-top: 0;
        }
        
        .main-footer hr {
            order: 3; /* Third item */
        }
        
        .main-footer .footer-copyright {
            order: 4; /* Fourth item */
        }
        
        .offset-lg-4 {
            margin-left: 0;
        }
        
        /* Adjust columns for mobile */
        .footer-links {
            margin-bottom: 30px;
        }
        
        /* Fix copyright section on mobile */
        .footer-copyright-text,
        .footer-terms-condition {
            text-align: center;
            margin-bottom: 15px;
        }
        
        .footer-terms-condition ul.bottom-links {
            justify-content: center;
            padding-left: 0;
        }
    }
    
    /* Extra small devices */
    @media (max-width: 576px) {
        .drop-container {
            max-width: 90%;
        }
        
        .footer-copyright .row {
            flex-direction: column;
        }
        
        .footer-copyright-text,
        .footer-terms-condition {
            width: 100%;
        }
    }
    `;
    
    // Append style to head
    document.head.appendChild(style);
}