!function(){"use strict";class t{constructor(){this.container=document.querySelector(".n-hopin-styleguide-js-typography"),this.canvas1=this.createCanvas(),this.canvas2=this.createCanvas(),document.body.appendChild(this.canvas1),document.body.appendChild(this.canvas2)}createCanvas(){const t=document.createElement("canvas");return t.width=100,t.height=100,t.style.display="none",t.style.visibility="hidden",t}updateTypeInfo(){for(const t of this.container.children){let e=t;t.childElementCount>0&&(e=t.children[0]);const n=window.getComputedStyle(e),i=`: ${this.getCurrentFont(n.fontFamily)} ${n.fontWeight}, ${n.fontSize}`;if(e===t){let t=e.getAttribute("n-hopin-styleguide-typograhy_orig_text");t||(t=e.textContent,e.setAttribute("n-hopin-styleguide-typograhy_orig_text",t),e.textContent=`${t}${i}`)}else{let e=t.querySelector(".n-hopin-styleguide-js-font-details");e||(e=document.createElement("span"),e.classList.add("n-hopin-styleguide-js-font-details"),t.appendChild(e)),e.textContent=i}}}getCurrentFont(t){const e=t.split(",").map(t=>t.trim());for(const t of e)if(this.isfontUsed(t))return t;return"<Browser Default>"}isfontUsed(t){const e=this.printText(this.canvas1,"Test.",[t,"serif"]),n=this.printText(this.canvas2,"Test.",[t,"sans-serif"]);return this.isImgDataMatching(e,n)}isImgDataMatching(t,e){if(t.data.length!=e.data.length)return!1;for(let n=0;n<t.data.length;n++)if(t.data[n]!=e.data[n])return!1;return!0}printText(t,e,n){const i=t.getContext("2d");return i.clearRect(0,0,t.width,t.height),i.font=`40px ${n.join(", ")}`,i.textAlign="center",i.fillText(e,50,50),i.getImageData(0,0,t.width,t.height)}}window.addEventListener("load",()=>{if(!document.querySelector(".n-hopin-styleguide-js-typography"))return;const e=new t;e.updateTypeInfo(),setInterval(()=>{e.updateTypeInfo()},1e3)})}();
//# sourceMappingURL=n-hopin-styleguide-js-typography.js.map
