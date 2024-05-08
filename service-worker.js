chrome.contextMenus.create({
    id: "parent",
    title: `Open Base64 Link`,
    contexts: ["selection"],
});

chrome.contextMenus.create({
    parentId: "parent",
    id: "linkto",
    title: `링크로 이동`,
    contexts: ["selection"],
});

chrome.contextMenus.create({
    parentId: "parent",
    id: "clipboard",
    title: `클립보드에 복사`,
    contexts: ["selection"],
});

const checkIsLink = (string) => {
    return string.startsWith("http://") || string.startsWith("https://");
};

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
                        title: `"${presentString}" 는 링크 형식이 아닙니다.`,
                        enabled: false,
                    });
                }
                break;
            } catch (err) {
                const slicedText = selected.slice(0, 10);
                const presentString = selected.length > 10 ? slicedText + "..." : selected;

                chrome.contextMenus.update("parent", {
                    title: `"${presentString}" 는 base64 가 아닙니다.`,
                    enabled: false,
                });
            }
        }
    }
});

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
