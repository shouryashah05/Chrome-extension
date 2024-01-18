import {getActiveTabURL} from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const addNewBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = bookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";

    bookmarkTitleElement.className = "book-title";

    addNewBookmarkElement.id = "bookmark-" + bookmark.time;
    addNewBookmarkElement.classname = "bookmark";
    NewBookmarkElement.setAttribute("timestamp", bookmark.time);

    //play and delete buttons
    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);


    addNewBookmarkElement.appendChild(bookmarkTitleElement);
    addNewBookmarkElement.appendChild(controlsElement)
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark)
        }
    } else{
        bookmarksElement.innerHTML = '<i class="row">No Bookmarks to show</i>'
    }
};

const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();

    chrome.tabs.sendMessage(activeTab.id,{
        type: "PLAY",
        value: bookmarkTime
    });
};

const onDelete = async e => {
    const activeTab = await getActiveTabURL();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById("bookmark-" + bookmarkTime);

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime
    }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");

    controlElement.src = "assests/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    containerParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if(activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]): [];
            
            viewBookmarks(currentVideoBookmarks);

        });
    } else {
        const container = document.getElementsByClassName("container")[0];
        
        container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
});

