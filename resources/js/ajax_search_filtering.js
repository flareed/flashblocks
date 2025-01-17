function getUrlParameter(name)
{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to sort products by price
function sortPrice(productList, asc = true)
{
    const products = Array.from(productList.querySelectorAll(".product"));

    products.sort((a, b) =>
    {
        const priceA = parseFloat(a.querySelector(".product-price").textContent);
        const priceB = parseFloat(b.querySelector(".product-price").textContent);

        return asc ? priceA - priceB : priceB - priceA;
    });

    updateProductList(productList, products);
}

// Function to sort products by name
function sortName(productList, asc = true)
{
    const products = Array.from(productList.querySelectorAll(".product"));

    products.sort((a, b) =>
    {
        const nameA = a.querySelector(".product-name").textContent.toLowerCase();
        const nameB = b.querySelector(".product-name").textContent.toLowerCase();

        return asc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    updateProductList(productList, products);
}

// Helper function to update the product list
function updateProductList(productList, sortedProducts)
{
    productList.innerHTML = ""; // Clear existing products
    sortedProducts.forEach(product => productList.appendChild(product)); // Re-append sorted products
}

document.addEventListener("DOMContentLoaded", () =>
{
    let currentPage = getUrlParameter('page') || 1;
    let limit = getUrlParameter('limit') || 2;
    let pageCount = 1;

    const filterForm = document.getElementById("filter-form");
    const applyFiltersButton = document.getElementById("apply-filters");
    const productList = document.getElementById("product-list");
    const noProductsMessage = document.getElementById("no-products");

    const sort_name_asc_button = document.getElementById("sort-name-asc");
    const sort_name_desc_button = document.getElementById("sort-name-desc");
    const sort_price_asc_button = document.getElementById("sort-price-asc");
    const sort_price_desc_button = document.getElementById("sort-price-desc");

    sort_name_asc_button.addEventListener("click", () => sortName(productList, asc = true));
    sort_name_desc_button.addEventListener("click", () => sortName(productList, asc = false));
    sort_price_asc_button.addEventListener("click", () => sortPrice(productList, true));
    sort_price_desc_button.addEventListener("click", () => sortPrice(productList, false));

    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const currentPageDisplay = document.getElementById("current-page");

    currentPageDisplay.textContent = `Page ${currentPage}`;
    prevPageButton.disabled = false;

    document.getElementById("page-limit").addEventListener("change", function ()
    {
        const new_limit = parseInt(this.value);

        if (new_limit == limit)
        {
        }
        else
        {
            limit = parseInt(this.value); // this.value: selected value
            currentPage = 1;
            applyFilters();
        }
    });

    // Apply filters by constructing URL with query params
    const applyFilters = async () =>
    {
        const formData = new FormData(filterForm);
        const params = new URLSearchParams();

        // Add each form field as a query parameter
        formData.forEach((value, key) =>
        {
            if (value)
            {
                // Only add non-empty values
                params.append(key, value);
            }
        });

        params.append("page", currentPage);
        let url = `/search?${params.toString()}`;

        params.append("limit", limit);
        url = `/search?${params.toString()}`;

        // Update the URL in the browser's address bar
        window.history.pushState({}, "", url);

        // Fetch the filtered products based on the URL
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST"
        });

        const reply = await response.json();
        const { product_list, product_template } = reply;
        currentPage = reply.currentPage;
        limit = reply.limit;
        pageCount = reply.pageCount;

        if (product_list.length > 0)
        {
            if (!noProductsMessage.classList.contains("hidden"))
            {
                noProductsMessage.classList.add("hidden");
            }

            // Compile and render the Handlebars template
            const products = JSON.parse(product_list); // Convert string to object if necessary
            const compiledTemplate = Handlebars.compile(product_template);
            const renderedHtml = products.map(product => compiledTemplate(product)).join("");
            productList.innerHTML = renderedHtml;

            updatePaginationControls(pageCount);
            addCartEventListener();
        }
        else
        {
            noProductsMessage.classList.remove("hidden");
            productList.innerHTML = "";
        }
    };

    // Function to populate the form fields based on the URL query parameters
    const populateFiltersFromUrl = () =>
    {
        const params = new URLSearchParams(window.location.search);

        // Populate search text
        const text = params.get("text");
        if (text)
        {
            document.getElementById("text").value = text;
        }

        // Populate price_from
        const priceFrom = params.get("price_from");
        if (priceFrom)
        {
            document.getElementById("price_from").value = priceFrom;
        }

        // Populate lumens_from
        const lumensFrom = params.get("lumens_from");
        if (lumensFrom)
        {
            document.getElementById("lumens_from").value = lumensFrom;
        }

        // Populate led_chip
        const ledChip = params.get("led_chip");
        if (ledChip)
        {
            document.getElementById("led_chip").value = ledChip;
        }

        // Populate categories (checkboxes)
        const categories = params.getAll("category");
        const checkboxes = document.querySelectorAll(`input[name="category"]`);

        for (let checkbox of checkboxes)
        {
            for (let category of categories)
            {
                if (checkbox.value.toLowerCase() === category.toLowerCase())
                {
                    checkbox.checked = true;
                }
            }
        }
    };

    // Update pagination controls based on the current and total pages
    const updatePaginationControls = (page_count) =>
    {
        console.log(`Page: ${currentPage}, limit: ${limit}, page count: ${pageCount}`);

        currentPageDisplay.textContent = `Page ${currentPage}`;
        prevPageButton.disabled = (currentPage <= 1);
        nextPageButton.disabled = (currentPage >= page_count || page_count === 0);
    };

    // Event listener for pagination buttons
    prevPageButton.addEventListener("click", () =>
    {
        if (currentPage > 1)
        {
            currentPage--;
            applyFilters();
        }
    });

    nextPageButton.addEventListener("click", () =>
    {
        currentPage++;
        applyFilters();
    });

    // Event listener for the Apply Filters button
    applyFiltersButton.addEventListener("click", applyFilters);
    populateFiltersFromUrl();
});