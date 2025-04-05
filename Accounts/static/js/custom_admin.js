// Add bulk payment link to the navigation bar
document.addEventListener('DOMContentLoaded', function() {
    // Find the navigation bar
    const navbar = document.querySelector('.navbar-nav');
    
    if (navbar) {
        // Look for the vendor summary link to insert after
        let vendorSummaryLink = null;
        let customerSummaryLink = null;
        
        const navLinks = navbar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.href.includes('vendor-summary')) {
                vendorSummaryLink = link.parentElement;
            } else if (link.href.includes('customer-summary')) {
                customerSummaryLink = link.parentElement;
            }
        });
        
        // Create the new bulk payment link
        const bulkPaymentItem = document.createElement('li');
        bulkPaymentItem.className = 'nav-item';
        
        const bulkPaymentLink = document.createElement('a');
        bulkPaymentLink.className = 'nav-link';
        bulkPaymentLink.href = '/accounts/vendor-bulk-payment/';
        bulkPaymentLink.textContent = 'Bulk Payment';
        
        bulkPaymentItem.appendChild(bulkPaymentLink);
        
        // Insert after vendor summary link if found, otherwise append to navbar
        if (vendorSummaryLink) {
            navbar.insertBefore(bulkPaymentItem, customerSummaryLink);
        } else {
            navbar.appendChild(bulkPaymentItem);
        }
    }
}); 