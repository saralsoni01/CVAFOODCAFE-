// Function to fetch orders from server
async function fetchOrders() {
    try {
        const response = await fetch('/orders');
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Function to display orders
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear the list first
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        let backgroundColor = '';
        switch (order.status) {
            case 'completed':
                backgroundColor = 'lightgreen';
                break;
            case 'ready':
                backgroundColor = 'lightyellow';
                break;
            case 'preparing':
                backgroundColor = 'lightpink';
                break;
            default:
                backgroundColor = 'white'; // Default background color
        }
        orderElement.innerHTML = `
            <p style="background-color: ${backgroundColor};"><strong>Order #${order.id}: ${order.items} - Status: ${order.status}</strong></p>
            <button onclick="updateOrderStatus(${order.id}, 'preparing')">Mark as Preparing</button>
            <button onclick="updateOrderStatus(${order.id}, 'ready')">Mark as Ready</button>
            <button onclick="updateOrderStatus(${order.id}, 'completed')">Mark as Completed</button>
        `;
        ordersList.appendChild(orderElement);
    });
}


// Function to update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        const result = await response.json();
        console.log('Order status updated successfully:', result.message);
        // Refresh orders after updating status
        const orders = await fetchOrders();
        displayOrders(orders);
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}

// Initialize order display
async function initializeOrderManagement() {
    const orders = await fetchOrders();
    displayOrders(orders);
}

initializeOrderManagement();

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
