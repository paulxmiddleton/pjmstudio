import{b as a,d as l}from"./dom-utils-UozHuNU6.js";class c{constructor(){this.nav=null,this.navTrigger=null,this.navContent=null,this.navClose=null,this.isOpen=!1,this.developmentMode=this.isDevelopmentMode(),this.lockedSections=this.getLockedSections(),this.init()}isDevelopmentMode(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="3001"||window.location.port==="3000"}getLockedSections(){return{"/store.html":{locked:!0,status:"UNDER_DEVELOPMENT",message:"E-commerce integration in progress"},"/portfolio/videography.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/photography.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/video-editing.html":{locked:!1,status:"ACTIVE",message:null},"/portfolio/graphic-design.html":{locked:!1,status:"ACTIVE",message:null}}}init(){if(this.nav=document.querySelector(".floating-nav"),this.navTrigger=document.getElementById("navTrigger"),this.navContent=document.getElementById("navContent"),this.navClose=document.getElementById("navClose"),!this.nav||!this.navTrigger||!this.navContent){console.warn("Floating navigation elements not found");return}this.setupEventListeners(),this.setActivePage(),this.addSystemVariations(),this.developmentMode&&this.applyDevelopmentLocks(),console.log("Floating navigation initialized")}setupEventListeners(){this.navTrigger.addEventListener("click",e=>{e.preventDefault(),this.toggleNavigation()}),this.navClose&&this.navClose.addEventListener("click",e=>{e.preventDefault(),this.closeNavigation()}),document.addEventListener("click",e=>{this.isOpen&&!this.nav.contains(e.target)&&this.closeNavigation()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.closeNavigation()}),this.navContent.querySelectorAll(".nav-link").forEach(e=>{e.addEventListener("click",o=>{const i=e.getAttribute("href");if(this.developmentMode&&this.isLocked(i)){o.preventDefault(),this.showAccessDenied(i);return}setTimeout(()=>{this.closeNavigation()},150)})})}toggleNavigation(){this.isOpen?this.closeNavigation():this.openNavigation()}openNavigation(){this.nav.classList.add("nav-open"),this.navTrigger.classList.add("active"),document.body.classList.add("nav-open"),this.isOpen=!0,this.navContent.classList.add("opening"),setTimeout(()=>{this.navContent.classList.remove("opening")},300)}closeNavigation(){this.nav.classList.remove("nav-open"),this.navTrigger.classList.remove("active"),document.body.classList.remove("nav-open"),this.isOpen=!1,this.navContent.classList.add("closing"),setTimeout(()=>{this.navContent.classList.remove("closing")},300)}setActivePage(){const t=window.location.pathname,e=this.navContent.querySelectorAll(".nav-link");e.forEach(o=>o.classList.remove("active")),e.forEach(o=>{const i=o.getAttribute("href");(t==="/"&&i==="/index.html"||t==="/index.html"&&i==="/index.html"||t==="/home.html"&&i==="/home.html"||t==="/home"&&i==="/home.html"||t.includes("/portfolio/directing")&&i==="/portfolio/directing.html"||t.includes("/portfolio/videography")&&i==="/portfolio/videography.html"||t.includes("/portfolio/photography")&&i==="/portfolio/photography.html"||t.includes("/portfolio/video-editing")&&i==="/portfolio/video-editing.html"||t.includes("/portfolio/graphic-design")&&i==="/portfolio/graphic-design.html"||t.includes("/store")&&i==="/store.html")&&o.classList.add("active")})}addSystemVariations(){const t=["standard","industrial","minimal"],e=t[Math.floor(Math.random()*t.length)];this.nav.classList.add(`nav-${e}`);const o=this.navContent.querySelector(".status-text");o&&(o.textContent=`SYSTEM_${e.toUpperCase()}`),this.addSystemIndicators(e),console.log(`Navigation variation: ${e}`)}addSystemIndicators(t){const e=this.navContent.querySelector(".nav-header");if(!e)return;const o=a(t);e.appendChild(o)}isLocked(t){const e=this.lockedSections[t];return e&&e.locked}showAccessDenied(t){const e=this.lockedSections[t];e&&this.createAccessDeniedModal(e)}createAccessDeniedModal(t){const e=document.querySelector(".access-denied-modal");e&&e.remove();const o=l(t),i=document.createElement("style");i.textContent=`
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
        `,document.head.appendChild(i),document.body.appendChild(o),o.querySelector(".modal-close").addEventListener("click",()=>{o.remove(),i.remove()}),o.addEventListener("click",s=>{s.target===o&&(o.remove(),i.remove())}),setTimeout(()=>{document.body.contains(o)&&(o.remove(),i.remove())},5e3)}applyDevelopmentLocks(){this.navContent.querySelectorAll(".nav-link").forEach(e=>{const o=e.getAttribute("href"),i=this.lockedSections[o];if(i&&i.locked){e.classList.add("nav-locked");const n=document.createElement("span");n.className="lock-indicator",n.textContent=" [LOCKED]",e.appendChild(n),e.style.opacity="0.5",e.style.textDecoration="line-through"}}),console.log("Development locks applied")}open(){this.openNavigation()}close(){this.closeNavigation()}toggle(){this.toggleNavigation()}isNavigationOpen(){return this.isOpen}lockSection(t,e="LOCKED",o="Section temporarily unavailable"){this.lockedSections[t]?(this.lockedSections[t].locked=!0,this.lockedSections[t].status=e,this.lockedSections[t].message=o):this.lockedSections[t]={locked:!0,status:e,message:o},this.developmentMode&&this.applyDevelopmentLocks()}unlockSection(t){this.lockedSections[t]&&(this.lockedSections[t].locked=!1,this.lockedSections[t].status="ACTIVE",this.lockedSections[t].message=null),this.navContent.querySelectorAll(".nav-link").forEach(o=>{if(o.getAttribute("href")===t){o.classList.remove("nav-locked"),o.style.opacity="",o.style.textDecoration="";const i=o.querySelector(".lock-indicator");i&&i.remove()}})}}document.addEventListener("DOMContentLoaded",()=>{window.floatingNav=new c});
