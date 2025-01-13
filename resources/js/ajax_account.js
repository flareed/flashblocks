document.getElementById("logout_form").addEventListener("submit", async function (e)
{
    e.preventDefault(); // Prevent form from reloading the page
    // const formData = new FormData(this); // this = element from document.getElementByID()
    // const data = new URLSearchParams(formData); // ignore file if there is in post data --}}

    const response = await fetch("/account?action=logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logout: true })
    });

    const result = await response.json(); // Assuming the server returns a JSON response

    // Show the message
    const messageSection = document.getElementById("message-section");
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = result.message;

    // Display the message section
    messageSection.classList.remove("hidden");

    // Check if a redirect is required
    if (result.redirect && result.redirect === true && result.redirectUrl)
    {
        // Redirect to the provided URL after x milliseconds
        setTimeout(function ()
        {
            window.location.href = result.redirectUrl; // Redirect to the account/dashboard
        }, result.duration);
    }
});

document.getElementById("change-password-form").addEventListener("submit", async function (e)
{
    e.preventDefault(); // Prevent form from reloading the page

    const username = document.getElementById("username").value;
    const current_password = document.getElementById("current-password").value;
    const new_password = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Show/hide the message section
    const messageSection = document.getElementById("password-message-section");
    const messageElement = document.getElementById("password-message");

    // Clear previous messages
    messageElement.innerHTML = "";

    // Basic validation
    if (!current_password || !new_password || !confirmPassword)
    {
        messageElement.innerHTML = "Please fill in all fields.";
        messageSection.classList.remove("hidden");
        return;
    }

    if (new_password !== confirmPassword)
    {
        messageElement.innerHTML = "New password and confirmation do not match.";
        messageSection.classList.remove("hidden");
        return;
    }

    if (new_password == current_password)
    {
        messageElement.innerHTML = "New password can't be the same as old password";
        messageSection.classList.remove("hidden");
        return;
    }

    // Send the request to the server to change the password
    const response = await fetch("/account?action=change_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            password: current_password,
            new_password
        })
    });

    const result = await response.json(); // Assuming the server returns a JSON response

    // Display the message
    messageElement.innerHTML = result.message;
    messageSection.classList.remove("hidden");

    // Handle successful or failed change
    if (result.success)
    {
        // Optionally redirect or reset the form
        // window.location.href = result.redirectUrl; // Redirect to a success page
    }
});