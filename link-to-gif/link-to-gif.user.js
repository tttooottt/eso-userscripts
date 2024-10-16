// ==UserScript==
// @name        ESO Link to GIF
// @namespace   tttooottt
// @version     0.1.1
// @author      tttooottt
// @description Link in chat to GIF
// @match       *://*.esonline.su/
// @grant       GM_addStyle
// @updateURL   https://github.com/tttooottt/eso-userscripts/raw/master/link-to-gif/link-to-gif.user.js
// @downloadURL https://github.com/tttooottt/eso-userscripts/raw/master/link-to-gif/link-to-gif.user.js
// @license     MIT
// ==/UserScript==

GM_addStyle ( `
    .mini-gif {
        max-height: 64px;
        max-width: 64px;
    }
    
    .gif-preview {
        position: fixed;
        top: 0;
        right: 0;
        max-width: 50%;
        max-height: 100%;
        z-index:99;
    }` );
    
    const ConnectEvent = 'serverTimecode';
    const DisconnectEvent = 'esoDisconnected';
    
    const re = /^https:\/\/.+\.[a-z]+\/.+\.(?:png|gif|jpg|jpeg)$/;
    
    function initMod() {
        const m = document.querySelector('.messages');
        const obs = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                const msg = mutation.addedNodes[0]?.children[1];
                if (msg === undefined) return;
                if (re.test(msg.textContent)) {
                    const gif = elementFromHTML(htmlMiniGif(msg.textContent));
    
                    gif.addEventListener("mouseover", () => {
                        const preview = elementFromHTML(`<img src="${msg.textContent}" class="gif-preview"/>`);
                        preview.classList.add("gif-preview");
                        document.body.appendChild(preview);
                    });
                    gif.addEventListener("mouseout", () => {
                        document.querySelector(".gif-preview").remove();
                    });
    
                    msg.replaceWith(gif);
                }
                function htmlMiniGif(link) {
                    return `<a href="${link}" target="_blank" rel="noopener noreferrer"><img src="${link}" class="mini-gif"/></a>`;
                }
                function elementFromHTML(html) {
                    const template = document.createElement("template");
                    template.innerHTML = html;
                    return template.content.firstChild;
                }
            });
        });
        obs.observe(m, { childList: true });
    
        document.addEventListener(DisconnectEvent, () => {
            obs.disconnect();
            document.removeEventListener(ConnectEvent, initMod);
        }, { 'once': true });
    }
    
    document.addEventListener(ConnectEvent, initMod, { 'once': true });
    