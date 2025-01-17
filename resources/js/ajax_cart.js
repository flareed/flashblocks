let cartRows = document.querySelectorAll('.cart-row');

// Iterate over each cart row
cartRows.forEach(row =>
{
    const product_name = row.querySelector('.product-name').textContent.trim(); // Corrected to get textContent
    const decreaseButton = row.querySelector('.decrease-button');
    const increaseButton = row.querySelector('.increase-button');
    const deleteButton = row.querySelector('.delete-button');
    const quantityElement = row.querySelector('.product-quantity');

    // Handle decrease button click
    decreaseButton.addEventListener('click', async () =>
    { // Added async here
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 0)
        {
            quantity -= 1;
            quantityElement.textContent = quantity;

            if (quantity === 0)
            {
                // Remove the row when quantity reaches 0
                row.remove();
                // Send delete request to the server
                await sendDeleteRequest(product_name);
            }
            else
            {
                // Send update request to the server
                await updateCart(product_name, quantity);
            }
        }
        else
        {
            row.remove(); // Remove the row if quantity goes to 0
        }
        updateTotalPrice();
    });

    // Handle increase button click
    increaseButton.addEventListener('click', async () =>
    { // Added async here
        let quantity = parseInt(quantityElement.textContent);
        quantity += 1;
        quantityElement.textContent = quantity;

        // Send update request to the server
        await updateCart(product_name, quantity);
        updateTotalPrice();
    });

    // Handle delete button click
    deleteButton.addEventListener('click', async () =>
    { // Added async here
        row.remove();

        // Send delete request to the server
        await sendDeleteRequest(product_name);
        updateTotalPrice();
    });
});

// Function to update the cart
async function updateCart(product_name, quantity)
{
    try
    {
        const response = await fetch(`/cart?action=update&id=${product_name}&quantity=${quantity}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "update",
                id: product_name,
                quantity: quantity
            })
        });

        if (!response.ok)
        {
            console.error("Failed to update cart:");
        }
    }
    catch (error)
    {
        console.error("Error updating cart:", error);
    }
}

// Function to send a delete request to the server
async function sendDeleteRequest(product_name)
{ // Simplified function
    try
    {
        const response = await fetch(`/cart?action=delete&id=${product_name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: product_name
            })
        });

        if (!response.ok)
        {
            console.error("Failed to delete from cart:");
        }
    } catch (error)
    {
        console.error("Error deleting item from cart:", error);
    }
}

function updateTotalPrice()
{
    let total = 0;
    // can't use the one from global. As if deletion, it will be wrong (will still remember the selected of deleted row)
    cartRows = document.querySelectorAll('.cart-row');

    // Iterate over each cart row
    cartRows.forEach(row =>
    {
        const checkbox = row.querySelector('.product-select');
        if (checkbox.checked)
        {
            const priceElement = row.querySelector('.price');
            const quantityElement = row.querySelector('.product-quantity');
            const price = parseFloat(priceElement.textContent);
            const quantity = parseInt(quantityElement.textContent);

            total += price * quantity; // Add price * quantity to total
        }
    });

    // Update the total price display
    document.getElementById('total-price').innerHTML = total.toFixed(2);
}

// Add event listeners to the checkboxes and buttons
document.querySelectorAll('.product-select').forEach(checkbox =>
{
    checkbox.addEventListener('change', updateTotalPrice); // Update total price when checkbox is clicked
});

// Recalculate total price on page load
updateTotalPrice();

document.getElementById("cart-order-button").addEventListener('click', async function ()
{
    const selectedCheckboxes = document.querySelectorAll('.product-select:checked'); // Get all selected checkboxes
    const products = [];

    if (selectedCheckboxes.length === 0)
    {
        // If no checkboxes are selected, show the message
        myutilities.showMessage("Please select at least one product to to order");
        return;
    }

    let product_id = "";
    let product_name = "";
    let product_price = 0;
    let product_quantity = 0;

    selectedCheckboxes.forEach((checkbox) =>
    {
        const productRow = checkbox.closest('.cart-row'); // Find the row for this checkbox
        product_id = productRow.querySelector('.product-id').innerText;
        product_name = productRow.querySelector('.product-name').innerText;
        product_price = productRow.querySelector('.price').innerText;
        product_quantity = productRow.querySelector('.product-quantity').innerText;

        // Collect the row and the product name for deletion
        products.push({ product_id, product_name, product_price, product_quantity });
    });

    const response = await fetch("/cart?action=order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            products
        })
    });

    const reply = await response.json();
    if (response.ok)
    {
        products.forEach(product =>
        {
            sendDeleteRequest(product.product_name);
        });

        selectedCheckboxes.forEach((checkbox) =>
        {
            const productRow = checkbox.closest('.cart-row'); // Find the row for this checkbox
            productRow.remove(); // Remove the row from the DOM
        });

        updateTotalPrice();
    }
    myutilities.showMessage(reply.message);
});