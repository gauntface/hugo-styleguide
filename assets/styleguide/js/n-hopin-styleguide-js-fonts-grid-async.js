function e(e){const t=e.split(/_|-/g),n=[];for(const e of t)""!=e&&n.push(e.charAt(0).toUpperCase()+e.slice(1).toLowerCase());return n.join(" ")}function t(t){const n=t.substring(t.lastIndexOf("/")+1);return e(n.substring(0,n.lastIndexOf(".")))}function n(e){const t=document.createElement("div");t.textContent=e,document.body.appendChild(t);var n=document.createRange();n.selectNode(t),window.getSelection().empty(),window.getSelection().addRange(n);let o=!1;try{o=document.execCommand("copy")}catch(e){console.log("Error thrown when copying text: ",e)}return window.getSelection().removeRange(n),document.body.removeChild(t),o}function o(e){const t=[];for(const o of e){const e=document.createElement("div");e.textContent="Copy",e.addEventListener("click",(t=>{t.preventDefault();n(o.variableName)&&(e.textContent="Copied",setTimeout((()=>{e.textContent="Copy"}),1e3))})),t.push([o.variableName,o.value,e])}return function(e){const t=document.createElement("table");t.classList.add("n-hopin"),t.classList.add("c-variable-table");const n=document.createElement("thead"),o=document.createElement("tbody");t.appendChild(n),t.appendChild(o);const r=document.createElement("tr");for(const t of e.columns){const e=document.createElement("th");e.textContent=t,r.appendChild(e)}n.appendChild(r);for(const t of e.rows){const e=document.createElement("tr");for(const n of t){const t=document.createElement("td");n instanceof HTMLElement?t.appendChild(n):"string"==typeof n?t.textContent=n:n.variable&&(t.textContent=n.variable),e.appendChild(t)}o.appendChild(e)}return t}({columns:["Variable Name","Value",""],rows:t})}class r extends class{constructor(e){this.containerSelector=e}getGroups(){const n={};for(const o of document.styleSheets)try{if(!o.ownerNode.classList.contains("n-hopin-styleguide-js-load-static-css"))continue;if(!o.href)continue;if(n[o.href])continue;const r={prettyName:t(o.href),href:o.href,variables:[]},c=o;for(const t of c.cssRules){const n=t;if(n.styleMap){const t=n.styleMap;for(const n of t.entries()){const t=n[0];if(0===t.indexOf("--")){let o=n[1][0];r.variables.push({prettyName:e(t),variableName:t,value:o.toString().trim()})}}}}n[o.href]=r}catch(e){console.error(`Unable to read styles for ${o.href}`,e)}return Object.values(n)}render(){const e=document.querySelector(this.containerSelector);if(!e)return void console.warn(`Unable to find container with selector ${this.containerSelector}`);const t=this.getGroups();console.log("Rendering the following groups:",t);for(const n of t){const t=document.createElement("section");if(t.classList.add("n-hopin-styleguide-c-variable-group"),n.prettyName){const e=document.createElement("h2");e.classList.add("n-hopin-styleguide-c-variable-group__title"),e.textContent=n.prettyName,t.appendChild(e)}const o=this.renderData(n.variables);for(const e of o)t.appendChild(e);e.appendChild(t)}}}{constructor(){super(".n-hopin-styleguide-js-fonts-grid")}renderData(e){return[o(e)]}}window.addEventListener("load",(function(){document.querySelector(".n-hopin-styleguide-js-fonts-grid")&&(new r).render()}));
