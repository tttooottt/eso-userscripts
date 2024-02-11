// ==UserScript==
// @name        ESO Text-to-Speech
// @namespace   tttooottt
// @version     0.1.3
// @author      tttooottt
// @description Use speech synthesis for chat messages
// @match       *://*.esonline.su/
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/chat-speech/chat-speech.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/chat-speech/chat-speech.user.js
// @license     MIT
// ==/UserScript==

const MessageEvents = [
	'chat', 'tryMessage'
];

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';

function initMod() {
	const messagesHandler = (e) => {
		let text = e.detail.message.replaceAll(/\/|\\|\*/g,'');
		let utter = new SpeechSynthesisUtterance(text);
		utter.lang = 'ru';
		speechSynthesis.speak(utter);
	}

	MessageEvents.map(eventCode => document.addEventListener(eventCode, messagesHandler));

	document.addEventListener(DisconnectEvent, () => {
		document.removeEventListener(ConnectEvent, initMod);
		MessageEvents.map(eventCode => document.removeEventListener(eventCode, messagesHandler));
	}, { 'once': true })
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });
