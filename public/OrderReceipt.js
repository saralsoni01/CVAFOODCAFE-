document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    if (orderId) {
        try {
            const response = await fetch(`/orderreceipt/${orderId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }
            const orderDetails = await response.json();
            displayReceipt(orderDetails);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    } else {
        console.error('Order ID not provided in URL');
    }
});

function displayReceipt(orderDetails) {
    const receiptDetails = document.getElementById('receipt-details');
    receiptDetails.innerHTML = `
        <p><strong>Your Order Has Been Received!!</strong></p>
        <p><strong>Order ID:</strong> ${orderDetails.id}</p>
        <p><strong>Items:</strong> ${orderDetails.items}</p>
        <p><strong>Status:</strong> ${orderDetails.status}</p>
        <p><strong>Amount Breakup:</strong> ${orderDetails.amountbreakup}</p>
        <p><strong>Total Amount:</strong> Rs. ${orderDetails.totalamount.toFixed(2)}</p>
        <p><strong>Name:</strong> ${orderDetails.name}</p>
        <p><strong>Address:</strong> ${orderDetails.address}</p>
        <p><strong>Phone:</strong> ${orderDetails.phone}</p>
    `;
}

document.getElementById('print-receipt-btn').addEventListener('click', function() {
    window.print();
});

document.getElementById('save-pdf-btn').addEventListener('click', function() {
    const doc = new jsPDF(); // Use directly without import
    const receiptDetails = document.getElementById('receipt-details').innerHTML;
    doc.text(receiptDetails, 10, 10);
    doc.save('order_receipt.pdf');
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
