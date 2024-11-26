// ==UserScript==
// @name        ESO Beautify ll
// @namespace   tttooottt
// @version     0.1.2
// @author      tttooottt
// @description Beautify ll
// @match       *://*.esonline.su/
// @grant       GM_addStyle
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/beautify-ll/beautify-ll.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/beautify-ll/beautify-ll.user.js
// @license     MIT
// @require     https://github.com/tttooottt/eso-userscripts/raw/master/libs/room-checker/room-checker.user.js
// ==/UserScript==

GM_addStyle(`
.context-menu:has(.messages) {
  padding: 0 !important;
  height: unset !important;
  width: unset !important;
  max-width: 95%;

  .messages {
    max-height: 90vh;
  }

  .messages-wrapper {
    position: unset !important;
  }
  .msg {
    background: none !important;;
    width: max-content;
    max-width: unset;
  }
}

.context-menu:has(.messages)::after {
  content: attr(players-count);
  color: white;
  position: absolute;
  right: 0;
  bottom: 0;
  transform: translate(100%, 100%);
}`);

const ConnectEvent = 'serverTimecode';
const DisconnectEvent = 'esoDisconnected';
const UpdateEvents = ['nodeData', 'userJoin', 'userLeave'];

const room = new ESORoom();

function initMod() {
    let contextMenu;
    const mo = new MutationObserver(ms => {
        ms.forEach(m => {
            if (!m.addedNodes[0]?.classList?.contains("context-menu-wrapper")) {
                return;
            }
            const msg = m.addedNodes[0].querySelector(".msg");
            if (!msg || !(msg.childElementCount === 1)) {
                return;
            }

            contextMenu = m.addedNodes[0].firstChild;
            contextMenu.setAttribute("players-count", room.users.length);
        })
    });

    const updatesHandler = () => {
        if (!contextMenu) {
            return;
        }
        contextMenu.setAttribute("players-count", room.users.length);
    };

    mo.observe(document.querySelector(".screens"), {childList: true, subtree: true});

    UpdateEvents.map(eventCode => document.addEventListener(eventCode, updatesHandler));

    document.addEventListener(DisconnectEvent, () => {
        document.removeEventListener(ConnectEvent, initMod);
        UpdateEvents.map(eventCode => document.removeEventListener(eventCode, updatesHandler));
        mo.disconnect();
    }, { 'once': true })
}

document.addEventListener(ConnectEvent, initMod, { 'once': true });
