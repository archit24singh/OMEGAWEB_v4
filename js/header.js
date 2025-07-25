/**
 * Header Component JavaScript
 * Loads and initializes the site header consistently across all pages
 * Updated with improved mobile responsiveness
 */

document.addEventListener('DOMContentLoaded', function() {
    initHeader();
});

/**
 * Initialize the site header
 */
function initHeader() {
    // Add mobile styles
    addMobileStyles();
    
    // If header is already in the page, just initialize functionality
    if (document.querySelector('header.main-header')) {
        initHeaderFunctionality();
        return;
    }
    
    // If header needs to be injected, load it
    loadHeader();
}

/**
 * Add mobile-specific styles
 */
function addMobileStyles() {
    // Check if styles are already added
    if (document.getElementById('mobile-header-styles')) {
        return;
    }
    
    const mobileStyles = document.createElement('style');
    mobileStyles.id = 'mobile-header-styles';
    mobileStyles.textContent = `
        @media (max-width: 992px) {
            /* Mobile toggle button styles */
            .navbar-toggle {
                display: block;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                width: 30px;
                height: 24px;
                cursor: pointer;
                z-index: 10;
            }
            
            .navbar-toggle span {
                display: block;
                width: 100%;
                height: 3px;
                background-color: #0B2452;
                margin-bottom: 5px;
                transition: all 0.3s ease;
            }
            
            .navbar-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 6px);
            }
            
            .navbar-toggle.active span:nth-child(2) {
                opacity: 0;
            }
            
            .navbar-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(5px, -6px);
            }
            
            /* Mobile menu styles */
            .main-menu {
                display: block;
                position: fixed;
                top: 0;
                right: -300px;
                width: 280px;
                height: 100vh;
                background-color: #fff;
                z-index: 999;
                padding: 60px 20px 20px;
                overflow-y: auto;
                transition: right 0.3s ease;
                box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            }
            
            .main-menu.active {
                right: 0;
            }
            
            .main-menu .navbar-nav {
                flex-direction: column;
                width: 100%;
            }
            
            .main-menu .nav-item {
                margin: 5px 0;
                width: 100%;
            }
            
            .main-menu .nav-link {
                padding: 10px 15px;
                display: block;
                width: 100%;
            }
            
            .main-menu .submenu ul {
                display: none;
                position: static;
                width: 100%;
                box-shadow: none;
                padding-left: 15px;
                background: transparent;
            }
            
            .main-menu .submenu.active ul {
                display: block;
            }
            
            /* Add overlay when mobile menu is active */
            .menu-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 998;
            }
            
            .menu-overlay.active {
                display: block;
            }
            
            /* Fix navbar brand (logo) position */
            .navbar-brand {
                z-index: 2;
                position: relative;
            }
        }
    `;
    
    document.head.appendChild(mobileStyles);
}

/**
 * Load the header HTML into the page
 */
