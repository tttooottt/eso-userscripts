// ==UserScript==
// @name        ESO Dress Nodes Unlimited
// @namespace   tttooottt
// @version     0.1.1
// @author      tttooottt
// @description Dress in any node
// @match       *://*.esonline.su/
// @grant       unsafeWindow
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/dress-nodes/dress-nodes.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/dress-nodes/dress-nodes.user.js
// @license     MIT
// ==/UserScript==

const ConnectEvent = 'serverTimecode';

function initMod() {
	fetch(unsafeWindow.esoConfig.href + '/nodes')
	.then(function(response) {
		return response.json();
	}).then(function(data) {
		let nodes = [];
		for (const node of data.nodes) {
			nodes.push(node.code);
		}
		unsafeWindow.esoConfig.dressNodes = nodes;
	}).catch(function(err) {
		console.log(err);
	});
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });
