/**
 * Savings Calculator Implementation for Omega Medical Billing
 * 
 * A bulletproof implementation with no overlay issues
 */

// Add Bootstrap CSS if not already included
if (!document.querySelector('link[href*="bootstrap"]')) {
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);
  }
  
  // Add Bootstrap Icons CSS
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const bootstrapIconsCSS = document.createElement('link');
    bootstrapIconsCSS.rel = 'stylesheet';
    bootstrapIconsCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css';
    document.head.appendChild(bootstrapIconsCSS);
  }
  
  // Add the calculator popup styling
  const style = document.createElement('style');
  style.setAttribute('data-style', 'corner-popup');
  style.textContent = `
    .corner-popup {
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 220px;
      border-radius: 8px;
      overflow: hidden;
      z-index: 1050;
      animation: slideInUp 0.5s ease forwards;
      opacity: 0;
      transform: translateY(20px);
      background-color:rgb(30, 87, 194);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    @keyframes slideInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .corner-popup-header {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    
    .corner-popup-body {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    
    /* Mobile responsiveness improvements */
    @media (max-width: 576px) {
      .corner-popup {
        width: 180px;
        left: 10px;
        bottom: 80px; /* Move higher to avoid overlapping with other elements */
      }
      
      .corner-popup-header h6 {
        font-size: 0.9rem;
      }
      
      .corner-popup-body p {
        font-size: 0.8rem;
      }
      
      .corner-popup-body .btn {
        font-size: 0.8rem;
        padding: 0.25rem 0.5rem;
      }
    }
    
    /* Ensure visibility on small screens */
    @media (max-width: 360px) {
      .corner-popup {
        width: 160px;
        bottom: 85px;
      }
      
      .corner-popup-header {
        padding: 0.35rem 0.5rem !important;
      }
      
      .corner-popup-header h6 {
        font-size: 0.8rem;
      }
      
      .corner-popup-body {
        padding: 0.5rem 0.75rem !important;
      }
    }
    
    /* Handle landscape orientation on mobile */
    @media (max-height: 500px) and (orientation: landscape) {
      .corner-popup {
        bottom: 10px;
        left: 10px;
      }
    }
    
    /* Ensure we don't conflict with the chat popup on small screens */
    @media (max-width: 480px) {
      .corner-popup.chat-active {
        transform: translateX(-200px);
        transition: transform 0.3s ease;
      }
    }
    
    /* Custom modal styles to ensure proper functioning */
    body.modal-open {
      overflow: hidden;
      padding-right: 0 !important;
    }
    
    .modal-backdrop {
      opacity: 0.5;
    }
    
    /* Force remove modal backdrop when hiding */
    .modal-backdrop.force-remove {
      display: none !important;
      opacity: 0 !important;
    }
  `;
  
  document.head.appendChild(style);
  
  /**
   * The ultimate modal cleanup function
   * Uses multiple techniques to ensure the overlay is completely removed
   */
  function forceCleanupModalEffects() {
    // 1. Remove all modal backdrops
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.classList.add('force-remove');
      backdrop.parentNode.removeChild(backdrop);
    });
    
    // 2. Clear modal open classes and inline styles from body
    document.body.className = document.body.className.replace(/\bmodal-open\b/, '');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // 3. Additional cleanup for any stray modal elements
    const modalElements = document.querySelectorAll('.modal.show');
    modalElements.forEach(modal => {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    });
    
    // 4. Force scrollbars back
    window.scrollTo(window.scrollX, window.scrollY);
    
    // 5. Reset any fixed positioning that may have been applied
    document.querySelectorAll('.fixed-top, .fixed-bottom, .is-fixed, .sticky-top').forEach(el => {
      el.style.paddingRight = '';
    });
  }
  
  // Create and add the corner popup
  function initCornerPopupCalculator() {
    // Create the corner popup element
    const popupElement = document.createElement('div');
    popupElement.className = 'corner-popup shadow';
    popupElement.id = 'cornerCalculatorPopup';
    
    popupElement.innerHTML = `
  <div class="corner-popup-header bg-primary text-white d-flex justify-content-between align-items-center p-2">
    <h6 class="mb-0" style="color: white !important;"><i class="bi bi-calculator me-2"></i>Savings Calculator</h6>
    <button type="button" class="btn-close btn-close-white btn-sm" id="closeCornerPopupBtn" aria-label="Close"></button>
  </div>
  <div class="corner-popup-body p-3 bg-white">
    <p class="mb-2 small">How much could you save?</p>
    <button type="button" class="btn btn-primary btn-sm w-100" id="openCalculatorFromCornerBtn">
      Calculate Now
    </button>
  </div>
`;
    
    // Remove any existing popup first
    const existingPopup = document.getElementById('cornerCalculatorPopup');
    if (existingPopup) {
      existingPopup.remove();
    }
    
    // Add to document
    document.body.appendChild(popupElement);
    
    // Add the calculator modal (using direct HTML instead of dynamic creation for better control)
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="calculatorModal" tabindex="-1" aria-labelledby="calculatorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header" style="background-color:rgb(30, 87, 194);; color: white;">
              <h5 class="modal-title" id="calculatorModalLabel">Medical Billing Savings Calculator</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" id="calculatorCloseBtn"></button>
            </div>
            <div class="modal-body">
              <div id="formErrorMessage" class="alert alert-danger d-none mb-3">
                Please fill out all fields to calculate your savings.
              </div>
              <form id="calculatorForm">
                <div class="mb-3">
                  <label for="monthlyRevenue" class="form-label">Monthly Revenue ($)</label>
                  <input type="number" class="form-control" id="monthlyRevenue" min="0" placeholder="e.g. 50000" required>
                </div>
                <div class="mb-3">
                  <label for="denialRate" class="form-label">Current Denial Rate (%)</label>
                  <input type="number" class="form-control" id="denialRate" min="0" max="100" placeholder="e.g. 15" required>
                </div>
                <div class="mb-3">
                  <label for="collectionRate" class="form-label">Current Collection Rate (%)</label>
                  <input type="number" class="form-control" id="collectionRate" min="0" max="100" placeholder="e.g. 85" required>
                </div>
                <div class="mb-3">
                  <label for="daysInAR" class="form-label">Average Days in AR</label>
                  <input type="number" class="form-control" id="daysInAR" min="0" placeholder="e.g. 50" required>
                </div>
                <div class="mb-3">
                  <label for="specialty" class="form-label">Medical Specialty</label>
                  <select class="form-select" id="specialty" required>
                    <option value="">Select a specialty</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="familyPractice">Family Practice</option>
                    <option value="internal">Internal Medicine</option>
                    <option value="neurology">Neurology</option>
                    <option value="obgyn">OB/GYN</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="psychiatry">Psychiatry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary" id="calculatorCancelBtn">Close</button>
              <button type="button" class="btn btn-primary" id="calculateBtn" style="background-color:rgb(30, 87, 194);">Calculate Savings</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal fade" id="resultsModal" tabindex="-1" aria-labelledby="resultsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="resultsModalLabel">Your Estimated Savings</h5>
              <button type="button" class="btn-close btn-close-white" id="resultsCloseBtn" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="text-center mb-4">
                <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
                <h4>We can help you save approximately:</h4>
                <h2 class="text-success mb-0" id="yearlySavings">$0</h2>
                <p class="text-muted">per year</p>
              </div>
              
              <div class="row text-center">
                <div class="col-6 mb-3">
                  <div class="border rounded p-3">
                    <h6 class="text-muted mb-1">Revenue Increase</h6>
                    <h4 id="revenueIncrease">$0</h4>
                  </div>
                </div>
                <div class="col-6 mb-3">
                  <div class="border rounded p-3">
                    <h6 class="text-muted mb-1">Denial Reduction</h6>
                    <h4 id="denialReduction">0%</h4>
                  </div>
                </div>
                <div class="col-6">
                  <div class="border rounded p-3">
                    <h6 class="text-muted mb-1">Collection Improvement</h6>
                    <h4 id="collectionImprovement">0%</h4>
                  </div>
                </div>
                <div class="col-6">
                  <div class="border rounded p-3">
                    <h6 class="text-muted mb-1">Days in AR Reduction</h6>
                    <h4 id="arReduction">0</h4>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" id="resultsCloseModalBtn">Close</button>
              <a href="contact-us.html" class="btn btn-success" id="getStartedBtn">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    `);
    
    // Show popup quickly (within 1 second)
    setTimeout(() => {
      // Show the popup
      const popup = document.getElementById('cornerCalculatorPopup');
      if (popup) {
        popup.style.display = 'block';
      }
      
      // Setup event listeners
      const closeBtn = document.getElementById('closeCornerPopupBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          if (popup) {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              popup.style.display = 'none';
            }, 300);
          }
          
          return false;
        });
      }
      
      const openCalculatorBtn = document.getElementById('openCalculatorFromCornerBtn');
      if (openCalculatorBtn) {
        openCalculatorBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          
          if (popup) {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              popup.style.display = 'none';
              
              // Manually show calculator modal - this gives us more control
              const calculatorModal = document.getElementById('calculatorModal');
              if (calculatorModal) {
                // Show the modal with direct DOM manipulation
                calculatorModal.classList.add('show');
                calculatorModal.style.display = 'block';
                calculatorModal.removeAttribute('aria-hidden');
                calculatorModal.setAttribute('aria-modal', 'true');
                calculatorModal.setAttribute('role', 'dialog');
                
                // Create backdrop manually
                const backdropDiv = document.createElement('div');
                backdropDiv.className = 'modal-backdrop fade show';
                document.body.appendChild(backdropDiv);
                
                // Add modal-open to body
                document.body.classList.add('modal-open');
              }
            }, 300);
          }
          
          return false;
        });
      }
      
      // Calculator modal close button
      const calculatorCloseBtn = document.getElementById('calculatorCloseBtn');
      if (calculatorCloseBtn) {
        calculatorCloseBtn.addEventListener('click', (event) => {
          event.preventDefault();
          closeCurrentModal('calculatorModal');
        });
      }
      
      // Calculator modal cancel button
      const calculatorCancelBtn = document.getElementById('calculatorCancelBtn');
      if (calculatorCancelBtn) {
        calculatorCancelBtn.addEventListener('click', (event) => {
          event.preventDefault();
          closeCurrentModal('calculatorModal');
        });
      }
      
      // Results modal close button (x in corner)
      const resultsCloseBtn = document.getElementById('resultsCloseBtn');
      if (resultsCloseBtn) {
        resultsCloseBtn.addEventListener('click', (event) => {
          event.preventDefault();
          closeCurrentModal('resultsModal');
        });
      }
      
      // Results modal close button (in footer)
      const resultsCloseModalBtn = document.getElementById('resultsCloseModalBtn');
      if (resultsCloseModalBtn) {
        resultsCloseModalBtn.addEventListener('click', (event) => {
          event.preventDefault();
          closeCurrentModal('resultsModal');
        });
      }
      
      // Calculate button
      const calculateBtn = document.getElementById('calculateBtn');
      if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
          if (validateForm()) {
            calculateSavings();
          }
        });
      }
      
      // Handle chat popup interaction
      const chatBtn = document.getElementById('chatbot-toggle');
      if (chatBtn && popup) {
        chatBtn.addEventListener('click', () => {
          const chatPopup = document.getElementById('chat-popup');
          const iframe = document.getElementById('chatbot-iframe');
          
          if ((chatPopup && chatPopup.classList.contains('show')) || 
              (iframe && iframe.style.display === 'block')) {
            popup.classList.add('chat-active');
          } else {
            popup.classList.remove('chat-active');
          }
        });
      }
      
      // Check for viewport width changes
      window.addEventListener('resize', () => {
        if (popup && window.innerWidth <= 480) {
          const chatPopup = document.getElementById('chat-popup');
          const iframe = document.getElementById('chatbot-iframe');
          
          if ((chatPopup && chatPopup.classList.contains('show')) || 
              (iframe && iframe.style.display === 'block')) {
            popup.classList.add('chat-active');
          }
        } else if (popup) {
          popup.classList.remove('chat-active');
        }
      });
    }, 1000); // Show after 1 second
  }
  
  /**
   * Close the current modal properly with direct DOM manipulation
   */
  function closeCurrentModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Hide the modal
    modal.classList.remove('show');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    
    // Do the complete cleanup
    forceCleanupModalEffects();
  }
  
  // Form validation function
  function validateForm() {
    const monthlyRevenue = document.getElementById('monthlyRevenue').value;
    const denialRate = document.getElementById('denialRate').value;
    const collectionRate = document.getElementById('collectionRate').value;
    const daysInAR = document.getElementById('daysInAR').value;
    const specialty = document.getElementById('specialty').value;
    const errorMessage = document.getElementById('formErrorMessage');
    
    if (!monthlyRevenue || !denialRate || !collectionRate || !daysInAR || !specialty) {
      if (errorMessage) {
        errorMessage.classList.remove('d-none');
      }
      return false;
    }
    
    if (errorMessage) {
      errorMessage.classList.add('d-none');
    }
    return true;
  }
  
  // Calculate savings logic
  function calculateSavings() {
    // Get form values
    const monthlyRevenue = parseFloat(document.getElementById('monthlyRevenue').value) || 0;
    const denialRate = parseFloat(document.getElementById('denialRate').value) || 0;
    const collectionRate = parseFloat(document.getElementById('collectionRate').value) || 0;
    const daysInAR = parseFloat(document.getElementById('daysInAR').value) || 0;
    const specialty = document.getElementById('specialty').value;
    
    // Calculate estimates
    const yearlyRevenue = monthlyRevenue * 12;
    
    // Apply improvement factors (these would typically vary by specialty)
    let revenueFactor = 0.2; // 20% revenue increase
    let denialFactor = 0.5; // 50% reduction in denials
    let collectionFactor = 0.1; // 10% improvement in collections
    let arReductionDays = 20; // 20 days reduction in AR
    
    // Adjust factors based on specialty
    switch (specialty) {
      case 'cardiology':
        revenueFactor = 0.22;
        denialFactor = 0.55;
        break;
      case 'dermatology':
        revenueFactor = 0.18;
        denialFactor = 0.45;
        break;
      case 'orthopedics':
        revenueFactor = 0.25;
        denialFactor = 0.6;
        break;
      // Other specialties could have custom factors
    }
    
    // Calculate savings
    const revenueIncrease = yearlyRevenue * revenueFactor;
    const denialReduction = denialRate * denialFactor;
    const newCollectionRate = Math.min(100, collectionRate + (collectionRate * collectionFactor));
    const collectionImprovement = newCollectionRate - collectionRate;
    
    // Total yearly savings
    const denialSavings = yearlyRevenue * (denialRate / 100) * denialFactor;
    const collectionSavings = yearlyRevenue * (collectionImprovement / 100);
    const arSavings = (yearlyRevenue / 365) * arReductionDays * 0.05; // Simplified AR impact calculation
    const totalSavings = revenueIncrease + denialSavings + collectionSavings + arSavings;
    
    // Update results
    document.getElementById('yearlySavings').textContent = formatCurrency(totalSavings);
    document.getElementById('revenueIncrease').textContent = formatCurrency(revenueIncrease);
    document.getElementById('denialReduction').textContent = denialReduction.toFixed(1) + '%';
    document.getElementById('collectionImprovement').textContent = collectionImprovement.toFixed(1) + '%';
    document.getElementById('arReduction').textContent = arReductionDays.toString();
    
    // Close calculator modal first
    closeCurrentModal('calculatorModal');
    
    // Then show results modal with direct DOM manipulation
    setTimeout(() => {
      const resultsModal = document.getElementById('resultsModal');
      if (resultsModal) {
        // Show the modal
        resultsModal.classList.add('show');
        resultsModal.style.display = 'block';
        resultsModal.removeAttribute('aria-hidden');
        resultsModal.setAttribute('aria-modal', 'true');
        resultsModal.setAttribute('role', 'dialog');
        
        // Create backdrop
        const backdropDiv = document.createElement('div');
        backdropDiv.className = 'modal-backdrop fade show';
        document.body.appendChild(backdropDiv);
        
        // Add modal-open to body
        document.body.classList.add('modal-open');
      }
    }, 300);
  }
  
  function formatCurrency(value) {
    return '$' + value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // Load Bootstrap JS if not already loaded
  if (typeof bootstrap === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
    script.onload = function() {
      // Initialize the corner popup when Bootstrap is loaded
      initCornerPopupCalculator();
    };
    document.body.appendChild(script);
  } else {
    // Initialize the corner popup immediately if Bootstrap is already loaded
    initCornerPopupCalculator();
  }
  
  // Initialize when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the corner popup
    if (typeof bootstrap !== 'undefined') {
      initCornerPopupCalculator();
    }
    
    // Handle ESC key to properly close any open modal
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        const openCalculatorModal = document.getElementById('calculatorModal');
        if (openCalculatorModal && openCalculatorModal.classList.contains('show')) {
          closeCurrentModal('calculatorModal');
        }
        
        const openResultsModal = document.getElementById('resultsModal');
        if (openResultsModal && openResultsModal.classList.contains('show')) {
          closeCurrentModal('resultsModal');
        }
      }
    });
    
    // Handle clicks outside modal to close it
    document.addEventListener('click', function(event) {
      const calculatorModal = document.getElementById('calculatorModal');
      const resultsModal = document.getElementById('resultsModal');
      
      if (calculatorModal && calculatorModal.classList.contains('show')) {
        if (event.target === calculatorModal) {
          closeCurrentModal('calculatorModal');
        }
      }
      
      if (resultsModal && resultsModal.classList.contains('show')) {
        if (event.target === resultsModal) {
          closeCurrentModal('resultsModal');
        }
      }
    });
  });