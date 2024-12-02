document.getElementById("registration_form").addEventListener("submit", async function (e)
{
    e.preventDefault(); // Prevent form from reloading the page

    const formData = new FormData(this); // this = element from document.getElementByID()
    const data = new URLSearchParams(formData); // ignore file if there is in post data

    const response = await fetch("/register", {
        method: "POST",
        body: data
    });

    const result = await response.json(); // Assuming the server returns a JSON response

    // Show the message
    const messageSection = document.getElementById("message-section");
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = result.message;

    // Display the message section
    messageSection.classList.remove("hidden");
});