function loadHeader() {
    // Target element where header should be inserted
    const headerContainer = document.getElementById('headerContainer') || document.body.firstChild;
    
    // Create header element
    const header = document.createElement('div');
    
    // Insert header HTML
    header.innerHTML = `
    <!-- Topbar Section Start -->
    <div class="topbar">
        <div class="container">
            <div class="row">
                <div class="col-12 topbar-contact-info">
                    <ul class="list-unstyled d-flex flex-wrap align-items-center justify-content-evenly mb-0 top">

                        <!-- Business Info -->
                        <li class="d-flex align-items-center gap-2 text-white fw--semibold" style="font-size: 12px;">
                            <i class="fa-solid fa-clock"></i>
                            <span><strong>Business Hours:</strong> 08:00 to 05:00 | Monday to Friday</span>
                        </li>

                        <li class="d-flex align-items-center gap-2 text-white fw--semibold" style="font-size: 12px;">
                            <i class="fa-solid fa-phone"></i>
                            <a href="tel:+17137027332" class="fw-bold text-decoration-none text-white">
                                <strong>Contact:</strong> +1&nbsp;713-702-7332
                            </a>
                        </li>

                        <li class="d-flex align-items-center gap-2 text-white fw--semibold" style="font-size: 12px;">
                            <i class="fa-solid fa-envelope"></i>
                            <a href="mailto:info@ombcs.com" class="text-decoration-none text-white">
                                <strong>Email:</strong> info@ombcs.com
                            </a>
                        </li>

                        <li class="d-flex align-items-center gap-2 text-white fw--semibold" style="font-size: 12px;">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>906 W. Medical Center Blvd, Webster TX 77598</span>
                        </li>

                        <!-- Social Media Icons Separate -->
                        <li class="d-flex align-items-center social-icons-wrapper">
                            <a href="https://www.instagram.com/omega_mbs/" target="_blank" class="social-icon">
                                <i class="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/omegamedicalbilling" target="_blank" class="social-icon">
                                <i class="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://www.linkedin.com/company/omega-medical-billing" target="_blank"
                                class="social-icon">
                                <i class="fa-brands fa-linkedin"></i>
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- Topbar Section End -->

    <!-- Header Start -->
    <header class="main-header position-sticky top-0 z-3 transition-navbar">
        <div class="header-sticky">
            <nav class="navbar navbar-expand-lg bg-white shadow-sm background-992-fff">
                <div class="container">
                    <a class="navbar-brand" href="index.html">
                        <img src="images/LOGO OMEGA-Redesign.png" alt="Logo" width="100" height="auto" loading="lazy">
                    </a>

                    <div class="collapse navbar-collapse main-menu">
                        <div class="nav-menu-wrapper">
                            <ul class="navbar-nav mr-auto" id="menu">
                                <li class="nav-item submenu"><a class="nav-link" href="index.html">Home</a>
                                    <!-- Comment out nested menu items if not needed -->
                                </li>
                                <li class="nav-item"><a class="nav-link" href="about-us.html">About Us</a>
                                </li>
                                <!-- SERVICES DROPDOWN MENU -->
                                <li class="nav-item submenu"><a class="nav-link" href="#">Services</a>
                                    <ul>
                                        <li class="nav-item"><a class="nav-link" href="medical-billing.html">Medical Billing</a></li>
                                        <li class="nav-item"><a class="nav-link" href="revenue-cycle-management.html">Revenue Cycle Management</a></li>
                                        <li class="nav-item"><a class="nav-link" href="medical-coding.html">Medical Coding</a></li>
                                        <li class="nav-item"><a class="nav-link" href="denial-management.html">Denial Management</a></li>
                                        <li class="nav-item"><a class="nav-link" href="provider-credentialing.html">Provider Credentialing</a></li>
                                        <li class="nav-item"><a class="nav-link" href="medical-billing-audit.html">Medical Billing Audit</a></li>
                                    </ul>
                                </li>
                                <!-- SPECIALTIES DROPDOWN MENU -->
                                <li class="nav-item submenu"><a class="nav-link" href="specialties.html">Specialties</a>
                                    <ul>
                                        <li class="nav-item"><a class="nav-link" href="cardiology.html">Cardiology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="radiology.html">Radiology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="urology.html">Urology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="oncology.html">Oncology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="primary-care.html">Primary Care</a></li>
                                        <li class="nav-item"><a class="nav-link" href="nephrology.html">Nephrology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="obgyn.html">OBGYN</a></li>
                                        <li class="nav-item"><a class="nav-link" href="dermatology.html">Dermatology</a></li>
                                        <li class="nav-item"><a class="nav-link" href="general-services.html">General Services</a></li>
                                        <li class="nav-item"><a class="nav-link" href="specialties.html">Explore All</a></li>
                                    </ul>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="statements.html">Statement</a>
                                </li>
                                <li class="nav-item"><a class="nav-link" href="blogs.html">Blogs</a></li>
                                <li class="nav-item"><a class="nav-link" href="contact-us.html">Contact Us</a></li>
                                <li class="nav-item"><a class="nav-link" href="careers.html">Careers</a></li>
                                <!-- Other commented out menu items -->
                            </ul>
                        </div>                    
                    </div>
                    <div class="navbar-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
            <div class="responsive-menu"></div>
            <div class="menu-overlay"></div>
        </div>
    </header>
    <!-- Header End -->
    
    <!-- Floating Social Icons -->
    <div class="Floating-social-icons">
        <a href="tel:+1713-702-7332" title="Call"><i class="fa-solid fa-phone"></i></a>
        <a href="sms:+1713-702-7332?body=Hello%20there!" title="SMS"><i class="fa-solid fa-message"></i></a>
        <a href="mailto:info@ombcs.com" title="Email"><i class="fas fa-envelope"></i></a>
    </div>
    `;
    
    // Insert header at the beginning of the body or in dedicated container
    if (headerContainer === document.body.firstChild) {
        document.body.insertBefore(header, document.body.firstChild);
    } else {
        headerContainer.appendChild(header);
    }
    
    // Initialize header functionality after inserting
    initHeaderFunctionality();
}

