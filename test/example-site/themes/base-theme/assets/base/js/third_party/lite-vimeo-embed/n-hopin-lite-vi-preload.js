class e{constructor(e){this.element=e,this.anchor=e.querySelector(".n-hopin-lite-vi__link"),this.videoID=encodeURIComponent(e.getAttribute("videoid")),this.preconnected=!1,this.setup()}setup(){this.anchor.addEventListener("pointerover",(()=>this.warmConnections()),{once:!0}),this.anchor.addEventListener("click",(e=>{e.preventDefault(),this.addIframe()}))}addIframe(){const e=`<iframe\n    allow="autoplay; picture-in-picture" allowfullscreen\n    src="https://player.vimeo.com/video/${this.videoID}?color=ffffff&title=0&byline=0&portrait=0"\n    style="width:100%;height:100%;border:none;"\n    ></iframe>`;this.element.removeChild(this.anchor),this.element.insertAdjacentHTML("beforeend",e),this.element.classList.add("n-hopin-lite-vi--activated")}addPrefetch(e,t,n){const i=document.createElement("link");i.rel=e,i.href=t,n&&(i.as=n),i.crossOrigin="",document.head.append(i)}warmConnections(){this.preconnected||(this.preconnected=!0,this.addPrefetch("preconnect","https://player.vimeo.com"),this.addPrefetch("preconnect","https://i.vimeocdn.com"),this.addPrefetch("preconnect","https://f.vimeocdn.com"),this.addPrefetch("preconnect","https://fresnel.vimeocdn.com"))}}var t;t=()=>{const t=document.querySelectorAll(".n-hopin-lite-vi");for(const n of t)new e(n)},window.addEventListener("load",t),"complete"==document.readyState&&t();
