// Inteface for cropdata
export interface ICropData {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': number | string;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': number | string;
  'Area Under Cultivation (UOM:Ha(Hectares))': number | string;
}

// Interface for cropproduction
export interface ICropProduction {
  name: string;
  production: number;
}

// Interface for yeargroup
export interface IYearGroup {
  [key: string]: ICropData[];
}

// Interface for TableA rows
export interface ITableARow {
  Year: number;
  Max: string | number;
  Min: string | number;
}

// Interface for TableComponent props
export interface ITableProps {
  tableData : ITableARow[] | ITableBRow[]
}

// Interface for TableB rows
export interface ITableBRow {
  Crop: string;
  AvgYield: number;
  AvgCultivation: number;
}