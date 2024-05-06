document.addEventListener('DOMContentLoaded', function () {
    let menuItems = []; // Array to store menu items data
    const menuItemsContainer = document.getElementById('menu-items');
    const orderSummary = document.getElementById('order-summary');
    const totalItemsDisplay = document.getElementById('total-items');
    const totalPriceDisplay = document.getElementById('total-price');
    const orderFoodBtn = document.getElementById('order-food-btn');

    async function fetchMenuItems() {
        try {
            const response = await fetch('/menu');
            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }
            menuItems = await response.json(); // Assign the fetched menu items to menuItems
            displayMenuItems();
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    }
    

    // Function to display menu items
    function displayMenuItems() {
        menuItemsContainer.innerHTML = ''; // Clear the container first

        menuItems.forEach(item => {
            const menuItemElement = document.createElement('div');
            menuItemElement.classList.add('menu-item');
            menuItemElement.innerHTML = `
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: Rs. ${item.price}</p>
                </div>
                <div>
                    <button class="quantity-btn" data-id="${item.id}" data-price="${item.price}">-</button>
                    <span class="quantity"><strong>0</strong></span>
                    <button class="quantity-btn" data-id="${item.id}" data-price="${item.price}">+</button>
                </div>
            `;
            menuItemsContainer.appendChild(menuItemElement);
        });

        // Add event listeners to quantity buttons
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
    }

    // Function to handle quantity change
    function handleQuantityChange(event) {
        const itemId = parseInt(event.target.getAttribute('data-id'));
        const itemPrice = parseFloat(event.target.getAttribute('data-price'));
        const quantityDisplay = event.target.parentElement.querySelector('.quantity');
        let quantity = parseInt(quantityDisplay.textContent);

        if (event.target.textContent === '+') {
            quantity++;
        } else if (event.target.textContent === '-' && quantity > 0) {
            quantity--;
        }

        quantityDisplay.textContent = quantity;
        updateOrderSummary(); // Update order summary on quantity change
    }

// Function to update order summary
function updateOrderSummary() {
    const orderedItemsList = document.createElement('ul');
    let totalItems = 0;
    let totalPrice = 0;

    const quantityDisplays = document.querySelectorAll('.quantity');
    quantityDisplays.forEach(display => {
        const itemId = parseInt(display.previousElementSibling.getAttribute('data-id'));
        const itemName = menuItems.find(item => item.id === itemId).name;
        const itemPrice = parseFloat(display.previousElementSibling.getAttribute('data-price'));
        const quantity = parseInt(display.textContent);
        totalItems += quantity;
        totalPrice += quantity * itemPrice;
        if (quantity > 0) {
            const listItem = document.createElement('li');
            const itemTotalPrice = itemPrice * quantity; // Calculate total price for each item
            listItem.textContent = `${quantity}x ${itemName} (Rs. ${itemPrice} x ${quantity} = Rs. ${itemTotalPrice.toFixed(2)})`;
            orderedItemsList.appendChild(listItem);
        }
    });

    totalItemsDisplay.textContent = totalItems;
    totalPriceDisplay.textContent = totalPrice.toFixed(2);

    // Clear existing order summary
    const priceBreakupContainer = document.querySelector('.price-breakup-container');
    priceBreakupContainer.innerHTML = '';

    // Append the updated list to the priceBreakupContainer
    priceBreakupContainer.appendChild(orderedItemsList);
}



    // Function to handle order food button click
async function handleOrderFood() {
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerPhone = document.getElementById('customer-phone').value;

    const orderedItems = [];
    const quantityDisplays = document.querySelectorAll('.quantity');
    quantityDisplays.forEach(display => {
        const itemId = parseInt(display.previousElementSibling.getAttribute('data-id'));
        const itemName = menuItems.find(item => item.id === itemId).name;
        const quantity = parseInt(display.textContent);
        if (quantity > 0) {
            orderedItems.push({ id: itemId, name: itemName, quantity });
        }
    });

    if (orderedItems.length === 0) {
        alert('Please select at least one item to order.');
        return;
    }

    try {
        const response = await fetch('/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: orderedItems, name: customerName, address: customerAddress, phone: customerPhone })
        });
        if (!response.ok) {
            throw new Error('Failed to place order');
        }
        const orderData = await response.json();
        const orderId = orderData.orderId; // Assuming the response contains the orderId
        console.log('Order placed successfully with ID:', orderId);
        
        // Redirect to OrderReceipt.html with orderId as query parameter
        window.location.href = `OrderReceipt.html?orderId=${orderId}`;
    } catch (error) {
        console.error('Error placing order:', error);
        // Optionally, display an error message to the user
    }
}
    // Initialize order food page
    fetchMenuItems();

    // Add event listener to order food button
    orderFoodBtn.addEventListener('click', handleOrderFood);
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
