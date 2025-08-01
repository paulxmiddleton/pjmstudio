import"./modulepreload-polyfill-B5Qt9EMX.js";class o{constructor(){this.loadingScreen=document.getElementById("loadingScreen"),this.init()}init(){setTimeout(()=>{this.hideLoading()},500)}hideLoading(){this.loadingScreen&&(this.loadingScreen.classList.add("fade-out"),setTimeout(()=>{this.loadingScreen.style.display="none",document.body.style.opacity="1"},500))}}class r{constructor(){this.loadingManager=new o,this.initStore(),this.initEventListeners(),this.initBrutalistEffects(),this.initTerminalEffects()}initStore(){this.shopifyDomain="pjm-studio.myshopify.com",this.apiAccessToken="",this.currentCategory="all",this.products=this.getAllProducts(),this.terminalLines=[],this.glitchInterval=null,this.scanlineElement=null,console.log("Store initialized with",this.products.length,"products"),this.updateTerminalStatus()}initEventListeners(){document.querySelectorAll(".filter-btn").forEach(i=>{i.addEventListener("click",a=>{this.handleCategoryFilter(a.target.dataset.category)})});const e=document.querySelector(".signup-btn");e&&e.addEventListener("click",this.handleNewsletterSignup.bind(this)),document.querySelectorAll(".add-to-cart-btn").forEach(i=>{i.addEventListener("click",this.handleProductAction.bind(this))})}getAllProducts(){return document.querySelectorAll(".product-card")}handleCategoryFilter(t){document.querySelectorAll(".filter-btn").forEach(e=>{e.classList.remove("active")}),document.querySelector(`[data-category="${t}"]`).classList.add("active"),this.currentCategory=t,this.products.forEach(e=>{const n=e.dataset.category;t==="all"||n===t?(e.style.display="block",setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},100)):(e.style.opacity="0",e.style.transform="translateY(20px)",setTimeout(()=>{e.style.display="none"},300))}),console.log(`Filtered to category: ${t}`),this.updateFilterStatus(t),this.triggerTerminalGlitch()}handleNewsletterSignup(){const e=document.querySelector(".email-input").value.trim();if(!e){this.showNotification("Please enter your email address","error");return}if(!this.isValidEmail(e)){this.showNotification("Please enter a valid email address","error");return}this.simulateNewsletterSignup(e)}simulateNewsletterSignup(t){const e=document.querySelector(".signup-btn"),n=e.textContent;e.textContent="Signing up...",e.disabled=!0,setTimeout(()=>{e.textContent="✓ Subscribed!",e.style.background="#3300ff",this.showNotification("Successfully subscribed! You'll be notified when the store launches.","success"),document.querySelector(".email-input").value="",setTimeout(()=>{e.textContent=n,e.disabled=!1,e.style.background=""},3e3)},1500),console.log(`Newsletter signup for: ${t}`)}handleProductAction(t){const e=t.target.closest(".product-card"),n=e.querySelector(".product-title").textContent;t.target.disabled?this.showNotification(`${n} is coming soon! Sign up for our newsletter to be notified.`,"info"):t.target.classList.contains("test-product")?this.handleTestProduct(t.target,e):this.addToCart(e)}handleTestProduct(t,e){const n=e.querySelector(".product-title").textContent,i=t.textContent;t.textContent="Adding...",t.disabled=!0,setTimeout(()=>{t.textContent="✓ Added to Cart!",t.style.background="#3300ff",this.showNotification(`${n} added to cart! (This is a demo - no actual purchase will be made)`,"success"),setTimeout(()=>{t.textContent=i,t.disabled=!1,t.style.background=""},3e3)},1e3)}addToCart(t){const e=t.querySelector(".product-title").textContent;console.log(`Adding to cart: ${e}`),this.showNotification(`${e} added to cart!`,"success")}isValidEmail(t){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)}showNotification(t,e="info"){const n=document.createElement("div");n.className=`store-notification ${e}`,n.innerHTML=`
            <div class="notification-content">
                <span class="notification-message">${t}</span>
                <button class="notification-close">&times;</button>
            </div>
        `,Object.assign(n.style,{position:"fixed",top:"100px",right:"20px",background:e==="success"?"#3300ff":e==="error"?"#ff0000":"#ff00f6",color:"white",padding:"1rem 1.5rem",borderRadius:"8px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",zIndex:"10000",opacity:"0",transform:"translateX(100%)",transition:"all 0.3s ease",fontFamily:"Cinzel, serif",fontSize:"0.9rem",maxWidth:"400px"}),document.body.appendChild(n),setTimeout(()=>{n.style.opacity="1",n.style.transform="translateX(0)"},100),n.querySelector(".notification-close").addEventListener("click",()=>{this.hideNotification(n)}),setTimeout(()=>{this.hideNotification(n)},5e3)}hideNotification(t){t&&t.parentNode&&(t.style.opacity="0",t.style.transform="translateX(100%)",setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},300))}initBrutalistEffects(){this.createScanlines(),this.initGlitchEffects(),this.addSystemIndicators(),this.initDataStreams()}initTerminalEffects(){this.initTerminalTyping(),this.addRandomSystemMessages(),this.createDataFlowAnimation()}createScanlines(){const t=document.createElement("div");t.className="scanlines",t.innerHTML='<div class="scanline"></div>'.repeat(5);const e=document.createElement("style");e.textContent=`
            .scanlines {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                opacity: 0.1;
            }
            
            .scanline {
                position: absolute;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #3300ff, transparent);
                animation: scanline-move 8s linear infinite;
            }
            
            .scanline:nth-child(1) { animation-delay: 0s; }
            .scanline:nth-child(2) { animation-delay: 1.6s; }
            .scanline:nth-child(3) { animation-delay: 3.2s; }
            .scanline:nth-child(4) { animation-delay: 4.8s; }
            .scanline:nth-child(5) { animation-delay: 6.4s; }
            
            @keyframes scanline-move {
                0% { top: -10px; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100vh; opacity: 0; }
            }
        `,document.head.appendChild(e),document.body.appendChild(t),this.scanlineElement=t}initGlitchEffects(){const t=document.querySelectorAll(".control-btn, .brutalist-heading, .neo-accent");this.glitchInterval=setInterval(()=>{if(Math.random()<.1){const e=t[Math.floor(Math.random()*t.length)];this.applyGlitchEffect(e)}},2e3)}applyGlitchEffect(t){if(!t)return;const e=t.textContent,n=["█","▓","▒","░","╬","╫","╪","┼"];let i="";for(let a of e)a!==" "&&Math.random()<.3?i+=n[Math.floor(Math.random()*n.length)]:i+=a;t.style.color="#ff00f6",t.textContent=i,setTimeout(()=>{t.style.color="",t.textContent=e},100+Math.random()*200)}addSystemIndicators(){const t=["SYS_LOAD: 67%","MEM_USAGE: 42%","NET_STATUS: STABLE","PROC_COUNT: 12","TEMP: 23°C","UPTIME: 4:23:17"],e=document.createElement("div");e.className="system-indicator",e.style.cssText=`
            position: fixed;
            bottom: 20px;
            left: 20px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            color: #3300ff;
            opacity: 0.6;
            z-index: 10;
            background: rgba(0,0,0,0.8);
            padding: 5px 8px;
            border: 1px solid #3300ff;
        `,document.body.appendChild(e);let n=0;setInterval(()=>{e.textContent=t[n],n=(n+1)%t.length},3e3)}initDataStreams(){const t=document.createElement("div");t.className="data-stream",t.style.cssText=`
            position: fixed;
            top: 0;
            right: 20px;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, transparent, #3300ff, transparent);
            opacity: 0.3;
            animation: data-flow 6s linear infinite;
            pointer-events: none;
            z-index: 1;
        `;const e=document.createElement("style");e.textContent=`
            @keyframes data-flow {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(100vh); }
            }
        `,document.head.appendChild(e),document.body.appendChild(t)}initTerminalTyping(){const t=document.createElement("div");t.className="terminal-output",t.style.cssText=`
            position: fixed;
            top: 20px;
            left: 20px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #3300ff;
            opacity: 0.7;
            z-index: 10;
            background: rgba(0,0,0,0.9);
            padding: 10px;
            border: 1px solid #3300ff;
            max-width: 300px;
            min-height: 60px;
        `,document.body.appendChild(t),this.terminalOutput=t,this.typeMessage(`STORE_SYSTEM_INITIALIZED...
LOADING_INVENTORY...`)}typeMessage(t,e){if(!this.terminalOutput)return;this.terminalOutput.textContent="";let n=0;const i=setInterval(()=>{n<t.length?t[n]==="\\"&&t[n+1]==="n"?(this.terminalOutput.innerHTML+="<br>",n+=2):(this.terminalOutput.textContent+=t[n],n++):(clearInterval(i),e&&e())},50+Math.random()*50)}addRandomSystemMessages(){const t=["SCANNING_PRODUCT_DATABASE...","UPDATING_INVENTORY_CACHE...","OPTIMIZING_PAYMENT_GATEWAY...","SYNCHRONIZING_SHOPIFY_API...","PROCESSING_CUSTOMER_QUEUE...","VALIDATING_PRODUCT_METADATA..."];setInterval(()=>{if(Math.random()<.3){const e=t[Math.floor(Math.random()*t.length)];this.typeMessage(e)}},8e3)}createDataFlowAnimation(){setInterval(()=>{Math.random()<.2&&this.createDataBlock()},1500)}createDataBlock(){const t=document.createElement("div");t.textContent=Math.random().toString(16).substr(2,8).toUpperCase(),t.style.cssText=`
            position: fixed;
            right: -100px;
            top: ${Math.random()*window.innerHeight}px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #3300ff;
            opacity: 0.3;
            pointer-events: none;
            z-index: 1;
            transition: all 8s linear;
        `,document.body.appendChild(t),setTimeout(()=>{t.style.right="100vw",t.style.opacity="0"},100),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},8500)}updateTerminalStatus(){const t=document.querySelectorAll(".status-line"),e=["STATUS: OPERATIONAL","INVENTORY: UPDATING","PAYMENT_SYSTEM: INITIALIZING"];t.forEach((n,i)=>{e[i]&&(n.textContent=e[i])})}updateFilterStatus(t){const e=document.querySelector(".filter-status .status-text");if(e){const n=t.toUpperCase();e.textContent=`FILTER_STATUS: ${n==="ALL"?"ALL_CATEGORIES_ACTIVE":n+"_SELECTED"}`}}triggerTerminalGlitch(){document.querySelectorAll(".brutalist-mono, .neo-accent").forEach(e=>{Math.random()<.1&&this.applyGlitchEffect(e)})}async initShopify(){}setupShopifyClient(){}}document.addEventListener("DOMContentLoaded",()=>{const s=new r;window.storeManager=s,window.addEventListener("beforeunload",()=>{s.glitchInterval&&clearInterval(s.glitchInterval),s.scanlineElement&&s.scanlineElement.remove()})});
