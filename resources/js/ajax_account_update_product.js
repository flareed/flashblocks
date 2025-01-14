document.getElementById("update-form").addEventListener("submit", async function (e)
{
    e.preventDefault(); // Prevent form from reloading the page

    const formData = new FormData(this); // this = element from document.getElementByID()
    const data = new URLSearchParams(formData); // ignore file if there is in post data

    const response = await fetch("/account?view=manage_products&action=update", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    });

    const reply = await response.json();

    // Show the message
    const messageSection = document.getElementById("message-section");
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = reply.message;

    // Display the message section
    messageSection.classList.remove("hidden");
});