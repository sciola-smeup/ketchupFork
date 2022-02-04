import {
    Cell,
    Column,
    DataTable,
    Row,
} from '../../components/kup-data-table/kup-data-table-declarations';

/**
 * Interface related to dataset operations.
 */
export interface KupDataDatasetOperations {
    cell: KupDataCellOperations;
    column: KupDataColumnOperations;
    row: KupDataRowOperations;
    distinct: (
        dataset: DataTable,
        columns?: string[],
        valuesColumn?: Column
    ) => DataTable;
    new: (dataset: DataTable, newColumns?: KupDataNewColumn[]) => DataTable;
    rangedDistinct: (
        dataset: DataTable,
        rangeColumns: KupDataNewColumn[],
        resultingColumn: Column,
        valuesColumn?: Column
    ) => DataTable;
}
/**
 * Interface related to cells operations.
 */
export interface KupDataCellOperations {
    find: (dataset: DataTable, filters?: KupDataFindCellFilters) => Cell[];
    getValue: (dataset: DataTable, columns?: string[]) => string[];
    replace: (dataset: DataTable, cell: Cell, columns?: string[]) => DataTable;
}
/**
 * Interface related to columns operations.
 */
export interface KupDataColumnOperations {
    merge: (
        dataset: DataTable,
        columns2merge: string[],
        newColumn: Column
    ) => DataTable;
}
/**
 * Interface related to rows operations.
 */
export interface KupDataRowOperations {
    find: (dataset: DataTable, filters?: KupDataFindCellFilters) => Row[];
}
/**
 * Interface related to the formulas factory function.
 */
export interface KupDataFormulas {
    custom: (formula: string, row: { [index: string]: number }) => number;
    normalDistribution: (
        average: number,
        variance: number,
        x: number
    ) => number;
}
/**
 * Sets the filters for the cell finder method.
 */
export interface KupDataFindCellFilters {
    columns?: string[];
    range?: KupDataFilterRange;
    value?: string;
}
/**
 * Interface of the range filter.
 */
export interface KupDataFilterRange {
    min?: number | string | String;
    max?: number | string | String;
}
/**
 * Interface for the creation of a new column.
 */
export interface KupDataNewColumn {
    column: Column;
    criteria: KupDataFindCellFilters;
}