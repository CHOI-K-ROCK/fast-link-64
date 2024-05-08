document.addEventListener("mousedown", (event) => {
    if (event.button !== 2) {
        return false;
    }
    const selected = window.getSelection().toString();
    if (event.button == 2 && selected != "") {
        chrome.runtime.sendMessage({
            message: "updateSelection",
            selected,
        });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { message, textToCopy, alertMsg } = request;
    switch (message) {
        case "copyText": {
            navigator.clipboard.writeText(textToCopy);
            break;
        }
        case "alert": {
            alert(alertMsg);
            break;
        }
    }
});


