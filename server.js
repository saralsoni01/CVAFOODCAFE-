console.log('Starting server...');

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating unique identifiers

const app = express();
const dbPath = path.resolve(__dirname, 'food_cafe.db');

// Initialize the database
console.log('Initializing database...');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error initializing database:', err.message);
    } else {
        console.log('Database initialized successfully.');
    }
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the "public" directory
console.log('Serving static files from the "public" directory...');
app.use(express.static(path.join(__dirname, 'public')));

// Example route to fetch menu items
console.log('Setting up route to fetch menu items...');
app.get('/menu/:itemId?', (req, res) => {
    const itemId = req.params.itemId;

    // If itemId is provided, fetch a specific menu item
    if (itemId) {
        console.log('[' + new Date().toISOString() + '] Received request to fetch menu item with ID ' + itemId + '...');
        db.get('SELECT * FROM menu_items WHERE id = ?', [itemId], (err, row) => {
            if (err) {
                console.error('Error fetching menu item:', err.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                if (!row) {
                    res.status(404).json({ error: 'Menu item not found' });
                } else {
                    res.json(row);
                }
            }
        });
    } else {
        // If itemId is not provided, fetch all menu items
        console.log('[' + new Date().toISOString() + '] Received request to fetch menu items...');
        db.all('SELECT * FROM menu_items', (err, rows) => {
            if (err) {
                console.error('Error fetching menu items:', err.message);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                res.json(rows);
            }
        });
    }
});



// Example route to add a new menu item
console.log('Setting up route to add a new menu item...');
app.post('/menu', (req, res) => {
    console.log('[' + new Date().toISOString() + '] Received request to add a new menu item...');
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ error: 'Please provide name, description, and price' });
    }

    const query = 'INSERT INTO menu_items (name, description, price) VALUES (?, ?, ?)';
    db.run(query, [name, description, price], (err) => {
        if (err) {
            console.error('Error adding menu item:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Menu item added successfully:', { name, description, price });
            res.json({ message: 'Menu item added successfully' });
        }
    });    
});

// Example route to edit a menu item
console.log('Setting up route to edit a menu item...');
app.put('/menu/:itemId', (req, res) => {
    console.log('[' + new Date().toISOString() + '] Received request to edit a menu item...');
    const itemId = req.params.itemId;
    const { name, description, price } = req.body;
    if (!itemId || !name || !description || !price) {
        return res.status(400).json({ error: 'Please provide item ID, name, description, and price' });
    }

    const query = 'UPDATE menu_items SET name = ?, description = ?, price = ? WHERE id = ?';
    db.run(query, [name, description, price, itemId], (err) => {
        if (err) {
            console.error('Error editing menu item:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Menu item edited successfully', { name, description, price, itemId });
            res.json({ message: 'Menu item edited successfully' });
        }
    });
});


// Example route to remove a menu item
console.log('Setting up route to remove a menu item...');
app.delete('/menu/:itemId', (req, res) => {
    console.log('[' + new Date().toISOString() + '] Received request to remove a menu item...');
    const itemId = req.params.itemId;
    if (!itemId) {
        return res.status(400).json({ error: 'Please provide item ID' });
    }

    const query = 'DELETE FROM menu_items WHERE id = ?';
    db.run(query, [itemId], (err) => {
        if (err) {
            console.error('Error removing menu item:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Menu item removed successfully:', { id: itemId });
            res.json({ message: 'Menu item removed successfully' });
        }
    });
});


// Add the route handler for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Logging in user:', { username, password }); // Log the login attempt
    
    // Generate a random session ID of 128 characters
    const sessionID = generateSessionID();
    const lastLoginTime = new Date();
    const loggingExpired = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    db.get('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error('Error logging in user:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (!row) {
                res.status(401).json({ error: 'Invalid username or password' });
            } else {
                // Update the user's session ID, last login time, and logging expired time in the database
                db.run('UPDATE Users SET SessionID = ?, LastLoginTime = ?, LoggingExpired = ? WHERE id = ?', [sessionID, lastLoginTime.toISOString(), loggingExpired.toISOString(), row.id], (err) => {
                    if (err) {
                        console.error('Error updating session ID and login time:', err.message);
                        res.status(500).json({ error: 'Internal server error' });
                    } else {
                        // Set up cookies with session ID and username
                        res.cookie('sessionID', sessionID, { maxAge: 5 * 60 * 1000 }); // Cookie expires in 5 minutes
                        res.cookie('username', username, { maxAge: 5 * 60 * 1000 }); // Set username cookie
                        res.json({ message: 'Login successful' });
                    }
                });
            }
        }
    });
});


// Function to generate a random session ID
function generateSessionID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionID = '';
    for (let i = 0; i < 128; i++) {
        sessionID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return sessionID;
}

// Add a route handler for user sign out
app.post('/signout', (req, res) => {
    const sessionID = req.cookies.sessionID;

    // Check if the session ID cookie exists
    if (!sessionID) {
        return res.status(400).json({ error: 'No session ID found' });
    }

    // Clear the session ID and LoggingExpired fields in the database
    db.run('UPDATE Users SET SessionID = NULL, LoggingExpired = NULL WHERE SessionID = ?', [sessionID], (err) => {
        if (err) {
            console.error('Error clearing session ID and LoggingExpired:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Clear the session ID cookie
            res.clearCookie('sessionID');
            res.json({ message: 'Sign out successful' });
        }
    });
});


// Register endpoint
app.post('/register', (req, res) => {
    const { firstName, lastName, username, password, email, phone, enabled } = req.body;
    console.log('Registering user:', { firstName, lastName, username, password, email, phone, enabled }); // Log the registration attempt
    const query = 'INSERT INTO Users (firstName, lastName, username, password, email, phone, enabled) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.run(query, [firstName, lastName, username, password, email, phone, enabled], function(err) {
        if (err) {
            console.error('Error registering user:', err.message); // Log the error message
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('User registered successfully with ID:', this.lastID);
        res.json({ message: 'User registered successfully' });
    });
});

