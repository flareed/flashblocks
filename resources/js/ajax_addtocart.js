document.addEventListener("DOMContentLoaded", function ()
{
    const products = document.querySelectorAll(".product");

    products.forEach(product =>
    {
        const addToCartButton = product.querySelector(".product-cart-button");

        addToCartButton.addEventListener("click", async function ()
        {
            const productId = product.getAttribute("id");  // Get product ID from the data attribute

            const response = await fetch(`/cart?action=add&id=${productId}`, {
                method: "POST"
            });
            const result = await response.json();
            const message = result.message;

            if (response.ok)
            {
                myutilities.showMessage(message, 3000);
            }
            else
            {
                myutilities.showErrorMessage(message, 3000);
            }

        });

    });
});

function addCartEventListener()
{
 	const products = document.querySelectorAll(".product");

    products.forEach(product =>
    {
        const addToCartButton = product.querySelector(".product-cart-button");

        addToCartButton.addEventListener("click", async function ()
        {
            const productId = product.getAttribute("id");  // Get product ID from the data attribute

            const response = await fetch(`/cart?action=add&id=${productId}`, {
                method: "POST"
            });
            const result = await response.json();
            const message = result.message;

            if (response.ok)
            {
                myutilities.showMessage(message, 3000);
            }
            else
            {
                myutilities.showErrorMessage(message, 3000);
            }

        });

    });
}