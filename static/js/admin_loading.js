/**
 * This script adds loading indicators for admin navigation links 
 * to improve the user experience during page transitions
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create the loading overlay element
    const overlay = document.createElement('div');
    overlay.id = 'admin-loading-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.3s linear;
    `;
    
    // Create the spinner element
    const spinner = document.createElement('div');
    spinner.className = 'admin-loader';
    spinner.style.cssText = `
        border: 5px solid #f3f3f3;
        border-radius: 50%;
        border-top: 5px solid #417690;
        width: 50px;
        height: 50px;
        animation: admin-spin 1s linear infinite;
    `;
    
    // Add the spinner animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes admin-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Add the spinner to the overlay
    overlay.appendChild(spinner);
    
    // Add the overlay to the body
    document.body.appendChild(overlay);
    
    // Function to show the loading overlay
    function showAdminLoading() {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
    }
    
    // Add click event listeners to all navigation links
    const navLinks = document.querySelectorAll('.horizontal-menu .nav-link, .sidebar-menu .nav-link, .nav-item a');
    navLinks.forEach(link => {
        // Skip links with # as href (dropdown toggles)
        if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
            link.addEventListener('click', function(e) {
                // Only show loading for summaries and other custom pages
                if (this.href.includes('summary') || 
                    this.href.includes('dashboard') || 
                    !this.href.includes('#')) {
                    showAdminLoading();
                }
            });
        }
    });
}); 