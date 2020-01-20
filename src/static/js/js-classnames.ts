const CLASSNAMES_CONTAINER_SELECTOR = '.n-hopin.js-classnames';

class ClassName {
  generateReport(): ClassNameReport {
    const report: ClassNameReport = {
      idSelectors: [],
      ignoredSelectors: [],
      elementSelectors: [],
      validSelectors: [],
      invalidSelectors: [],
      namespaces: {},
    };

    for (const s of document.styleSheets) {
      try {
        const cssStylesheet = s as CSSStyleSheet;
        for (const r of cssStylesheet.cssRules) {
          // ((?:[a-z0-9]|-(?=[a-z0-9]))+) uses look ahead.
          // Match a-z0-9 OR a - followed by a-z0-9
          if (r instanceof CSSStyleRule) {
            const selectors = this.splitSelectors(r.selectorText);
            for (const s of selectors) {
              const firstChar = s.substring(0, 1);
              switch (firstChar) {
                case '.':
                  const regex = /^\.(?:n-([a-z0-9-]*)-)?([cul])-((?:[a-z0-9]|-(?=[a-z0-9]))+)(?:__((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?:--((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?::(?:hover|active|focus|visited))*?$/;
                  const results = regex.exec(s);
                  if (!results) {
                    report.invalidSelectors.push({
                      rawSelector: r.selectorText,
                      currentSelector: s,
                    });
                    break;
                  }
                  report.validSelectors.push({
                    rawSelector: r.selectorText,
                    currentSelector: s,
                  });
                  const namespace = results[1] || '';
                  const type = results[2];
                  const body = results[3];
                  const element = results[4];
                  const modifier = results[5];

                  if (!report.namespaces[namespace]) {
                    report.namespaces[namespace] = {
                      name: namespace,
                      types: {},
                    };
                  }

                  if (!report.namespaces[namespace].types[type]) {
                    report.namespaces[namespace].types[type] = {};
                  }

                  if (!report.namespaces[namespace].types[type][body]) {
                    report.namespaces[namespace].types[type][body] = {
                      name: body,
                      elements: {},
                      modifiers: [],
                    };
                  }

                  if (element) {
                    if (!report.namespaces[namespace].types[type][body].elements[element]) {
                      report.namespaces[namespace].types[type][body].elements[element] = {
                        name: element,
                        modifiers: [],
                      };
                    }
                    if (modifier && !report.namespaces[namespace].types[type][body].elements[element].modifiers.includes(modifier)) {
                      report.namespaces[namespace].types[type][body].elements[element].modifiers.push(modifier);
                    }
                  } else if (modifier) {
                    report.namespaces[namespace].types[type][body].modifiers.push(modifier);
                  }
                  console.log(`href: ${cssStylesheet.href}`);
                  console.log(`namespace: ${namespace}`);
                  console.log(`type     : ${type}`);
                  console.log(`body     : ${body}`);
                  console.log(`element  : ${element}`);
                  console.log(`modifier : ${modifier}`);
                  console.log('');
                  break;
                case '#':
                  report.idSelectors.push({
                      rawSelector: r.selectorText,
                      currentSelector: s,
                  });
                  break;
                case ':':
                  report.ignoredSelectors.push({
                      rawSelector: r.selectorText,
                      currentSelector: s,
                  });
                  break;
                default:
                  report.elementSelectors.push({
                      rawSelector: r.selectorText,
                      currentSelector: s,
                  });
              }
            }
          }
        }
      } catch (err) {
        // External stylesheets will not be accessible from JavaScript
        // in which case this error will be thrown.
        console.error(`Unable to read styles for ${s.href}`, err);
      }
    }
    return report;
  }

  render() {
      const containerElement = document.querySelector(CLASSNAMES_CONTAINER_SELECTOR);
      if (!containerElement) {
          console.warn(`Unable to find container with class ${CLASSNAMES_CONTAINER_SELECTOR}`)
          return;
      }

      const report = this.generateReport();
      if (Object.keys(report.namespaces).length > 0) {
          containerElement.appendChild(this.renderNamespaces(report))
      }
  }

  renderNamespaces(report: ClassNameReport) {
      const namespaceSection = document.createElement('div');

      const namespaces = Object.keys(report.namespaces).sort();
      for (const namespace of namespaces) {
          const titleEle = document.createElement('h2');
          if (namespace) {
            titleEle.textContent = `Namespace: ${namespace}`;
          } else {
            titleEle.textContent = 'No Namespace';
          }
          
          namespaceSection.appendChild(titleEle);

          const types = Object.keys(report.namespaces[namespace].types).sort();
          for (const type of types) {
              let typeName = type;
              switch (type) {
                  case 'c':
                      typeName = 'Components';
                      break;
                  case 'l':
                      typeName = 'Layouts';
                      break;
                  case 'u':
                      typeName = 'Utilities';
                      break;
              }
              const typeTitle = document.createElement('h3');
              typeTitle.textContent = typeName;
              namespaceSection.appendChild(typeTitle);
              namespaceSection.appendChild(this.renderBEMList(report.namespaces[namespace].types[type]));
          }
      }

      return namespaceSection;
  }

  renderBEMList(bemElements: {[key: string]: BEMBody}): HTMLElement {
      const bodyList = document.createElement('ul');
      const bodies = Object.keys(bemElements).sort();
      for (const body of bodies) {
          const nameLi = document.createElement('li');
          nameLi.textContent = body;
          bodyList.appendChild(nameLi);

          const elements = Object.keys(bemElements[body].elements);
          if (elements.length > 0) {
              bodyList.appendChild(this.renderElements(bemElements[body].elements));
          }

          const modifiers = bemElements[body].modifiers;
          if (modifiers.length > 0) {
              bodyList.appendChild(this.renderModifiers(modifiers));
          }
      }
      return bodyList;
  }

  renderElements(elements: {[key: string]: BEMElement}): HTMLElement {
      const elementList = document.createElement('ul');
      const sortedElements = Object.keys(elements).sort();
      for (const element of sortedElements) {
          const nameLi = document.createElement('li');
          nameLi.textContent = `↳ ${element}`;
          elementList.appendChild(nameLi);

          const modifiers = elements[element].modifiers;
          if (modifiers.length > 0) {
              elementList.appendChild(this.renderModifiers(modifiers));
          }
      }
      return elementList
  }

  renderModifiers(modifiers: string[]): HTMLElement {
      const modifierList = document.createElement('ul');
      for (const modifier of modifiers.sort()) {
          const nameLi = document.createElement('li');
          nameLi.textContent = `↠ ${modifier}`;
          modifierList.appendChild(nameLi);
      }
      return modifierList;
  }

  splitSelectors(selector: string) {
      return selector.split(/(?:\s|,)+/);
  }
}

window.addEventListener('load', function() {
  new ClassName().render();
})

interface Selector {
  rawSelector: string;
  currentSelector: string;
}

interface BEMElement {
  name: string;
  modifiers: string[];
}

interface BEMBody {
  name: string;
  elements: {[key: string]: BEMElement};
  modifiers: string[];
}

interface Namespace {
  name: string;
  types: {[key: string]: {[key: string]: BEMBody}};
}

interface ClassNameReport {
  idSelectors: Selector[];
  ignoredSelectors: Selector[];
  elementSelectors: Selector[];
  validSelectors: Selector[];
  invalidSelectors: Selector[];
  namespaces: {[key: string]: Namespace};
}