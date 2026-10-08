document.addEventListener("keydown", event => {
    if (event.code !== "Space" || event.target?.id !== "answer-input") {
        return;
    }

    event.preventDefault();
    document.querySelector(".next-button")?.click();
});
