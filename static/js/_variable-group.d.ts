export declare abstract class VariableGroup {
    private containerClass;
    private fileSuffix;
    constructor(containerClass: string, fileSuffix: string);
    getGroups(): Group[];
    render(): void;
    abstract renderData(variables: Variable[]): HTMLElement[];
}
interface Group {
    prettyName: string | null;
    href: string;
    variables: Variable[];
}
export interface Variable {
    prettyName: string | null;
    variableName: string;
    value: string;
}
export {};
