 
import {VariableGroup, Variable} from './_variable-group';
import {createVariableTable} from './_create-table';

const DIMENS_SUFFIX = 'dimensions.css';
const DIMENS_SELECTOR = '.n-hopin.js-dimensions-grid';

class DimensTable extends VariableGroup {
    constructor() {
        super(DIMENS_SELECTOR, DIMENS_SUFFIX);
    }

    renderData(variables: Variable[]): HTMLElement[] {
        return [createVariableTable(variables)];
    }
}

window.addEventListener('load', function() {
    new DimensTable().render();
});