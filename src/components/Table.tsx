import { Table, Box } from '@mantine/core';
import { ITableProps, ITableARow, ITableBRow } from '../interfaces/IData';
import React from 'react';

const TableDemo: React.FC<ITableProps> = ({ tableData }) => {

  // Function for finding which table
  const isTableA = (data: ITableARow[] | ITableBRow[]): data is ITableARow[] =>
    (data as ITableARow[])[0]?.Year !== undefined;

  // Memoized rows rendering
  const rows = React.useMemo(() => {
    return tableData.map((element) => {
      if (isTableA(tableData)) {
        const row = element as ITableARow;
        return (
          <Table.Tr key={row.Year}>
            <Table.Td>{row.Year}</Table.Td>
            <Table.Td>{row.Max}</Table.Td>
            <Table.Td>{row.Min}</Table.Td>
          </Table.Tr>
        );
      } else {
        const row = element as ITableBRow;
        return (
          <Table.Tr key={row.Crop}>
            <Table.Td>{row.Crop}</Table.Td>
            <Table.Td>{row.AvgYield}</Table.Td>
            <Table.Td>{row.AvgCultivation}</Table.Td>
          </Table.Tr>
        );
      }
    });
  }, [tableData]);

  // Render table headers based on the table type
  const renderTableHeader = () => {
    if (isTableA(tableData)) {
      return (
        <>
          <Table.Th>Year</Table.Th>
          <Table.Th>Crop with Maximum Production</Table.Th>
          <Table.Th>Crop with Minimum Production</Table.Th>
        </>
      );
    } else {
      return (
        <>
          <Table.Th>Crop</Table.Th>
          <Table.Th>Average Yield (Kg/Ha)</Table.Th>
          <Table.Th>Average Cultivation Area (Ha)</Table.Th>
        </>
      );
    }
  };

  return (
    <Box h={350} w={550}>
      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        stickyHeader
      >
        <Table.Thead>
          <Table.Tr>
            {renderTableHeader()}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tableData.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3} ta="center" style={{ color: '#aaa', fontStyle: 'italic' }}>
                No data available
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
    </Box>
  );
};

export default TableDemo;
