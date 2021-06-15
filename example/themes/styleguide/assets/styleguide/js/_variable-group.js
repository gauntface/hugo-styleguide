import { friendlyName, friendlyNameFromURL } from "./_friendly-name";
const namespace = 'n-hopin-styleguide-';
const GROUP_CONTAINER_CLASS = `${namespace}c-variable-group`;
const GROUP_TITLE_CLASS = `${namespace}c-variable-group__title`;
export class VariableGroup {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }
    getGroups() {
        const groups = {};
        for (const s of document.styleSheets) {
            try {
                const element = s.ownerNode;
                if (!element.classList.contains('n-hopin-styleguide-js-load-static-css')) {
                    continue;
                }
                if (!s.href) {
                    continue;
                }
                if (groups[s.href]) {
                    continue;
                }
                const group = {
                    prettyName: friendlyNameFromURL(s.href),
                    href: s.href,
                    variables: [],
                };
                const cssStylesheet = s;
                for (const r of cssStylesheet.cssRules) {
                    const cssStyleRule = r;
                    if (cssStyleRule['styleMap']) {
                        const map = cssStyleRule['styleMap'];
                        for (const e of map.entries()) {
                            const name = e[0];
                            if (name.indexOf('--') === 0) {
                                let unparsedValue = e[1][0];
                                group.variables.push({
                                    prettyName: friendlyName(name),
                                    variableName: name,
                                    value: unparsedValue.toString().trim(),
                                });
                            }
                        }
                    }
                }
                groups[s.href] = group;
            }
            catch (err) {
                console.error(`Unable to read styles for ${s.href}`, err);
            }
        }
        return Object.values(groups);
    }
    render() {
        const containerElement = document.querySelector(this.containerSelector);
        if (!containerElement) {
            console.warn(`Unable to find container with selector ${this.containerSelector}`);
            return;
        }
        const groups = this.getGroups();
        console.log(`Rendering the following groups:`, groups);
        for (const g of groups) {
            const groupContainer = document.createElement('section');
            groupContainer.classList.add(GROUP_CONTAINER_CLASS);
            if (g.prettyName) {
                const title = document.createElement('h2');
                title.classList.add(GROUP_TITLE_CLASS);
                title.textContent = g.prettyName;
                groupContainer.appendChild(title);
            }
            const elements = this.renderData(g.variables);
            for (const e of elements) {
                groupContainer.appendChild(e);
            }
            containerElement.appendChild(groupContainer);
        }
    }
}
//# sourceMappingURL=_variable-group.js.map