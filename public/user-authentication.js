document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('registerpassword').value; // Corrected password field id
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const enabled = document.getElementById('enabled').checked ? 1 : 0;
    
    console.log('Registering user:', { firstName, lastName, username, password, email, phone, enabled });
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, username, password, email, phone, enabled })
        });
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        const result = await response.json();
        console.log('User registered successfully:', result.message);
        // Redirect to home or dashboard page after successful registration
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error registering user:', error);
    }
});

document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('loginusername').value;
    const password = document.getElementById('loginpassword').value; // Corrected password field id
    
    console.log('Logging in user:', { username, password });
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        const result = await response.json();
        console.log('User logged in successfully:', result.message);
        // Redirect to home or dashboard page after successful login
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error logging in user:', error);
    }
});

// Function to handle sign out
async function signOut() {
    try {
        const response = await fetch('/signout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin' // Include cookies in the request
        });
        if (!response.ok) {
            throw new Error('Failed to sign out');
        }
        const result = await response.json();
        console.log('Sign out successful:', result.message);
        // Redirect to the login page after successful sign out
        window.location.href = 'user-authentication.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Function to check if the session ID cookie exists
function checkSessionCookie() {
    // Split the cookies string into individual cookies
    const cookies = document.cookie.split(';');
    
    // Iterate through the cookies to find the session ID cookie
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name.trim() === 'sessionID') {
            // Session ID cookie found
            return true;
        }
    }
    
    // Session ID cookie not found
    return false;
}

// Function to toggle visibility of My Profile and Sign Out based on session cookie
function toggleLoginOptions() {
    const profileLink = document.querySelector('.Login-container ul li:first-child');
    const signOutLink = document.querySelector('.Login-container ul li:last-child');
    const hasSessionCookie = checkSessionCookie();
    
    // Toggle visibility based on session cookie
    profileLink.style.display = hasSessionCookie ? 'block' : 'none';
    signOutLink.style.display = hasSessionCookie ? 'block' : 'none';
}

// Call the function initially to set initial visibility
toggleLoginOptions();

// Add event listener to the Sign Out button
document.querySelector('.Login-container ul li:last-child a').addEventListener('click', signOut);
