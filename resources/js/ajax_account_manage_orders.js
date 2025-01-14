document.addEventListener("DOMContentLoaded", async () =>
{
    const ordersTableBody = document.getElementById("ordersTableBody");
    const statusFilter = document.getElementById("statusFilter");
    const dateSort = document.getElementById("dateSort");

    // Function to fetch and display orders
    async function fetchOrders()
    {
        const status = statusFilter.value;
        const sort = dateSort.value;

        const response = await fetch("/account?view=manage_orders&action=filter", {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status,
                sort,
            })
        });

        const reply = await response.json();

        // Update the table with the filtered and sorted products
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";

        reply.orders.forEach(order =>
        {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="border border-gray-300 px-4 py-2">${order.id}</td>
                <td class="border border-gray-300 px-4 py-2">${order.user}</td>
                <td class="border border-gray-300 px-4 py-2">${new Date(order.created_date).toLocaleString()}</td>
                <td class="border border-gray-300 px-4 py-2">${order.status}</td>
            `;

            tableBody.appendChild(row);
        })
    }

    statusFilter.addEventListener("change", fetchOrders);
    dateSort.addEventListener("change", fetchOrders);
});