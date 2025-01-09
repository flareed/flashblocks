document.addEventListener("DOMContentLoaded", () =>
{
    let currentPage = 1;
    let limit = 2;

    const filterForm = document.getElementById("filter-form");
    const applyFiltersButton = document.getElementById("apply-filters");
    const productList = document.getElementById("product-list");
    const noProductsMessage = document.getElementById("no-products");

    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    const currentPageDisplay = document.getElementById("current-page");

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
        params.append("limit", limit);

        // Construct the URL
        const url = `/search?${params.toString()}`;

        // Update the URL in the browser's address bar
        window.history.pushState({}, "", url);

        // Fetch the filtered products based on the URL
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST"
        });

        const { product_list, product_template, page_count } = await response.json();
        console.log(page_count);

        if (product_list.length > 0)
        {
            noProductsMessage.classList.add("hidden");

            // Compile and render the Handlebars template
            const products = JSON.parse(product_list); // Convert string to object if necessary
            const compiledTemplate = Handlebars.compile(product_template);
            const renderedHtml = products.map(product => compiledTemplate(product)).join("");
            productList.innerHTML = renderedHtml;

            // updatePaginationControls(page_count);
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