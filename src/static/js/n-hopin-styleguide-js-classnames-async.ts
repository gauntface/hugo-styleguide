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

      /* const tableReport = this.convertToTableReport(reports);
      console.log(`Got table report: `, tableReport);

      this.renderTable(tableReport, containerElement);*/
  }

  renderBEMList(selectors: BEMSelector[], container: Element) {
    const grouped = this.groupSelectors(selectors);
    console.log(grouped);
  }

  groupSelectors(selectors: BEMSelector[]): BEMGroup[] {
    return this.group(selectors, [
      (s) => s.namespace,
      (s) => s.type,
      (s) => s.body,
      (s) => s.element,
      (s) => s.modifier,
    ]);
  }

  group(selectors: BEMSelector[], namefns: ((s:BEMSelector) => string)[]): BEMGroup[] {
    const groups: BEMGroup[] = [];

    const currentNamefn = namefns.shift();
    const groupedNamespaces = this.groupNames(selectors, currentNamefn);
    
    for (const groupedNamespace of groupedNamespaces) {
      const group: BEMGroup = {
        name: groupedNamespace.name,
        count: groupedNamespace.count,
        subgroups: [],
      };

      if (namefns.length > 0) {
        const sg = this.group(groupedNamespace.selectors, namefns)
        group.subgroups = sg;
      }

      groups.push(group);
    }
    return groups;
  }

  groupNames(selectors: BEMSelector[], namefn: (s: BEMSelector) => string): {name: string, count: number, selectors: BEMSelector[]}[] {
    const groups: {name: string, count: number, selectors: BEMSelector[]}[] = [];
    let currentGroup: {name: string, count: number, selectors: BEMSelector[]};
    for (const s of selectors) {
      const name = namefn(s);
      if (!currentGroup || name != currentGroup.name) {
        currentGroup = {
          name: name,
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
  StylesheetHref: string;

  BEMClassSelectors: BEMSelector[];
  NonBEMClassSelectors: string[];
  IDSelectors: string[];
  UnknownSelectors: string[];
}

interface BEMGroup {
  name: string;
  count: number;
  subgroups: BEMGroup[];
}