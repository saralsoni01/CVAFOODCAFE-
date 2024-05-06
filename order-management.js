// Simulated data
let orders = [
    { id: 1, items: ['Pizza', 'Tea'], status: 'pending' },
    { id: 2, items: ['Burger', 'Coffee'], status: 'preparing' },
    { id: 3, items: ['Sandwich'], status: 'completed' }
];

function displayOrders() {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = ''; // Clear the list first
    
    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.innerHTML = `
            <p>Order #${order.id}: ${order.items.join(', ')} - Status: ${order.status}</p>
            <button onclick="updateOrderStatus(${order.id}, 'preparing')">Mark as Preparing</button>
            <button onclick="updateOrderStatus(${order.id}, 'ready')">Mark as Ready</button>
            <button onclick="updateOrderStatus(${order.id}, 'completed')">Mark as Completed</button>
        `;
        ordersList.appendChild(orderElement);
    });
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        displayOrders(); // Refresh the list to show the new status
    }
   
  }  



// Initialize the order display
displayOrders();
