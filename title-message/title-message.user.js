// ==UserScript==
// @name        ESO Title Message
// @namespace   tttooottt
// @version     0.1.3
// @author      tttooottt
// @include     *://www.esonline.cf/
// @grant       unsafeWindow
// @updateURL   
// @downloadURL 
// @license     MIT
// ==/UserScript==

var messagesCount = 0;

function updateTitle() {
    document.title = messagesCount ? `(${messagesCount}) ESO` : "ESO";
}

function updateMessagesCount(timeout) {
    messagesCount++;
    setTimeout(function () {
        messagesCount--;
        updateTitle();
    }, timeout);
}

function initMod() {
    const messages = document.getElementsByClassName("messages")[0];
    const chatTimeout = unsafeWindow.esoConfig.chatMsgClearTimeout;
    
    function messagesHandler(event) {
        const isMuted = unsafeWindow._muted && unsafeWindow._muted.find(
            mutedPlayer => mutedPlayer.id == event.detail.sender);
        if(isMuted) return;
        
        updateMessagesCount(chatTimeout);
        updateTitle();
    }

    document.addEventListener("chat", messagesHandler);
    document.addEventListener("tryMessage", messagesHandler);
    document.addEventListener("userRoll", messagesHandler);
    document.addEventListener("diceResult", messagesHandler);
}

document.addEventListener("serverTimecode", initMod, {
    'once': true
});
