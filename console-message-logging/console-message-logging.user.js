// ==UserScript==
// @name        ESO Console Message Logging
// @namespace   tttooottt
// @version     0.1.0
// @author      tttooottt
// @description Log messages in console
// @include     *://*.esonline.tk/
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/console-message-logging/console-message-logging.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/console-message-logging/console-message-logging.user.js
// @license     MIT
// @require     https://github.com/tttooottt/eso-userscripts/raw/master/libs/room-checker/room-checker.user.js
// ==/UserScript==

const MessageEvents = [
    'chat', 'tryMessage'
];

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

const RC = new ESORoomChecker;


function logMessage(event) {
    let details = event.detail;
    let sender = details.sender;

    let isTryMessage = details.reason == 'tryMessage';
    if (isTryMessage) {
        sender = details.id;
        console.log(details.success);
    }

    console.log(sender, RC.users.find(user => user.id == sender).name, details.message);
}


function initMod() {
    MessageEvents.map(eventCode => document.addEventListener(eventCode, logMessage));

    document.addEventListener(DisconnectEvent, () => {
        document.removeEventListener(ConnectEvent, initMod);
        MessageEvents.map(eventCode => document.removeEventListener(eventCode, logMessage));
    }, { 'once': true });

    console.log("ESO Console Message Logging initialized.");
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });
