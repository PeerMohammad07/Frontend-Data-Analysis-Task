export interface ICropData {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': number | string;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': number | string;
  'Area Under Cultivation (UOM:Ha(Hectares))': number | string;
}

export interface ICropProduction {
  name: string;
  production: number;
}

export interface IYearGroup {
  [key: string]: ICropData[];
}

export interface ITableARow {
  Year: number;
  Max: string | number;
  Min: string | number;
}

export interface ITableProps {
  tableData : ITableARow[] | ITableBRow[]
}

export interface ITableBRow {
  Crop: string;
  AvgYield: number;
  AvgCultivation: number;
}