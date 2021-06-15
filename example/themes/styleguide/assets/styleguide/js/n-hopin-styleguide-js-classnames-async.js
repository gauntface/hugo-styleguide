const BEM_CLASSNAMES_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-bem-classnames';
const INVALID_CLASSNAMES_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-invalid-classnames';
const IDS_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-ids';
const ELEMENTS_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-elements';
class ClassName {
    getCSSReports() {
        const reports = [];
        for (const s of document.styleSheets) {
            try {
                const cssStylesheet = s;
                const report = {
                    StylesheetHref: cssStylesheet.href,
                    BEMClassSelectors: [],
                    NonBEMClassSelectors: [],
                    IDSelectors: [],
                    UnknownSelectors: [],
                };
                this.getCSSRulesForStylesheet(report, cssStylesheet);
                reports.push(report);
            }
            catch (err) {
                console.warn('Failed to process styleguide:', err);
            }
        }
        return reports;
    }
    getCSSRulesForStylesheet(report, stylesheet) {
        for (const r of stylesheet.cssRules) {
            if (r instanceof CSSStyleRule) {
                this.parseCSSStyleRule(report, r);
            }
            else if (r instanceof CSSMediaRule) {
                this.parseCSSMediaRule(report, r);
            }
            else {
                console.warn('Skipping CSS rule due to its unknown type:', r);
            }
        }
    }
    parseCSSMediaRule(report, mediaRule) {
        for (const r of mediaRule.cssRules) {
            if (r instanceof CSSStyleRule) {
                this.parseCSSStyleRule(report, r);
            }
            else {
                console.warn('Skipping CSS Media rule due to its unknown type:', r);
            }
        }
    }
    parseCSSStyleRule(report, rule) {
        const selectors = this.splitSelectors(rule.selectorText);
        for (const s of selectors) {
            this.parseSelector(report, s);
        }
    }
    parseSelector(report, selector) {
        switch (selector.substring(0, 1)) {
            case '.':
                const results = this.parseBEMSelector(selector);
                if (!results) {
                    report.NonBEMClassSelectors.push(selector);
                }
                else {
                    report.BEMClassSelectors.push(results);
                }
                break;
            case '#':
                report.IDSelectors.push(selector);
                break;
            default:
                report.UnknownSelectors.push(selector);
        }
    }
    parseBEMSelector(selector) {
        const regex = /^\.(?:n-([a-z0-9-]*)-)?([cul])-((?:[a-z0-9]|-(?=[a-z0-9]))+)(?:__((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?:--((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?::(?:.*))*?$/;
        const results = regex.exec(selector);
        if (!results) {
            return null;
        }
        const bem = {
            namespace: null,
            type: results[2],
            body: results[3],
            element: results[4],
            modifier: results[5],
        };
        if (results[1]) {
            bem.namespace = results[1];
        }
        return bem;
    }
    render() {
        const reports = this.getCSSReports();
        const bemContainer = document.querySelector(BEM_CLASSNAMES_CONTAINER_SELECTOR);
        if (bemContainer) {
            const orderedBEM = this.orderedBEMSelectors(reports);
            this.renderBEMList(orderedBEM, bemContainer);
        }
        const invalidClassesContainer = document.querySelector(INVALID_CLASSNAMES_CONTAINER_SELECTOR);
        if (invalidClassesContainer) {
            const orderedInvalids = this.orderedItems(reports, (r) => r.NonBEMClassSelectors);
            this.renderList(orderedInvalids, invalidClassesContainer);
        }
        const idsContainer = document.querySelector(IDS_CONTAINER_SELECTOR);
        if (idsContainer) {
            const orderedIDs = this.orderedItems(reports, (r) => r.IDSelectors);
            this.renderList(orderedIDs, idsContainer);
        }
        const elementsContainer = document.querySelector(ELEMENTS_CONTAINER_SELECTOR);
        if (elementsContainer) {
            const orderedElements = this.orderedItems(reports, (r) => r.UnknownSelectors);
            this.renderList(orderedElements, elementsContainer);
        }
    }
    renderList(classes, container) {
        const ol = document.createElement('ol');
        for (const c of classes) {
            if (c.indexOf('n-hopin-styleguide') === 1) {
                continue;
            }
            const li = document.createElement('li');
            li.textContent = c;
            ol.appendChild(li);
        }
        container.appendChild(ol);
    }
    renderBEMList(selectors, container) {
        const groups = this.groupNames(selectors, (s) => {
            return { name: s.namespace, id: 'namespace' };
        });
        for (const group of groups) {
            const groupRow = document.createElement('div');
            groupRow.classList.add('n-hopin-styleguide-c-selector-row');
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                return { name: '.', id: '' };
            }));
            if (group.name) {
                groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                    return { name: `n-${s.namespace}`, id: 'namespace' };
                }));
                groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                    return { name: '-', id: '' };
                }));
            }
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                return { name: s.type, id: 'type' };
            }));
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                return { name: '-', id: '' };
            }));
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                return { name: s.body, id: 'body' };
            }));
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                if (s.element) {
                    return { name: `__${s.element}`, id: 'element' };
                }
                if (s.modifier) {
                    return { name: `--${s.modifier}`, id: 'modifier' };
                }
                return { name: '', id: '' };
            }));
            groupRow.appendChild(this.renderRowGroup(group.selectors, (s) => {
                if (!s.element) {
                    return { name: '', id: '' };
                }
                if (s.modifier) {
                    return { name: `--${s.modifier}`, id: 'modifier' };
                }
                return { name: '', id: '' };
            }));
            container.appendChild(groupRow);
        }
    }
    renderRowGroup(selectors, namefn) {
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('n-hopin-styleguide-c-selector-row__container');
        const grouped = this.groupNames(selectors, namefn);
        for (const group of grouped) {
            const namespaceGroup = document.createElement('div');
            namespaceGroup.classList.add('n-hopin-styleguide-c-selector-row__group');
            for (let i = 0; i < group.count; i++) {
                const item = document.createElement('span');
                item.classList.add('n-hopin-styleguide-c-selector-row__item');
                if (group.name) {
                    if (group.id) {
                        item.classList.add(`n-hopin-styleguide-c-selector-row__item--${group.id}`);
                        item.classList.add('n-hopin-styleguide-c-selector-row__item--highlight');
                    }
                    item.textContent = group.name;
                }
                else {
                    item.innerHTML = '&nbsp;';
                }
                namespaceGroup.appendChild(item);
            }
            groupContainer.appendChild(namespaceGroup);
        }
        return groupContainer;
    }
    renderBEMGroup(group) {
        const nameColumn = document.createElement('div');
        nameColumn.classList.add('n-hopin-styleguide-l-bemgroup--name');
        for (let i = 0; i < group.count; i++) {
            const item = document.createElement('div');
            item.classList.add('n-hopin-styleguide-l-bemgroup--line-item');
            item.textContent = group.name;
            nameColumn.appendChild(item);
        }
        const subgroupContainer = document.createElement('div');
        subgroupContainer.classList.add('n-hopin-styleguide-l-bemgroup--subgroup');
        for (const sg of group.subgroups) {
            subgroupContainer.appendChild(this.renderBEMGroup(sg));
        }
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('n-hopin-styleguide-l-bemgroup');
        groupContainer.appendChild(nameColumn);
        groupContainer.appendChild(subgroupContainer);
        return groupContainer;
    }
    groupNames(selectors, namefn) {
        const groups = [];
        let currentGroup;
        for (const s of selectors) {
            const { name, id } = namefn(s);
            if (!currentGroup || name != currentGroup.name) {
                currentGroup = {
                    name: name,
                    id: id,
                    count: 0,
                    selectors: [],
                };
                groups.push(currentGroup);
            }
            currentGroup.count++;
            currentGroup.selectors.push(s);
        }
        return groups;
    }
    orderedItems(reports, fn) {
        const allItems = [];
        for (const report of reports) {
            const items = fn(report);
            for (const i of items) {
                if (allItems.indexOf(i) == -1) {
                    allItems.push(i);
                }
            }
        }
        return allItems.sort();
    }
    orderedBEMSelectors(reports) {
        const selectors = [];
        for (const report of reports) {
            for (const selector of report.BEMClassSelectors) {
                if (selector.namespace === 'hopin-styleguide') {
                    continue;
                }
                selectors.push(selector);
            }
        }
        function sortGeneric(a, b) {
            if (a !== b) {
                if (!a) {
                    return -1;
                }
                if (!b) {
                    return 1;
                }
            }
            a = (a || '').toLowerCase();
            b = (b || '').toLowerCase();
            if (a > b)
                return 1;
            if (b > a)
                return -1;
            return 0;
        }
        function sortModifier(a, b) {
            return sortGeneric(a.modifier, b.modifier);
        }
        function sortElements(a, b) {
            return sortGeneric(a.element, b.element);
        }
        function sortBody(a, b) {
            return sortGeneric(a.body, b.body);
        }
        function sortType(a, b) {
            return sortGeneric(a.type, b.type);
        }
        function sortNamespace(a, b) {
            return sortGeneric(a.namespace, b.namespace);
        }
        selectors.sort(sortModifier);
        selectors.sort(sortElements);
        selectors.sort(sortBody);
        selectors.sort(sortType);
        selectors.sort(sortNamespace);
        return selectors;
    }
    splitSelectors(selector) {
        return selector.split(/(?:\s|,)+/);
    }
}
window.addEventListener('load', function () {
    new ClassName().render();
});
//# sourceMappingURL=n-hopin-styleguide-js-classnames-async.js.map