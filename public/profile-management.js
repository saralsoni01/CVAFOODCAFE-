document.addEventListener('DOMContentLoaded', function () {
    async function checkCookies() {
        const cookies = document.cookie;
        if (!cookies.includes('sessionID')) {
            // Cookies are not present, display message
            document.getElementById('profileFormContainer').innerHTML = '<p>Please login to check and edit your profile.</p>';
            return false;
        }
        return true;
    }

    async function fetchUserData() {
        try {
            const response = await fetch('/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin' // Include cookies in the request
            });
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }

    function populateForm(userData) {
        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('email').value = userData.email;
        document.getElementById('phone').value = userData.phone;
        document.getElementById('enabled').checked = userData.enabled === 1;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const updatedProfile = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            enabled: document.getElementById('enabled').checked ? 1 : 0
            // Add more fields as needed
        };

        try {
            const response = await fetch('/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile),
                credentials: 'same-origin' // Include cookies in the request
            });
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }
            const result = await response.json();
            console.log('Profile updated successfully:', result.message);
            window.location.href = 'index.html';
            // Display success message to the user
        } catch (error) {
            console.error('Error updating profile:', error);
            // Display error message to the user
        }
    }

    async function initializeProfileManagement() {
        try {
            if (await checkCookies()) {
                const userData = await fetchUserData();
                populateForm(userData);
                document.getElementById('profileForm').addEventListener('submit', handleSubmit);
            }
        } catch (error) {
            // Handle errors gracefully
            console.error('An error occurred:', error);
        }
    }

    initializeProfileManagement();
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
