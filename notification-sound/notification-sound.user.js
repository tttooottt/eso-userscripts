// ==UserScript==
// @name        ESO Notification Sound
// @namespace   tttooottt
// @version     0.1.0
// @author      tttooottt
// @description Play sound on conditions
// @match       *://*.esonline.su/
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/notification-sound/notification-sound.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/notification-sound/notification-sound.user.js
// @license     MIT
// ==/UserScript==

const MessageEvents = [
	'chat', 'tryMessage'//, 'userRoll', 'diceResult', 'youtubePlaying'
];

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

function initMod() {
	const messagesHandler = (e) => {
        //const whitelist = ['Гера'];
        //const condition = whitelist.includes(e.detail._user?.name);
        const condition = !document.hasFocus();
        //const re = /(?:^|\p{Z}|\p{P})(?:愛|[вВ][иИ])(?:$|\p{Z}|\p{P})/u;
        //const condition = re.test(e.detail.message);
		if(!condition) return;
        let a = new Audio('https://audio-previews.elements.envatousercontent.com/files/105394911/preview.mp3');
        a.volume = 0.7;
        a.addEventListener("canplaythrough", () => a.play());
	}

	MessageEvents.map(eventCode => document.addEventListener(eventCode, messagesHandler));

	document.addEventListener(DisconnectEvent, () => {
		document.removeEventListener(ConnectEvent, initMod);
		MessageEvents.map(eventCode => document.removeEventListener(eventCode, messagesHandler));
	}, { 'once': true })
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });
