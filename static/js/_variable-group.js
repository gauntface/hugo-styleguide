import { friendlyName, friendlyNameFromURL } from "./_friendly-name";
const GROUP_CONTAINER_CLASS = '__hopin__variable-group';
const GROUP_TITLE_CLASS = '__hopin__variable-group__title';
export class VariableGroup {
    constructor(containerClass, fileSuffix) {
        this.containerClass = containerClass;
        this.fileSuffix = fileSuffix;
    }
    getGroups() {
        const groups = [];
        for (const s of document.styleSheets) {
            try {
                if (!s.href) {
                    continue;
                }
                if (s.href.lastIndexOf(this.fileSuffix) !== s.href.length - this.fileSuffix.length) {
                    continue;
                }
                const group = {
                    prettyName: friendlyNameFromURL(s.href, this.fileSuffix),
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
                                    value: unparsedValue.toString(),
                                });
                            }
                        }
                    }
                }
                groups.push(group);
            }
            catch (err) {
                console.error(`Unable to read styles for ${s.href}`, err);
            }
        }
        return groups;
    }
    render() {
        const containerElement = document.querySelector(`.${this.containerClass}`);
        if (!containerElement) {
            console.warn(`Unable to find container with class ${this.containerClass}`);
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