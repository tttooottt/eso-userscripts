// ==UserScript==
// @name        ESO Notifier
// @namespace   tttooottt
// @version     0.1.1
// @author      tttooottt
// @description Usercript for https://github.com/questionableprofile/esnotifier support
// @include     *://www.esonline.cf/
// @connect     localhost
// @grant       GM_xmlhttpRequest
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/notifier/notifier.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/notifier/notifier.user.js
// @license     MIT
// @require     https://github.com/tttooottt/eso-userscripts/raw/master/libs/room-checker/room-checker.user.js
// ==/UserScript==

const ServerPort = 9673;

const MessageEvents = [
    'chat', 'tryMessage', 'userRoll', 'diceResult', 'youtubePlaying'
];

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

const RC = new ESORoomChecker;

var currentNode;

function sendData(details) {
    const actorId = details.id || details.sender || details.author; 

    const _data = {
        "code": details.reason,
        "data": {
            "gameData": {
                "node": currentNode
            },
            "eventData": details,
            "actor": {
                "id": actorId,
                "name": RC.users.find(user => user.id == actorId).name
            }
        }
    }

    GM_xmlhttpRequest({
        method: "POST",
        url: `http://localhost:${ServerPort}/event`,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(_data)
    });
}

function initMod() {
    // Update current node
    function updateCurrentNode(event) {
        currentNode = event.detail.code;
    }

    document.addEventListener('nodeData', updateCurrentNode);


    // Send data to server
    function messagesHandler(event) {
        const isMuted = unsafeWindow._muted && unsafeWindow._muted.find(
            mutedPlayer => mutedPlayer.id == event.detail.sender);
        if (isMuted) return;

        sendData(event.detail);
    }

    MessageEvents.map(eventCode => document.addEventListener(eventCode, messagesHandler));
}

document.addEventListener(ConnectEvent, initMod, {
    'once': true
});
