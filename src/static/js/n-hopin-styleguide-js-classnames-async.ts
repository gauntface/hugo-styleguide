const CLASSNAMES_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-classnames';

class ClassName {
  getCSSReports(): CSSStyleheetReport[] {
    const reports: CSSStyleheetReport[] = [];
    for (const s of document.styleSheets) {
      try {
        const cssStylesheet = s as CSSStyleSheet;

        const report: CSSStyleheetReport = {
          StylesheetHref: cssStylesheet.href,
          BEMClassSelectors: [],
          NonBEMClassSelectors: [],
          IDSelectors: [],
          UnknownSelectors: [],
        }

        this.getCSSRulesForStylesheet(report, cssStylesheet);
        
        reports.push(report);
      } catch (err) {
        console.warn('Failed to process styleguide:', err);
      }
    }

    return reports;
  }

  getCSSRulesForStylesheet(report: CSSStyleheetReport, stylesheet: CSSStyleSheet) {
    for (const r of stylesheet.cssRules) {
      if (r instanceof CSSStyleRule) {
        this.parseCSSStyleRule(report, r);
      } else if (r instanceof CSSMediaRule) {
        this.parseCSSMediaRule(report, r);
      } else {
        console.warn('Skipping CSS rule due to its unknown type:', r);
      } 
    }
  }

  parseCSSMediaRule(report: CSSStyleheetReport, mediaRule: CSSMediaRule) {
    for (const r of mediaRule.cssRules) {
      if (r instanceof CSSStyleRule) {
        this.parseCSSStyleRule(report, r);
      } else {
        console.warn('Skipping CSS Media rule due to its unknown type:', r);
      }
    }
  }

  parseCSSStyleRule(report: CSSStyleheetReport, rule: CSSStyleRule) {
    const selectors = this.splitSelectors(rule.selectorText);
    for (const s of selectors) {
      this.parseSelector(report, s);
    }
  }

