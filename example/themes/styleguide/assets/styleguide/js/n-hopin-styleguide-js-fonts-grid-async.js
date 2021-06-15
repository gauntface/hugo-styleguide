import { VariableGroup } from './_variable-group';
import { createVariableTable } from './_create-table';
const FONTS_CONTAINER_SELECTOR = '.n-hopin-styleguide-js-fonts-grid';
class FontsTable extends VariableGroup {
    constructor() {
        super(FONTS_CONTAINER_SELECTOR);
    }
    renderData(variables) {
        return [createVariableTable(variables)];
    }
}
window.addEventListener('load', function () {
    if (!document.querySelector(FONTS_CONTAINER_SELECTOR)) {
        return;
    }
    new FontsTable().render();
});
//# sourceMappingURL=n-hopin-styleguide-js-fonts-grid-async.js.map