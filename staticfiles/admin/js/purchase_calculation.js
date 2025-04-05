(function($) {
    $(document).ready(function() {
        // Function to initialize calculation events for purchase product rows
        function initPurchaseProductRows() {
            // Target all product rows in the purchase invoice admin
            $('.field-quantity input, .field-price input, .field-damage input, .field-discount input, .field-rotten input')
                .on('change keyup', function() {
                    // When any input changes, mark the form as modified so Django knows to save it
                    $(this).closest('form').find('input[type="submit"]').removeClass('default').addClass('default');
                    // Add animation to signal that calculation is happening
                    $(this).parents('tr').addClass('row-highlight');
                    setTimeout(function() {
                        $('.row-highlight').removeClass('row-highlight');
                    }, 500);
                });
        }

        // Function to handle reload after save
        function handleReload() {
            // If we're on the change form page and there was a POST
            if (window.location.href.indexOf('/change/') > -1 && document.referrer === window.location.href) {
                // Refresh the page to show updated calculations
                setTimeout(function() {
                    window.location.reload();
                }, 100);
            }
        }

        // Initialize on page load
        initPurchaseProductRows();
        handleReload();

        // Also initialize when new inline forms are added dynamically
        $(document).on('formset:added', function(event, $row, formsetName) {
            if (formsetName.indexOf('purchaseproduct') > -1) {
                initPurchaseProductRows();
            }
        });
    });
})(django.jQuery); 