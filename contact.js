document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const contactForm = document.getElementById('contact-form');
    
    // Initialize the contact page
    initContactPage();
    
    function initContactPage() {
        // Add event listener to the contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactSubmission);
        }
        
        // Check if user is logged in
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            // Pre-fill the form if user is logged in
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (nameInput && userData.firstName) {
                nameInput.value = userData.firstName;
            }
            
            if (emailInput && userData.email) {
                emailInput.value = userData.email;
            }
        }
    }
    
    function handleContactSubmission(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // You would normally send this data to a server
        // For now, we'll just show a notification
        
        // Create message object
        const contactMessage = {
            name,
            email,
            subject,
            message,
            date: new Date().toISOString()
        };
        
        // Save to localStorage (just for demonstration)
        saveContactMessage(contactMessage);
        
        // Show success notification
        showNotification('Takk for din henvendelse! Vi vil svare så snart som mulig.');
        
        // Reset form
        contactForm.reset();
    }
    
    function saveContactMessage(message) {
        // Get existing messages or initialize empty array
        let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        
        // Add new message
        messages.push(message);
        
        // Save back to localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    }
});
