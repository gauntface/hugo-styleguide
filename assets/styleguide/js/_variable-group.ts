import { friendlyName, friendlyNameFromURL } from "./_friendly-name";

const namespace = 'n-hopin-styleguide-';
const GROUP_CONTAINER_CLASS = `${namespace}c-variable-group`;
const GROUP_TITLE_CLASS = `${namespace}c-variable-group__title`;

export abstract class VariableGroup {
	constructor(private containerSelector: string) {}

	getGroups(): Group[] {
		const groups: { [key: string]: Group; } = {};
		for (const s of document.styleSheets) {
			try {
				const element = s.ownerNode as HTMLElement;
				if (!element.classList.contains('n-hopin-styleguide-js-load-static-css')) {
					continue;
				}
				if (!s.href) {
					continue;
				}

				if (groups[s.href]) {
					continue;
				}

				const group: Group = {
					prettyName: friendlyNameFromURL(s.href),
					href: s.href,
					variables: [],
				};

				for (const r of s.cssRules) {
					const cssStyleRule = r as CSSStyleRule;
					if (!cssStyleRule.style) {
						continue;
					}

					const styleDeclaration = cssStyleRule.style;
					for (let i = 0; i < styleDeclaration.length; i++) {
						const propertyName = styleDeclaration.item(i);
						const propertyValue = styleDeclaration.getPropertyValue(propertyName);
						if (propertyName.indexOf('--') === 0) {
							group.variables.push({
								prettyName: friendlyName(propertyName),
								variableName: propertyName,
								value: propertyValue.toString().trim(),
							});
						}
					}
				}
				groups[s.href] = group;
			} catch (err) {
				// External stylesheets will not be accessible from JavaScript
				// in which case this error will be thrown.
				console.error(`Unable to read styles for ${s.href}`, err);
			}
		}
		return Object.values(groups);
	}

	render() {
		const containerElement = document.querySelector(this.containerSelector);
		if (!containerElement) {
			console.warn(`Unable to find container with selector ${this.containerSelector}`)
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

    abstract renderData(variables: Variable[]): HTMLElement[];
}

interface Group {
    prettyName: string|null;
    href: string;
    variables: Variable[];
}

export interface Variable {
    prettyName: string|null;
    variableName: string;
    value: string;
}
