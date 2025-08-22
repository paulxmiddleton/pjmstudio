class i{constructor(){this.accessPassword="pjm2025dev",this.accessKey="pjm_studio_access",this.publicPages=["/","/index.html","/ascii-video","/ascii-video.html"],this.init()}init(){this.needsProtection()&&(this.hasAccess()?console.log("🔓 Access granted - Welcome back"):this.showLockoutScreen())}needsProtection(){const e=window.location.pathname;return!this.publicPages.some(t=>t==="/"?e==="/"||e==="/index.html":e===t||e.startsWith(t))}hasAccess(){const e=sessionStorage.getItem(this.accessKey);if(!e)return!1;try{const t=JSON.parse(e),s=new Date().getTime();return t.expires>s}catch{return!1}}grantAccess(){const t={granted:!0,expires:new Date().getTime()+864e5,timestamp:new Date().getTime()};sessionStorage.setItem(this.accessKey,JSON.stringify(t))}showLockoutScreen(){document.body.style.overflow="hidden";const e=this.createLockoutOverlay();document.body.appendChild(e),setTimeout(()=>{const t=e.querySelector("#accessPassword");t&&t.focus()},300)}createLockoutOverlay(){const e=document.createElement("div");return e.className="access-lockout-overlay",e.innerHTML=`
            <div class="lockout-container">
                <div class="lockout-header">
                    <h1 class="lockout-title">PJM.STUDIO</h1>
                </div>
                
                <div class="lockout-content">
                    <div class="lockout-message">
                        <h2>Development Access</h2>
                        <p>This section is currently under development.<br>
                        Enter password to access work-in-progress content.</p>
                    </div>
                    
                    <div class="lockout-form">
                        <input 
                            type="password" 
                            id="accessPassword" 
                            placeholder="development password"
                            class="password-input"
                            autocomplete="off"
                        >
                        <button id="accessSubmit" class="access-button">ACCESS</button>
                        <div id="accessError" class="access-error"></div>
                    </div>
                </div>
                
                <div class="lockout-footer">
                    <div class="public-links">
                        <a href="/" class="public-link">← return to landing</a>
                        <a href="/ascii-video" class="public-link">ascii lab →</a>
                    </div>
                    <div class="lockout-info">
                        Development build • Session-based access
                    </div>
                </div>
            </div>
        `,this.addLockoutStyles(),this.setupLockoutEvents(e),e}setupLockoutEvents(e){const t=e.querySelector("#accessPassword"),s=e.querySelector("#accessSubmit"),o=e.querySelector("#accessError"),n=()=>{t.value.trim()===this.accessPassword?(this.grantAccess(),o.innerHTML='<span style="color: #00ff00;">✓ Access granted</span>',setTimeout(()=>{e.remove(),document.body.style.overflow="",window.location.reload()},800)):(o.innerHTML='<span style="color: #ff0000;">× Incorrect password</span>',t.value="",t.focus(),setTimeout(()=>{o.innerHTML=""},3e3))};s.addEventListener("click",n),t.addEventListener("keypress",r=>{r.key==="Enter"&&n()})}addLockoutStyles(){if(document.getElementById("access-lockout-styles"))return;const e=document.createElement("style");e.id="access-lockout-styles",e.textContent=`
            .access-lockout-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #3300ff;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
            }

            .lockout-container {
                max-width: 400px;
                width: 90%;
                text-align: center;
                color: white;
                padding: 2rem;
            }

            .lockout-header {
                margin-bottom: 2rem;
            }

            .lockout-title {
                font-size: 2rem;
                font-weight: normal;
                letter-spacing: 2px;
                margin: 0;
                line-height: 1.2;
                font-family: Arial, sans-serif;
            }

            .lockout-content {
                margin-bottom: 2rem;
            }

            .lockout-message h2 {
                font-size: 1.2rem;
                letter-spacing: 1px;
                margin: 0 0 1rem 0;
                font-weight: normal;
                font-family: Arial, sans-serif;
            }

            .lockout-message p {
                font-family: Arial, sans-serif;
                font-size: 0.9rem;
                line-height: 1.4;
                opacity: 0.9;
                margin: 0 0 1.5rem 0;
            }

            .lockout-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }

            .password-input {
                width: 100%;
                max-width: 250px;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                text-align: center;
                font-family: Arial, sans-serif;
            }

            .password-input::placeholder {
                color: rgba(255, 255, 255, 0.6);
                font-family: Arial, sans-serif;
            }

            .password-input:focus {
                outline: none;
                border-color: rgba(255, 255, 255, 0.8);
                background: rgba(255, 255, 255, 0.15);
            }

            .access-button {
                padding: 0.75rem 1.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                font-size: 0.9rem;
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: Arial, sans-serif;
            }

            .access-button:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.6);
            }

            .access-error {
                min-height: 1.5rem;
                font-family: Arial, sans-serif;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .lockout-footer {
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 2rem;
                margin-top: 2rem;
            }

            .public-links {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
                gap: 1rem;
            }

            .public-link {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                font-size: 0.875rem;
                transition: opacity 0.2s ease;
                font-family: Arial, sans-serif;
            }

            .public-link:hover {
                opacity: 1;
                color: white;
            }

            .lockout-info {
                font-size: 0.75rem;
                opacity: 0.6;
                font-family: Arial, sans-serif;
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .lockout-container {
                    padding: 1.5rem;
                }

                .lockout-title {
                    font-size: 1.5rem;
                    letter-spacing: 1px;
                }

                .public-links {
                    flex-direction: column;
                    text-align: center;
                    gap: 0.5rem;
                }
            }
        `,document.head.appendChild(e)}static isDevelopmentMode(){return window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.port==="3000"||window.location.port==="3001"}}typeof window<"u"&&(i.isDevelopmentMode()?console.log("🔧 Development mode - Access control disabled"):document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{new i}):new i);
