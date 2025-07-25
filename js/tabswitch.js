// Service Tabs Animation, Navigation and Sliding Indicator
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const tabsContainer = document.querySelector('.service-tabs');
    const tabBtns = document.querySelectorAll('.service-tabs .nav-link');
    const indicator = document.querySelector('.tab-indicator');
    
    // Function to position the indicator
    function positionIndicator(activeTab) {
        if (!indicator || !activeTab) return;
        
        // Get the active tab's position and width
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        // Set the indicator position and width
        indicator.style.width = `${tabRect.width}px`;
        indicator.style.left = `${tabRect.left - containerRect.left}px`;
    }
    
    // Init position for the active tab
    function initIndicator() {
        const activeTab = document.querySelector('.service-tabs .nav-link.active');
        if (activeTab) {
            positionIndicator(activeTab);
        }
    }
    
    // Initialize the indicator
    if (indicator && tabsContainer) {
        // Initial position
        setTimeout(initIndicator, 100); // Small delay to ensure layout is complete
        
        // Update on tab click
        tabBtns.forEach(btn => {
            btn.addEventListener('shown.bs.tab', function() {
                positionIndicator(this);
            });
        });
        
        // Update on window resize
        window.addEventListener('resize', function() {
            const activeTab = document.querySelector('.service-tabs .nav-link.active');
            positionIndicator(activeTab);
        });
    }
    
    // Existing tab animation code
    const tabEls = document.querySelectorAll('button[data-bs-toggle="tab"]');
    
    tabEls.forEach(tabEl => {
        tabEl.addEventListener('shown.bs.tab', function(event) {
            const targetPane = document.querySelector(this.getAttribute('data-bs-target'));
            // Add animation when tab is shown
            if (targetPane) {
                targetPane.style.opacity = 0;
                setTimeout(() => {
                    targetPane.style.opacity = 1;
                }, 50);
            }
        });
    });
});