chrome.contextMenus.create({
    id: "main",
    title: `BASE64 링크로 이동`,
    contexts: ["selection"],
});

// chrome.contextMenus.create({
//     parentId: "easy-base-64",
//     id: "linkto",
//     title: "해당 링크로 이동하기",
//     contexts: ["selection"],
// });

// chrome.contextMenus.create({
//     parentId: "easy-base-64",
//     id: "paste",
//     title: "클립보드에 복사하기",
//     contexts: ["selection"],
// });

// // 컨텍스트 메뉴 클릭 시 동작할 함수 등록
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    try {
        const convertedBase64 = atob(info.selectionText);
        const isLink = convertedBase64.startsWith("http://") || convertedBase64.startsWith("https://");

        switch (info.menuItemId) {
            case "main": {
                if (isLink) {
                    chrome.tabs.create({ url: convertedBase64 });
                }
                break;
            }
            // case "linkto": {
            //     break;
            // }
            // case "paste": {
            //     break;
            // }
        }
    } catch (error) {
        if (error.message.startsWith("Failed to execute 'atob'")) {
            alert("선택된 문자열을 base64 로 변환할 수 없습니다.");
        } else {
            alert(error.message);
        }
    }
});
