document.getElementById("detail_form").addEventListener("submit", async function (e)
{
    e.preventDefault(); // Prevent form from reloading the page
    // const formData = new FormData(this); // this = element from document.getElementByID()
    // const data = new URLSearchParams(formData); // ignore file if there is in post data --}}

    const messageSection = document.getElementById("message-section");
    const messageElement = document.getElementById("message");
    const address = document.getElementById("address").value;
    const credit_card = document.getElementById("credit_card").value;

    // Clear previous messages
    messageElement.innerHTML = "";

    // Basic validation
    if (!address || !credit_card)
    {
        messageElement.innerHTML = "Please fill in all fields.";
        messageSection.classList.remove("hidden");
        return;
    }
    else if (address.trim() == "" || credit_card.trim() == "")
    {
        messageElement.innerHTML = "Fields can't contain only empty space";
        messageSection.classList.remove("hidden");
        return;
    }
    else if (isNaN(credit_card) | credit_card.length != 16)
    {
        messageElement.innerHTML = "Credit card must be number & must be 16 numbers total";
        messageSection.classList.remove("hidden");
        return;
    }

    const response = await fetch("/account?action=update_detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            address, 
            credit_card,
            update: true 
            })
    });

    const result = await response.json(); // Assuming the server returns a JSON response

    // Show the message
    messageElement.innerHTML = result.message;

    // Display the message section
    messageSection.classList.remove("hidden");
});