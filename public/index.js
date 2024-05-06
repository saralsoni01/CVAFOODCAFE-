console.log('Fetching menu items...');

fetch('/menu')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(menuItems => {
        console.log('Menu items fetched successfully:', menuItems);

        const menuList = document.getElementById('menu-list');

        menuItems.forEach(item => {
            const menuItem = document.createElement('li');
            menuItem.innerHTML = `
                <strong>${item.name}</strong> - Rs. ${item.price}<br>
                ${item.description}
            `;
            menuList.appendChild(menuItem);
        });
    })
    .catch(error => {
        console.error('Error fetching menu items:', error);
    });

// Log cookies
console.log('Cookies:', document.cookie);

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
