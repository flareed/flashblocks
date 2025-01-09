const myutilities =
{
    // Function to display the message in millisecond
    showMessage(message, duration = 3000)
    {
        this.interalShowMessage("#28a745", message, duration);
    }, 

    showErrorMessage(message, duration = 3000)
    {
        this.interalShowMessage("#FF0000", message, duration);
    },

    // colorcode: hex (ex: "#FF0000")
    interalShowMessage(colorcode, message, duration = 3000)
    {
        const messageElement = document.createElement("div");
        messageElement.textContent = message;
        messageElement.classList.add("cart-message");
        document.body.appendChild(messageElement);

        // Style for the message (you can adjust the styling as needed)
        messageElement.style.position = "fixed";
        messageElement.style.bottom = "10px";
        messageElement.style.left = "50%";
        messageElement.style.transform = "translateX(-50%)";
        messageElement.style.padding = "10px";
        messageElement.style.backgroundColor = colorcode;
        messageElement.style.color = "#fff";
        messageElement.style.borderRadius = "5px";
        messageElement.style.zIndex = "1000";

        // Remove the message after 3 seconds
        setTimeout(() =>
        {
            messageElement.remove();
        }, duration);
    }
};