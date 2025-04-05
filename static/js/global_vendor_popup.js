// Global function for opening the vendor popup
window.openVendorPopup = function(url, name) {
    console.log("Global openVendorPopup called with", url, name);
    
    // Make sure the URL starts with a slash
    if (!url.startsWith('/')) {
        url = '/' + url;
    }
    
    // Check if this is a relative URL that needs the accounts prefix
    if (!url.startsWith('/accounts/')) {
        // If it's just /add-vendor/, prepend /accounts
        if (url === '/add-vendor/' || url === 'add-vendor/') {
            url = '/accounts/add-vendor/';
        }
    }
    
    console.log("Using URL:", url);
    
    var width = 800;
    var height = 600;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height) / 2;
    
    var features = [
        'width=' + width,
        'height=' + height,
        'top=' + top,
        'left=' + left,
        'resizable=yes',
        'scrollbars=yes',
        'status=yes'
    ].join(',');
    
    console.log("Opening popup with features:", features);
    var win = window.open(url, name, features);
    win.focus();
    return false;
};

// Global function for handling the popup response
window.dismissAddRelatedObjectPopup = function(win, objId, objName) {
    console.log("Global dismissAddRelatedObjectPopup called with", objId, objName);
    
    // Get the vendor select element in the parent window
    var vendorSelect = window.opener.document.getElementById('id_vendor');
    console.log("Found vendor select:", vendorSelect);
    
    if (vendorSelect) {
        // Create a new option element with the new vendor
        var option = new Option(objName, objId);
        option.selected = true;
        
        // Add the option to the select element
        vendorSelect.appendChild(option);
        
        // Trigger the change event (important for any dependent fields)
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            vendorSelect.dispatchEvent(evt);
        } else {
            vendorSelect.fireEvent("onchange");
        }
    }
    
    // Close the popup window
    win.close();
}; 