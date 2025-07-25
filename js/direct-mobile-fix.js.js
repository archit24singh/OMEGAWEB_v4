/**
 * DIRECT FIX FOR MOBILE MENU
 * This code modifies the existing Bootstrap navbar to make it work on mobile
 */

(function() {
  // Execute immediately when the page loads
  window.addEventListener('DOMContentLoaded', function() {
    console.log("🔧 Mobile menu fix running");
    
    // 1. Add necessary Bootstrap components if missing
    injectBootstrapNavbarFix();
    
    // 2. Fix navbar toggle button
    const toggleBtn = document.querySelector('.navbar-toggle');
    if (toggleBtn) {
      // Clear any existing content and set proper classes
      toggleBtn.className = 'navbar-toggler';
      toggleBtn.setAttribute('type', 'button');
      toggleBtn.setAttribute('data-bs-toggle', 'collapse');
      toggleBtn.setAttribute('data-bs-target', '#navbarMenu');
      toggleBtn.setAttribute('aria-controls', 'navbarMenu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Toggle navigation');
      toggleBtn.innerHTML = '<span class="navbar-toggler-icon"></span>';
      console.log("✅ Added toggle button");
    } else {
      // Create toggle if missing
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        const newToggle = document.createElement('button');
        newToggle.className = 'navbar-toggler';
        newToggle.setAttribute('type', 'button');
        newToggle.setAttribute('data-bs-toggle', 'collapse');
        newToggle.setAttribute('data-bs-target', '#navbarMenu');
        newToggle.setAttribute('aria-controls', 'navbarMenu');
        newToggle.setAttribute('aria-expanded', 'false');
        newToggle.setAttribute('aria-label', 'Toggle navigation');
        newToggle.innerHTML = '<span class="navbar-toggler-icon"></span>';
        
        // Insert after brand
        const brand = navbar.querySelector('.navbar-brand');
        if (brand && brand.parentNode) {
          brand.parentNode.insertBefore(newToggle, brand.nextSibling);
          console.log("✅ Created new toggle button");
        }
      }
    }
    
    // 3. Fix main menu
    const mainMenu = document.querySelector('.main-menu');
    if (mainMenu) {
      // Set proper collapse classes
      mainMenu.classList.add('collapse');
      mainMenu.id = 'navbarMenu';
      console.log("✅ Fixed main menu container");
    }
    
    // 4. Apply critical mobile styles
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 991.98px) {
        .navbar-toggler {
          display: block !important;
          margin-left: auto;
        }
        .navbar-collapse {
          position: fixed;
          top: 0;
          right: 0;
          padding-top: 3.5rem;
          width: 80%;
          max-width: 300px;
          height: 100vh !important;
          background: white;
          z-index: 1000;
          overflow-y: auto;
          transition: transform 0.3s ease-in-out !important;
          transform: translateX(100%);
          box-shadow: -5px 0 15px rgba(0,0,0,0.1);
        }
        .navbar-collapse.show {
          transform: translateX(0) !important;
        }
        .navbar-nav {
          flex-direction: column !important;
        }
        
        /* Fix for dropdowns */
        .nav-item.submenu ul {
          position: static !important;
          width: 100% !important;
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding-left: 1rem !important;
        }
        
        /* Force show backdrop when menu is open */
        .modal-backdrop.show {
          opacity: 0.5;
          z-index: 999;
        }
      }
    `;
    document.head.appendChild(style);
    console.log("✅ Added critical mobile styles");
    
    // 5. Add backdrop for mobile menu
    function addBackdrop() {
      const toggler = document.querySelector('.navbar-toggler');
      if (toggler) {
        toggler.addEventListener('click', function() {
          const menu = document.getElementById('navbarMenu');
          if (menu) {
            if (menu.classList.contains('show')) {
              // Menu is open, add backdrop
              if (!document.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade show';
                document.body.appendChild(backdrop);
                
                // Add click handler to backdrop
                backdrop.addEventListener('click', function() {
                  const bsCollapse = new bootstrap.Collapse(menu);
                  bsCollapse.hide();
                  // Remove backdrop on close
                  setTimeout(function() {
                    if (backdrop.parentNode) {
                      backdrop.parentNode.removeChild(backdrop);
                    }
                  }, 300);
                });
              }
            } else {
              // Menu is closed, remove backdrop
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop && backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
              }
            }
          }
        });
      }
    }
    
    // Call after bootstrap is ready
    setTimeout(addBackdrop, 500);
    console.log("✅ Added backdrop functionality");
    
    // Fix dropdown menus on mobile
    const dropdownItems = document.querySelectorAll('.nav-item.submenu');
    dropdownItems.forEach(function(item) {
      const link = item.querySelector('.nav-link');
      const dropdown = item.querySelector('ul');
      
      if (link && dropdown) {
        // Add bootstrap dropdown classes
        link.setAttribute('data-bs-toggle', 'collapse');
        link.setAttribute('data-bs-target', '#' + generateUniqueId());
        link.setAttribute('aria-expanded', 'false');
        
        dropdown.id = link.getAttribute('data-bs-target').substring(1);
        dropdown.classList.add('collapse');
        
        // Handle clicks properly
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 992) {
            e.preventDefault();
          }
        });
      }
    });
    console.log("✅ Fixed dropdown menus");
    
    // Generate unique ID for dropdowns
    function generateUniqueId() {
      return 'dropdown-' + Math.random().toString(36).substring(2, 9);
    }
    
    // Inject Bootstrap navbar fix
    function injectBootstrapNavbarFix() {
      // Check if bootstrap JS is loaded
      if (typeof bootstrap === 'undefined' || !bootstrap.Collapse) {
        console.warn("⚠️ Bootstrap JS not detected - adding minimal collapse functionality");
        
        // Add minimal collapse implementation if bootstrap is not available
        window.bootstrap = window.bootstrap || {};
        window.bootstrap.Collapse = function(el) {
          this.element = typeof el === 'string' ? document.querySelector(el) : el;
          
          this.show = function() {
            if (this.element) {
              this.element.classList.add('show');
            }
          };
          
          this.hide = function() {
            if (this.element) {
              this.element.classList.remove('show');
            }
          };
          
          this.toggle = function() {
            if (this.element) {
              this.element.classList.toggle('show');
            }
          };
        };
        
        // Add basic click handlers for data-bs-toggle elements
        document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(function(el) {
          el.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSelector = el.getAttribute('data-bs-target');
            if (targetSelector) {
              const target = document.querySelector(targetSelector);
              if (target) {
                target.classList.toggle('show');
                const isExpanded = target.classList.contains('show');
                el.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
              }
            }
          });
        });
      }
    }
  });
})();