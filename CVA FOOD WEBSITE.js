document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    console.log('Login Attempt:', username, password);
    
    // Add logic to verify the user. In a real-world scenario, this would be a server-side check.
    alert('Login successful! Redirecting...');
    // Redirect to home or dashboard page.
    window.location.href = 'index.html';
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    
    // Retrieve the values entered by the user for username and password
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    // Log the login attempt to the console
    console.log('Login Attempt:', username, password);
    
    // Simulate authentication check (replace with actual authentication logic)
    var isAuthenticated = authenticateUser(username, password);
    
    if (isAuthenticated) {
        // Display an alert indicating that the login was successful
        alert('Login successful! Redirecting...');
        
        // Redirect the user to the home or dashboard page
        window.location.href = 'index.html';
    } else {
        // Display an error message or redirect to a page for password reset
        alert('Incorrect username or password. Please try again or click on "Forgot Password" to reset your password.');
    }
});

// Function to simulate user authentication (replace with actual authentication logic)
function authenticateUser(username, password) {
    // Simulate authentication check
    // This function should be replaced with actual server-side authentication logic
    // For demonstration purposes, simply return true if username and password are not empty
    return username !== '' && password !== '';
}

// Function to handle "Forgot Password" functionality
function forgotPassword() {
    // Add logic here to handle "Forgot Password" functionality
    // For example, display a modal with a form to reset the password
    alert('Redirecting to password reset page...');
    // Redirect the user to the password reset page
    window.location.href = 'forgot-password.html';
}
