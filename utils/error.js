
function showError(message){
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-div");
    errorDiv.innerHTML = message;
    errorDiv.addEventListener("click", () => {
        errorDiv.classList.add("hidden");
    });
    document.body.append(errorDiv)
}
