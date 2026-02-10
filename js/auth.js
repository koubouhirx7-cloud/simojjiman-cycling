(function () {
    // Configuration
    const PASSWORD = "1111";
    const SESSION_KEY = "shimojiman_authenticated";

    // check if already authenticated
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
        return;
    }

    // Create overlay elements
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "#0f172a"; // Match site dark theme
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "#ffffff";
    overlay.style.fontFamily = "'Plus Jakarta Sans', sans-serif";

    const container = document.createElement("div");
    container.style.textAlign = "center";
    container.style.padding = "2rem";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
    container.style.borderRadius = "1rem";
    container.style.backdropFilter = "blur(10px)";
    container.style.border = "1px solid rgba(255, 255, 255, 0.1)";

    const title = document.createElement("h2");
    title.textContent = "Protected Content";
    title.style.marginBottom = "1.5rem";
    title.style.fontSize = "1.5rem";
    title.style.fontWeight = "bold";

    const input = document.createElement("input");
    input.type = "password";
    input.placeholder = "Enter Password";
    input.style.padding = "0.75rem 1rem";
    input.style.borderRadius = "0.5rem";
    input.style.border = "1px solid rgba(255, 255, 255, 0.2)";
    input.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    input.style.color = "white";
    input.style.marginBottom = "1rem";
    input.style.width = "200px";
    input.style.outline = "none";
    input.style.display = "block";
    input.style.margin = "0 auto 1rem auto";

    const button = document.createElement("button");
    button.textContent = "Enter";
    button.style.padding = "0.75rem 2rem";
    button.style.borderRadius = "0.5rem";
    button.style.backgroundColor = "#258cf4"; // Primary color
    button.style.color = "white";
    button.style.border = "none";
    button.style.cursor = "pointer";
    button.style.fontSize = "1rem";
    button.style.fontWeight = "bold";
    button.style.transition = "background-color 0.2s";

    button.onmouseover = () => button.style.backgroundColor = "#1d72c9";
    button.onmouseout = () => button.style.backgroundColor = "#258cf4";

    const errorMessage = document.createElement("p");
    errorMessage.style.color = "#ef4444";
    errorMessage.style.marginTop = "1rem";
    errorMessage.style.fontSize = "0.875rem";
    errorMessage.style.display = "none";

    // Assembly
    function init() {
        container.appendChild(title);
        container.appendChild(input);
        container.appendChild(button);
        container.appendChild(errorMessage);
        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Stop scrolling
        document.body.style.overflow = "hidden";

        // Focus input
        input.focus();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Logic
    function checkPassword() {
        if (input.value === PASSWORD) {
            sessionStorage.setItem(SESSION_KEY, "true");
            document.body.removeChild(overlay);
            document.body.style.overflow = ""; // Restore scrolling
        } else {
            errorMessage.textContent = "Incorrect password";
            errorMessage.style.display = "block";
            input.value = "";
            input.focus();
        }
    }

    button.onclick = checkPassword;
    input.onkeyup = (e) => {
        if (e.key === "Enter") checkPassword();
    };

})();