// Add route handler to fetch user data based on username stored in cookies
app.get('/user', (req, res) => {
    const username = req.cookies.username;
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    db.get('SELECT * FROM Users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Error fetching user data:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (!row) {
                res.status(404).json({ error: 'User not found' });
            } else {
                // Remove sensitive data like password before sending the response
                delete row.password;
                res.json(row);
            }
        }
    });
});

// Add route handler to update user profile
app.post('/update-profile', (req, res) => {
    const username = req.cookies.username;
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { firstName, lastName, email, phone, enabled } = req.body;
    db.run('UPDATE Users SET firstName = ?, lastName = ?, email = ?, phone = ?, enabled = ? WHERE username = ?', [firstName, lastName, email, phone, enabled, username], function(err) {
        if (err) {
            console.error('Error updating user profile:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('User profile updated successfully:', { username }, { firstName, lastName, email, phone, enabled });
            res.json({ message: 'User profile updated successfully' });
        }
    });
});

// Example route to fetch orders
app.get('/orders', (req, res) => {
    console.log('Fetching orders...');
    db.all('SELECT * FROM orders', (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// Example route to add a new order
app.post('/orders', (req, res) => {
    const { items, status } = req.body;
    if (!items || !status) {
        return res.status(400).json({ error: 'Please provide items and status for the order' });
    }

    const query = 'INSERT INTO orders (items, status) VALUES (?, ?)';
    db.run(query, [items, status], function(err) {
        if (err) {
            console.error('Error adding order:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Order added successfully with ID:', this.lastID);
            res.json({ message: 'Order added successfully', orderId: this.lastID });
        }
    });
});

// Example route to update order status
app.put('/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    if (!orderId || !status) {
        return res.status(400).json({ error: 'Please provide order ID and new status' });
    }

    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    db.run(query, [status, orderId], (err) => {
        if (err) {
            console.error('Error updating order status:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            console.log('Order status updated successfully:', { id: orderId, status });
            res.json({ message: 'Order status updated successfully' });
        }
    });
});

// Example route to place an order
app.post('/order', (req, res) => {
    const { items, name, address, phone } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Please provide at least one item to order' });
    }

    // Fetch menu items from the database
    db.all('SELECT * FROM menu_items', (err, menuItems) => {
        if (err) {
            console.error('Error fetching menu items:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Calculate total amount and create amount breakup string
        let totalAmount = 0;
        let amountBreakup = '';
        items.forEach((item, index) => {
            const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
            if (menuItem) {
                const itemTotal = item.quantity * menuItem.price;
                totalAmount += itemTotal;
                amountBreakup += `${index > 0 ? ', ' : ''}${item.quantity}x ${menuItem.name} ${menuItem.price} x ${item.quantity} = ${itemTotal.toFixed(2)}`;
            }
        });

        // Insert the order into the database
        const query = 'INSERT INTO orders (items, name, address, phone, status, amountbreakup, totalamount) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const orderItems = items.map(item => `${item.quantity}x ${item.name}`).join(', ');
        const status = 'preparing'; // Default status
        db.run(query, [orderItems, name, address, phone, status, amountBreakup, totalAmount], function(err) {
            if (err) {
                console.error('Error placing order:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            } else {
                console.log('Order placed successfully with ID:', this.lastID, { items, name, address, phone, status, amountBreakup, totalAmount });
                return res.json({ message: 'Order placed successfully', orderId: this.lastID });
            }
        });
    });
});

// Example route to fetch order details by order ID
app.get('/orderreceipt/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    console.log('Fetching order details for order ID:', orderId);
    // Fetch order details from the database based on the order ID
    db.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, row) => {
        if (err) {
            console.error('Error fetching order details:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (!row) {
                res.status(404).json({ error: 'Order not found' });
            } else {
                res.json(row);
            }
        }
    });
});

// Middleware to validate user's session
function authenticate(req, res, next) {
    const sessionID = req.cookies.sessionID;
    if (!sessionID) {
        // Redirect to the login page if sessionID cookie is not present
        return res.redirect('/user-authentication.html');
    }
    // Check the user's session in the database
    db.get('SELECT * FROM Users WHERE SessionID = ?', [sessionID], (err, row) => {
        if (err) {
            console.error('Error fetching user session:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            if (!row) {
                // Redirect to the login page if user session is not found
                return res.redirect('/user-authentication.html');
            } else {
                // Set the user's information in the request for future use
                req.user = row;
                next(); // Proceed to the next middleware or route handler
            }
        }
    });
}

// Apply the authenticate middleware to routes that require authentication
app.use(['/menu', '/order', '/orders', '/update-profile'], authenticate);



// Start the server
console.log('Starting server...');
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('[' + new Date().toISOString() + '] Server is running at http://localhost:' + port);
});

// Define a route handler for the root URL
console.log('Defining route handler for the root URL...');
app.get('/', (req, res) => {
    console.log('[' + new Date().toISOString() + '] Received request for the root URL...');
    res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

