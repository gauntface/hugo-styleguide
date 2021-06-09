import { VariableGroup } from './_variable-group';
import { createVariableTable } from './_create-table';
const DIMENS_SELECTOR = '.n-hopin-styleguide-js-dimensions-grid';
class DimensTable extends VariableGroup {
    constructor() {
        super(DIMENS_SELECTOR);
    }
    renderData(variables) {
        return [createVariableTable(variables)];
    }
}
window.addEventListener('load', function () {
    if (!document.querySelector(DIMENS_SELECTOR)) {
        return;
    }
    new DimensTable().render();
});
//# sourceMappingURL=n-hopin-styleguide-js-dimensions-grid-async.js.map