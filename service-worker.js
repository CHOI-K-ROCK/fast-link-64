// i18n
const tlm = (key) => chrome.i18n.getMessage(key);

// Create Context Menus
chrome.contextMenus.create({
    id: "parent",
    title: `Open Base64 Link`,
    contexts: ["selection"],
});

chrome.contextMenus.create({
    parentId: "parent",
    id: "linkto",
    title: tlm("redirectToLink"),
    contexts: ["selection"],
});

chrome.contextMenus.create({
    parentId: "parent",
    id: "clipboard",
    title: tlm("copyToClipboard"),
    contexts: ["selection"],
});

const checkIsLink = (string) => {
    return string.startsWith("http://") || string.startsWith("https://");
};

// Bridges / Update Context Menus
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { message, selected } = request;

    switch (message) {
        case "updateSelection": {
            try {
                const convertedBase64 = atob(selected);
                checkIsLink(convertedBase64);

                if (checkIsLink(convertedBase64)) {
                    chrome.contextMenus.update("parent", { title: convertedBase64, enabled: true });
                } else {
                    const slicedText = convertedBase64.slice(0, 10);
                    const presentString = selected.length > 10 ? slicedText + "..." : convertedBase64;

                    chrome.contextMenus.update("parent", {
                        title: `"${presentString}"${tlm("notALink")}`,
                        enabled: false,
                    });
                }
                break;
            } catch (err) {
                const slicedText = selected.slice(0, 10);
                const presentString = selected.length > 10 ? slicedText + "..." : selected;

                chrome.contextMenus.update("parent", {
                    title: `"${presentString}"${tlm("notBase64")}`,
                    enabled: false,
                });
            }
        }
    }
});

// Context Menus onClick Events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    try {
        const convertedBase64 = atob(info.selectionText);
        const isLink = checkIsLink(convertedBase64);

        switch (info.menuItemId) {
            case "linkto": {
                if (isLink) {
                    chrome.tabs.create({ url: convertedBase64 });
                }
                break;
            }
            case "clipboard": {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        message: "copyText",
                        textToCopy: convertedBase64,
                    });
                });
                break;
            }
        }
    } catch (error) {
        alert(error.message);
    }
});