  parseSelector(report: CSSStyleheetReport, selector: string) {
    switch (selector.substring(0, 1)) {
      case '.':
        const results = this.parseBEMSelector(selector);
        if (!results) {
          report.NonBEMClassSelectors.push(selector);
        } else {
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

  parseBEMSelector(selector: string): (null|BEMSelector) {
    // ((?:[a-z0-9]|-(?=[a-z0-9]))+) uses look ahead.
    // Match a-z0-9 OR a - followed by a-z0-9
    const regex = /^\.(?:n-([a-z0-9-]*)-)?([cul])-((?:[a-z0-9]|-(?=[a-z0-9]))+)(?:__((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?:--((?:[a-z0-9]|-(?=[a-z0-9]))+))?(?::(?:hover|active|focus|visited))*?$/;
    const results = regex.exec(selector);
    if (!results) {
      return null;
    }
    const bem: BEMSelector = {
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
      const containerElement = document.querySelector(CLASSNAMES_CONTAINER_SELECTOR);
      if (!containerElement) {
          console.warn(`Unable to find container with class ${CLASSNAMES_CONTAINER_SELECTOR}`)
          return;
      }

      const reports = this.getCSSReports();
      
      const orderedBEM = this.orderedBEMSelectors(reports);

      this.renderBEMList(orderedBEM, containerElement);
      console.log(orderedBEM);

      /* const tableReport = this.convertToTableReport(reports);
      console.log(`Got table report: `, tableReport);

      this.renderTable(tableReport, containerElement);*/
  }

  renderBEMList(selectors: BEMSelector[], container: Element) {
    for (const s of selectors) {
      const sElement = document.createElement('div');
      const pieces: string[] = [];
      if (s.namespace) {
        pieces.push(`n-${s.namespace}`);
      }
      if (s.type) {
        pieces.push(`${s.type}`);
      }
      if (s.body) {
        pieces.push(`${s.body}`);
      }
      let className = `.${pieces.join('-')}`;
      if (s.element) {
        className += `--${s.element}`;
      }
      if (s.modifier) {
        className +=`__${s.modifier}`;
      }
      sElement.textContent = className;
      container.appendChild(sElement);
    }
  }

  orderedBEMSelectors(reports: CSSStyleheetReport[]): BEMSelector[] {
    const selectors: BEMSelector[] = [];
    for (const report of reports) {
      for (const selector of report.BEMClassSelectors) {
        if (selector.namespace === 'hopin-styleguide') {
          continue;
        }

        selectors.push(selector);
      }
    }

    function sortGeneric(a: string, b: string): number {
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
      
      if (a > b) return 1;
      if (b > a) return -1;
      return 0;
    }

    function sortModifier(a: BEMSelector, b: BEMSelector): number {
      return sortGeneric(a.modifier, b.modifier);
    }

    function sortElements(a: BEMSelector, b: BEMSelector): number {
      return sortGeneric(a.element, b.element);
    }

    function sortBody(a: BEMSelector, b: BEMSelector): number {
      return sortGeneric(a.body, b.body);
    }

    function sortType(a: BEMSelector, b: BEMSelector): number {
      return sortGeneric(a.type, b.type);
    }

    function sortNamespace(a: BEMSelector, b: BEMSelector): number {
      return sortGeneric(a.namespace, b.namespace);
    }

    selectors.sort(sortModifier);
    selectors.sort(sortElements);
    selectors.sort(sortBody);
    selectors.sort(sortType);
    selectors.sort(sortNamespace);

    return selectors
  }

  convertToTableReport(reports: CSSStyleheetReport[]): UITableReport {
    const namespacedSelectors = this.selectorsByNamespace(reports);
    
    const tableReport: UITableReport = {
      Namespaces: [],
    }

    for (const n of Object.keys(namespacedSelectors)) {
      const selectors = namespacedSelectors[n];
      const namespaceReport: UINamespaceReport = {
        Name: n,
        Types: [],
      };

      const typedSelectors = this.selectorsByType(selectors);
      for (const t of Object.keys(typedSelectors)) {
        const typeReport: UITypeReport = {
          Name: t,
          Bodies: [],
        }
        
        const bodySelectors = this.selectorsByBody(typedSelectors[t])
        for (const b of Object.keys(bodySelectors)) {
          const bodyReport: UIBodyReport = {
            Name: b,
            ElementModifiers: [],
          }

          const elementSelectors = this.selectorsByElements(bodySelectors[b]);
          for (const e of Object.keys(elementSelectors)) {
            const elementModifier: UIElementModifierReport = {
              ElementName: e,
              Modifiers: [],
            };
            const modifiers = this.selectorsByModifiers(elementSelectors[e]);
            for (const m of Object.keys(modifiers)) {
              elementModifier.Modifiers.push(m);
            }
            bodyReport.ElementModifiers.push(elementModifier);
          }
          typeReport.Bodies.push(bodyReport);
        }

        namespaceReport.Types.push(typeReport);
      }

      tableReport.Namespaces.push(namespaceReport)
    }
    
    return tableReport
  }

  selectorsByElements(selectors: BEMSelector[]): {[key: string]: BEMSelector[]} {
    const elements: {[key: string]: BEMSelector[]} = {};
    for (const selector of selectors) {
      let elementName = '';
      if (selector.element) {
        elementName = selector.element;
      }

      if (!elements[elementName]) {
        elements[elementName] = [];
      }
      elements[elementName].push(selector);
    }
    return elements;
  }

  selectorsByModifiers(selectors: BEMSelector[]): {[key: string]: BEMSelector[]} {
    const modifiers: {[key: string]: BEMSelector[]} = {};
    for (const selector of selectors) {
      let modifierName = '';
      if (selector.modifier) {
        modifierName = selector.modifier;
      }

      if (!modifiers[modifierName]) {
        modifiers[modifierName] = [];
      }

      modifiers[modifierName].push(selector);
    }
    return modifiers;
  }

  selectorsByBody(selectors: BEMSelector[]): {[key: string]: BEMSelector[]} {
    const bodies: {[key: string]: BEMSelector[]} = {};
    for (const selector of selectors) {
      const name = selector.body;
      if (!bodies[name]) {
        bodies[name] = [];
      }

      bodies[name].push(selector);
    }
    return bodies;
  }

  selectorsByNamespace(reports: CSSStyleheetReport[]): {[key: string]: BEMSelector[]} {
    const bemSelectorsByNamespace: {[key: string]: BEMSelector[]} = {};
    for (const report of reports) {
      for (const bemSelector of report.BEMClassSelectors) {
        let n = '';
        if (bemSelector.namespace) {
          n = bemSelector.namespace;
        }
        
        if (!bemSelectorsByNamespace[n]) {
          bemSelectorsByNamespace[n] = [];
        }

        bemSelectorsByNamespace[n].push(bemSelector);
      }
    }
    return bemSelectorsByNamespace
  }

  selectorsByType(selectors: BEMSelector[]): {[key: string]: BEMSelector[]} {
    const bemSelectorsByTypes: {[key: string]: BEMSelector[]} = {};
    for (const selector of selectors) {
      let t = '';
      if (selector.type) {
        t = selector.type;
      }
      
      if (!bemSelectorsByTypes[t]) {
        bemSelectorsByTypes[t] = [];
      }

      bemSelectorsByTypes[t].push(selector);
    }
    return bemSelectorsByTypes;
  }

  renderTable(report: UITableReport, containerElement: Element) {
    for(const n of report.Namespaces) {
      containerElement.appendChild(
        this.renderNamespaces(n)
      )
    }
  }

  renderNamespaces(report: UINamespaceReport): Element {
    const namespaceSection = document.createElement('div');
    namespaceSection.appendChild(this.namespaceTitleElement(report));
    namespaceSection.appendChild(this.renderTypes(report.Types));
    return namespaceSection
  }

  namespaceTitleElement(report: UINamespaceReport): Element {
    const titleEle = document.createElement('h2');
    if (report.Name) {
      titleEle.textContent = `${report.Name}`;
    } else {
      titleEle.textContent = 'No Namespace';
    }
    return titleEle;
  }

  renderTypes(reports: UITypeReport[]): Element {
    const typesSection = document.createElement('div');
    for (const report of reports) {
      typesSection.appendChild(this.typeTitleElement(report));
      typesSection.appendChild(this.typeTableElement(report));
    }
    return typesSection
  }

  typeTitleElement(report: UITypeReport): Element {
    const titleEle = document.createElement('h3');
    switch (report.Name) {
      case 'c':
        titleEle.textContent = `Components`;
        break;
      case 'l':
        titleEle.textContent = `Layouts`;
        break;
      default:
        titleEle.textContent = `Unknown Type ${report.Name}`;
        break;
    }
    return titleEle;
  }

  typeTableElement(report: UITypeReport): Element {
    const table = document.createElement('table');
    table.appendChild(this.typeTableHeading());
    table.appendChild(this.typeTableBody(report));
    return table;
  }

  typeTableHeading(): Element {
    const bodyTd = document.createElement('td');
    bodyTd.textContent = 'Body';
    const elementTd = document.createElement('td');
    elementTd.textContent = 'Element';
    const modifierTd = document.createElement('td');
    modifierTd.textContent = 'Modifier';

    const tr = document.createElement('tr');
    tr.appendChild(bodyTd);
    tr.appendChild(elementTd);
    tr.appendChild(modifierTd);    

    const header = document.createElement('thead');
    header.appendChild(tr);
    return header;
  }

  typeTableBody(report: UITypeReport): Element {
    const body = document.createElement('tbody');

    for (const bodyReport of report.Bodies) {
      const elementTable = document.createElement('table');
      const modifierTable = document.createElement('table');
      for (const em of bodyReport.ElementModifiers) {
        let addElementText = true;
        for (const m of em.Modifiers) {
          const elementCol = document.createElement('td');
          elementCol.innerHTML = '&nbsp;';
          if (addElementText) {
            if (em.ElementName) {
              elementCol.textContent = em.ElementName;
            }
            addElementText = false;
          }

          const elementRow = document.createElement('tr');
          elementRow.appendChild(elementCol);
          elementTable.appendChild(elementRow);

          const modifierCol = document.createElement('td');
          modifierCol.innerHTML = '&nbsp;';
          if (m) {
            modifierCol.textContent = m;
          }

          const modifierRow = document.createElement('tr');
          modifierRow.appendChild(modifierCol);
          modifierTable.appendChild(modifierRow);
        }
      }
      
      const bodyCol = document.createElement('td');
      bodyCol.textContent = bodyReport.Name
      const elementCol = document.createElement('td');
      elementCol.appendChild(elementTable);
      const modiferCol = document.createElement('td');
      modiferCol.appendChild(modifierTable);

      const tr = document.createElement('tr');
      tr.append(bodyCol);
      tr.appendChild(elementCol);
      tr.appendChild(modiferCol);

      body.appendChild(tr);
    }

    
    return body;
  }

  /* renderNamespaces(report: ClassNameReport) {
      

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
  }*/

  /* renderBEMList(bemElements: {[key: string]: BEMBody}): HTMLElement {
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
          nameLi.textContent = `&#8627; ${element}`;
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
  }*/

  splitSelectors(selector: string) {
      return selector.split(/(?:\s|,)+/);
  }
}

window.addEventListener('load', function() {
  new ClassName().render();
})

interface BEMSelector {
  namespace: string | null;
  type: string;
  body: string;
  element: string;
  modifier: string;
}

interface CSSStyleheetReport {
  StylesheetHref: string,

  BEMClassSelectors: BEMSelector[],
  NonBEMClassSelectors: string[],
  IDSelectors: string[],
  UnknownSelectors: string[],
}

interface UITableReport {
  Namespaces: UINamespaceReport[],
}

interface UINamespaceReport {
  Name: string,

  Types: UITypeReport[],
}

interface UITypeReport {
  Name: string,

  Bodies: UIBodyReport[],
}

interface UIBodyReport {
  Name: string,

  ElementModifiers: UIElementModifierReport[],
}

interface UIElementModifierReport {
  ElementName: string,
  Modifiers: string[],
}