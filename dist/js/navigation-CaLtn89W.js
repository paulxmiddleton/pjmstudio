class a{constructor(){this.nav=null,this.navTrigger=null,this.navContent=null,this.navClose=null,this.isOpen=!1,this.developmentMode=this.isDevelopmentMode(),this.lockedSections=this.getLockedSections(),this.init()}isDevelopmentMode(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="3001"||window.location.port==="3000"}getLockedSections(){return{"/store.html":{locked:!0,status:"UNDER_DEVELOPMENT",message:"E-commerce integration in progress"},"/portfolio/videography.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/photography.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/video-editing.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/graphic-design.html":{locked:!1,status:"ACTIVE",message:null}}}init(){if(this.nav=document.querySelector(".floating-nav"),this.navTrigger=document.getElementById("navTrigger"),this.navContent=document.getElementById("navContent"),this.navClose=document.getElementById("navClose"),!this.nav||!this.navTrigger||!this.navContent){console.warn("Floating navigation elements not found");return}this.setupEventListeners(),this.setActivePage(),this.addSystemVariations(),this.developmentMode&&this.applyDevelopmentLocks(),console.log("Floating navigation initialized")}setupEventListeners(){this.navTrigger.addEventListener("click",e=>{e.preventDefault(),this.toggleNavigation()}),this.navClose&&this.navClose.addEventListener("click",e=>{e.preventDefault(),this.closeNavigation()}),document.addEventListener("click",e=>{this.isOpen&&!this.nav.contains(e.target)&&this.closeNavigation()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.closeNavigation()}),this.navContent.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",t=>{const n=e.getAttribute("href");if(this.developmentMode&&this.isLocked(n)){t.preventDefault(),this.showAccessDenied(n);return}setTimeout(()=>{this.closeNavigation()},150)})})}toggleNavigation(){this.isOpen?this.closeNavigation():this.openNavigation()}openNavigation(){this.nav.classList.add("nav-open"),this.navTrigger.classList.add("active"),document.body.classList.add("nav-open"),this.isOpen=!0,this.navContent.classList.add("opening"),setTimeout(()=>{this.navContent.classList.remove("opening")},300)}closeNavigation(){this.nav.classList.remove("nav-open"),this.navTrigger.classList.remove("active"),document.body.classList.remove("nav-open"),this.isOpen=!1,this.navContent.classList.add("closing"),setTimeout(()=>{this.navContent.classList.remove("closing")},300)}setActivePage(){const o=window.location.pathname,e=this.navContent.querySelectorAll(".nav-link");e.forEach(t=>t.classList.remove("active")),e.forEach(t=>{const n=t.getAttribute("href");(o==="/"&&n==="/index.html"||o==="/index.html"&&n==="/index.html"||o==="/home.html"&&n==="/home.html"||o==="/home"&&n==="/home.html"||o.includes("/portfolio/directing")&&n==="/portfolio/directing.html"||o.includes("/portfolio/videography")&&n==="/portfolio/videography.html"||o.includes("/portfolio/photography")&&n==="/portfolio/photography.html"||o.includes("/portfolio/video-editing")&&n==="/portfolio/video-editing.html"||o.includes("/portfolio/graphic-design")&&n==="/portfolio/graphic-design.html"||o.includes("/store")&&n==="/store.html")&&t.classList.add("active")})}addSystemVariations(){const o=["standard","industrial","minimal"],e=o[Math.floor(Math.random()*o.length)];this.nav.classList.add(`nav-${e}`);const t=this.navContent.querySelector(".status-text");t&&(t.textContent=`SYSTEM_${e.toUpperCase()}`),this.addSystemIndicators(e),console.log(`Navigation variation: ${e}`)}addSystemIndicators(o){const e=this.navContent.querySelector(".nav-header");if(!e)return;const t=document.createElement("div");switch(t.className="system-indicator",o){case"industrial":t.innerHTML='<span class="indicator-text">SYS_IND</span>';break;case"minimal":t.innerHTML='<span class="indicator-line"></span>';break;default:t.innerHTML='<span class="indicator-dot"></span>'}e.appendChild(t)}isLocked(o){const e=this.lockedSections[o];return e&&e.locked}showAccessDenied(o){const e=this.lockedSections[o];e&&this.createAccessDeniedModal(e)}createAccessDeniedModal(o){const e=document.querySelector(".access-denied-modal");e&&e.remove();const t=document.createElement("div");t.className="access-denied-modal",t.innerHTML=`
            <div class="modal-content">
                <div class="modal-header">
                    <span class="modal-title">ACCESS_DENIED</span>
                    <span class="modal-status">${o.status}</span>
                </div>
                <div class="modal-body">
                    <p class="modal-message">${o.message}</p>
                    <p class="modal-info">This section is temporarily locked during development.</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-close brutalist-button">CLOSE</button>
                </div>
            </div>
        `;const n=document.createElement("style");n.textContent=`
            .access-denied-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: modalFadeIn 0.3s ease;
            }
            
            .modal-content {
                background: #000;
                border: 2px solid #3300ff;
                max-width: 500px;
                margin: 20px;
                font-family: 'Courier New', monospace;
                color: #fff;
            }
            
            .modal-header {
                background: #3300ff;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-title {
                font-weight: bold;
                font-size: 16px;
            }
            
            .modal-status {
                font-size: 12px;
                opacity: 0.8;
            }
            
            .modal-body {
                padding: 20px;
                line-height: 1.4;
            }
            
            .modal-message {
                margin: 0 0 10px 0;
                font-weight: bold;
            }
            
            .modal-info {
                margin: 0;
                opacity: 0.7;
                font-size: 14px;
            }
            
            .modal-footer {
                padding: 15px 20px;
                text-align: right;
                border-top: 1px solid #333;
            }
            
            .brutalist-button {
                background: #3300ff;
                color: #fff;
                border: none;
                padding: 8px 16px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .brutalist-button:hover {
                background: #4400cc;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `,document.head.appendChild(n),document.body.appendChild(t),t.querySelector(".modal-close").addEventListener("click",()=>{t.remove(),n.remove()}),t.addEventListener("click",s=>{s.target===t&&(t.remove(),n.remove())}),setTimeout(()=>{document.body.contains(t)&&(t.remove(),n.remove())},5e3)}applyDevelopmentLocks(){this.navContent.querySelectorAll(".nav-link").forEach(e=>{const t=e.getAttribute("href"),n=this.lockedSections[t];if(n&&n.locked){e.classList.add("nav-locked");const i=document.createElement("span");i.className="lock-indicator",i.textContent=" [LOCKED]",e.appendChild(i),e.style.opacity="0.5",e.style.textDecoration="line-through"}}),console.log("Development locks applied")}open(){this.openNavigation()}close(){this.closeNavigation()}toggle(){this.toggleNavigation()}isNavigationOpen(){return this.isOpen}lockSection(o,e="LOCKED",t="Section temporarily unavailable"){this.lockedSections[o]?(this.lockedSections[o].locked=!0,this.lockedSections[o].status=e,this.lockedSections[o].message=t):this.lockedSections[o]={locked:!0,status:e,message:t},this.developmentMode&&this.applyDevelopmentLocks()}unlockSection(o){this.lockedSections[o]&&(this.lockedSections[o].locked=!1,this.lockedSections[o].status="ACTIVE",this.lockedSections[o].message=null),this.navContent.querySelectorAll(".nav-link").forEach(t=>{if(t.getAttribute("href")===o){t.classList.remove("nav-locked"),t.style.opacity="",t.style.textDecoration="";const n=t.querySelector(".lock-indicator");n&&n.remove()}})}}document.addEventListener("DOMContentLoaded",()=>{window.floatingNav=new a});
