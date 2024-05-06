// Define the addButton variable
const addButton = document.createElement('button');
addButton.textContent = 'Add Menu Item';
addButton.classList.add('add-menu-item-button'); // Add this line to assign a class

// Function to fetch and display menu items from the server
async function displayMenuItems() {
    try {
        console.log('Fetching menu items from the server...');
        const response = await fetch('/menu');
        if (!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        const menuItems = await response.json();
        const menuList = document.getElementById('menu-items-list');
        menuList.innerHTML = ''; // Clear the list first

        menuItems.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <div class="menu-item">
                    <h3>${item.name} - Rs. ${item.price}</h3>
                    <p>${item.description}</p>
                    <div class="button-container">
                        <button onclick="editMenuItem(${item.id})">Edit Item</button>
                        <button onclick="removeMenuItem(${item.id})">Remove Item</button>
                    </div>
                </div>
            `;
            menuList.appendChild(itemElement);
        });
        

        console.log('Menu items fetched successfully.');
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
}

// Define a message container element
const messageContainer = document.createElement('div');
messageContainer.classList.add('message-container');
document.body.appendChild(messageContainer);

// Function to add or edit a menu item
async function submitMenuItem(event) {
    event.preventDefault();
    console.log('Submitting menu item form...');
    const itemId = document.getElementById('item-id').value;
    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const price = parseFloat(document.getElementById('item-price').value); // Convert price to a number

    console.log('Name:', name);
    console.log('Description:', description);
    console.log('Price:', price);

    try {
        let url = '/menu';
        let method = 'POST';
        if (itemId) {
            url += `/${itemId}`;
            method = 'PUT';
        }
        console.log('Submitting to URL:', url);
        console.log('Using method:', method);
        console.log('Submitting data:', { name, description, price });
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price })
        });
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Failed to submit menu item');
        }
        const result = await response.json();
        console.log('Menu item submitted successfully:', result.message);

        // Clear the form input values
        document.getElementById('item-id').value = '';
        document.getElementById('item-name').value = '';
        document.getElementById('item-description').value = '';
        document.getElementById('item-price').value = '';

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('message');
        successMessage.textContent = itemId ? 'Menu item saved successfully!' : `Menu item "${name}" added successfully!`;
        messageContainer.appendChild(successMessage);

        // Refresh menu items after adding or editing
        await displayMenuItems();

        // Center the "Add Menu Item" button
        const addButton = document.getElementById('add-menu-item-button');
        addButton.style.margin = '0 auto';

    } catch (error) {
        console.error('Error submitting menu item:', error);
    }
}


// Function to remove a menu item
async function removeMenuItem(itemId) {
    try {
        console.log(`Removing menu item with ID ${itemId}...`);
        const response = await fetch(`/menu/${itemId}`, {
            method: 'DELETE'
        });
        console.log('Response received:', response); // Add this console log
        if (!response.ok) {
            throw new Error('Failed to remove menu item');
        }
        const result = await response.json();
        console.log('Menu item removed successfully:', result.message);

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('success-message');
        successMessage.textContent = 'Menu item removed successfully!';
        messageContainer.appendChild(successMessage);

        // Refresh menu items after deleting
        await displayMenuItems();
    } catch (error) {
        console.error('Error removing menu item:', error);
    }
}

// Function to handle editing a menu item
async function editMenuItem(itemId) {
    try {
        console.log(`Editing menu item with ID ${itemId}...`);
        
        // Fetch the details of the menu item
        const response = await fetch(`/menu/${itemId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch menu item details');
        }
        const menuItem = await response.json();
        
        // Populate the form with the menu item details
        document.getElementById('item-id').value = itemId;
        document.getElementById('item-name').value = menuItem.name;
        document.getElementById('item-description').value = menuItem.description;
        document.getElementById('item-price').value = menuItem.price;

        // Hide the "Add Menu Item" button
        const addButton = document.getElementById('add-menu-item-button');
        addButton.style.display = 'none';

        // Check if the "Save" button already exists
        let saveButton = document.getElementById('save-menu-item-button');
        if (!saveButton) {
            // Create a designer box for the edit/save buttons
            const designerBox = document.createElement('div');
            designerBox.classList.add('designer-box');

            // Create the "Save" button
            saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.id = 'save-menu-item-button';
            saveButton.addEventListener('click', async () => {
                await saveMenuItem();
                // Restore the "Add Menu Item" button
                addButton.style.display = 'block';
                // Remove the designer box and save button
                document.getElementById('add-menu-item-form').removeChild(designerBox);
            });

            // Append the "Save" button to the designer box
            designerBox.appendChild(saveButton);

            // Append the designer box to the form
            document.getElementById('add-menu-item-form').appendChild(designerBox);
        } else {
            // If the "Save" button already exists, just show the designer box
            const designerBox = document.getElementById('edit-menu-item-box');
            designerBox.style.display = 'block';
        }

    } catch (error) {
        console.error('Error editing menu item:', error);
    }
}




// Function to save the edited menu item
async function saveMenuItem() {
    try {
        console.log('Saving edited menu item...');
        const itemId = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const price = parseFloat(document.getElementById('item-price').value); // Convert price to a number

        console.log('Name:', name);
        console.log('Description:', description);
        console.log('Price:', price);

        // Submit the edited menu item to the server using fetch
        const response = await fetch(`/menu/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price })
        });
        console.log('Response received:', response);
        if (!response.ok) {
            throw new Error('Failed to save menu item');
        }
        const result = await response.json();
        console.log('Menu item saved successfully:', result.message);

        // Clear the form input values
        document.getElementById('item-id').value = '';
        document.getElementById('item-name').value = '';
        document.getElementById('item-description').value = '';
        document.getElementById('item-price').value = '';

        // Display success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('message');
        successMessage.classList.add('success-message'); // Add this line
        successMessage.textContent = 'Menu item saved successfully!';
        messageContainer.appendChild(successMessage);

        // Refresh menu items after saving
        await displayMenuItems();

        // Center the "Add Menu Item" button
        const addButton = document.querySelector('.add-menu-item-button');
        addButton.style.margin = '0 auto';

    } catch (error) {
        console.error('Error saving menu item:', error);
    }
}


// Initialize the menu display after the window is fully loaded
window.onload = async function() {
    await displayMenuItems();
    // Add form submission event listener
    document.getElementById('add-menu-item-form').addEventListener('submit', submitMenuItem);
};

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