/**
 * Initialize header interactive functionality
 */
function initHeaderFunctionality() {
    // Initialize dropdown menus
    initDropdownMenus();
    
    // Initialize responsive menu toggle
    initResponsiveMenu();
    
    // Highlight active menu item based on current page
    highlightActiveMenuItem();
}

/**
 * Initialize dropdown menus
 */
function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-item.submenu');
    
    dropdownItems.forEach(item => {
        // Handle hover on larger screens
        if (window.innerWidth > 992) {
            item.addEventListener('mouseenter', function() {
                const dropdown = this.querySelector('ul');
                if (dropdown) {
                    dropdown.style.display = 'block';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const dropdown = this.querySelector('ul');
                if (dropdown) {
                    dropdown.style.display = '';
                }
            });
        }
        
        // Handle click on mobile
        const link = item.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    const parentItem = this.parentElement;
                    const dropdown = parentItem.querySelector('ul');
                    
                    // Close all other submenus first
                    const allSubmenus = document.querySelectorAll('.nav-item.submenu');
                    allSubmenus.forEach(submenu => {
                        if (submenu !== parentItem) {
                            submenu.classList.remove('active');
                            const siblingDropdown = submenu.querySelector('ul');
                            if (siblingDropdown) {
                                siblingDropdown.style.display = '';
                            }
                        }
                    });
                    
                    // Toggle current submenu
                    if (dropdown) {
                        parentItem.classList.toggle('active');
                        if (dropdown.style.display === 'block') {
                            dropdown.style.display = '';
                        } else {
                            dropdown.style.display = 'block';
                        }
                    }
                }
            });
        }
    });
}

/**
 * Initialize responsive menu toggle
 */
function initResponsiveMenu() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.main-menu');
    const responsiveMenu = document.querySelector('.responsive-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (navbarToggle && menu) {
        // Make sure the toggle is visible on mobile
        if (window.innerWidth <= 992) {
            navbarToggle.style.display = 'block';
        }
        
        // Handle toggle click
        navbarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            menu.classList.toggle('active');
            
            if (menuOverlay) {
                menuOverlay.classList.toggle('active');
            }
            
            if (responsiveMenu) {
                responsiveMenu.classList.toggle('active');
            }
            
            // Prevent body scrolling when menu is open
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        if (menuOverlay) {
            menuOverlay.addEventListener('click', function() {
                navbarToggle.classList.remove('active');
                menu.classList.remove('active');
                menuOverlay.classList.remove('active');
                if (responsiveMenu) responsiveMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            // Reset mobile menu when returning to desktop view
            if (navbarToggle) navbarToggle.classList.remove('active');
            if (menu) menu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            if (responsiveMenu) responsiveMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset dropdown display
            const dropdowns = document.querySelectorAll('.nav-item.submenu ul');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = '';
            });
        } else {
            // Ensure the navbar toggle is visible on mobile
            if (navbarToggle) navbarToggle.style.display = 'block';
        }
    });
    
    // Ensure close button is properly positioned in mobile menu
    const closeButton = document.createElement('div');
    closeButton.className = 'mobile-menu-close';
    closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    closeButton.style.cssText = 'position: absolute; top: 15px; right: 15px; font-size: 24px; cursor: pointer; z-index: 1000;';
    
    if (menu && !menu.querySelector('.mobile-menu-close')) {
        menu.appendChild(closeButton);
        
        closeButton.addEventListener('click', function() {
            navbarToggle.classList.remove('active');
            menu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            if (responsiveMenu) responsiveMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Highlight the active menu item based on current page
 */
function highlightActiveMenuItem() {
    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if link href matches current page
        if (href && (href === currentPage || (currentPage && href.split('.')[0] === currentPage.split('.')[0]))) {
            link.classList.add('active');
            
            // If link is in a dropdown, also highlight parent
            const parentLi = link.closest('.submenu');
            if (parentLi) {
                const parentLink = parentLi.querySelector(':scope > .nav-link');
                if (parentLink) {
                    parentLink.classList.add('active');
                }
            }
        }
    });
}