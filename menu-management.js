// Function to fetch and display menu items from the server
async function displayMenuItems() {
    try {
        console.log('Fetching menu items from the server...');
        const response = await fetch('/menuItems');
        const menuItems = await response.json();
        const menuList = document.getElementById('menu-items-list');
        menuList.innerHTML = ''; // Clear the list first

        menuItems.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <h3>${item.name} - Rs. ${item.price}</h3>
                <p>${item.description}</p>
                <button onclick="removeMenuItem(${item.id})">Remove Item</button>
            `;
            menuList.appendChild(itemElement);
        });

        console.log('Menu items fetched.');
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
}

// Handling form submission
document.getElementById('add-menu-item-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    // Code to handle form submission (e.g., sending data to the server)
});

// Initialize the menu display after the window is fully loaded
window.onload = async function() {
    await displayMenuItems();
};
