document.addEventListener("DOMContentLoaded", function ()
{
    const searchBtn = document.getElementById("search-btn");
    const name_textbox = document.getElementById("search-display-name");
    const category_textbox = document.getElementById("search-category");
    const brand_textbox = document.getElementById("search-brand");
    const sort_combobox = document.getElementById("sort-by");

    // Handle the search button click event
    searchBtn.addEventListener("click", async function ()
    {
        const product_display_name = name_textbox.value.trim();
        const product_category = category_textbox.value.trim();
        const product_brand = brand_textbox.value.trim();
        const sort = sort_combobox.value;

        // Prepare the payload for the POST request
        const payload = {
            product_display_name,
            product_category,
            product_brand,
            sort
        };

        // Make a POST request using fetch
        const response = await fetch("/account?view=manage_products&action=filter", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        var reply = await response.json();

        // Update the table with the filtered and sorted products
        const tableBody = document.querySelector("tbody");
        tableBody.innerHTML = "";

        reply.products.forEach(product =>
        {
            const row = document.createElement("tr");

            row.innerHTML = `
                    <td class="border border-gray-300 p-2">${product.product_brand}</td>
                    <td class="border border-gray-300 p-2">${product.product_display_name}</td>
                    <td class="border border-gray-300 p-2">${product.product_category}</td>
                    <td class="border border-gray-300 p-2">${product.product_description}</td>
                    <td class="border border-gray-300 p-2">${product.product_price}</td>
                    <td class="border border-gray-300 p-2">${product.product_stock}</td>
                    <td class="border border-gray-300 p-2">
                        <a href="/account?view=manage_orders&id=${encodeURIComponent(product.product_name)}" class=" hover:text-gray-600 hover:bg-gray-300 bg-gray-100 p-2">CLICK ME</a>
                    </td>
                `;

            tableBody.appendChild(row);
        });
    });
});