// ==UserScript==
// @name        ESO Disconnect Sound
// @namespace   tttooottt
// @version     0.1.0
// @author      tttooottt
// @description Roar on disconnect
// @match       *://*.esonline.su/
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/disconnect-sound/disconnect-sound.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/disconnect-sound/disconnect-sound.user.js
// @license     MIT
// ==/UserScript==

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

function initMod() {
    document.addEventListener(DisconnectEvent, () => {
        const audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.addEventListener("canplaythrough", () => audio.play());
        document.removeEventListener(ConnectEvent, initMod);
    }, { 'once': true });
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });