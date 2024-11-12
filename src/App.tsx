import "@mantine/core/styles.css";
import { Box, Card, Container, MantineProvider, ScrollArea, Text, Title } from "@mantine/core";
import TableDemo from "./components/Table";
import { ICropData, ICropProduction, ITableARow, ITableBRow, IYearGroup } from "./interfaces/IData";
import { rawData } from "./data/data";

export default function App() {

  // Extract year 
  const extractYear = (yearString: string): string => {
    const yearPart = yearString.split(',')[1];
    return yearPart ? yearPart.trim() : '0';
  };

  // Function to find max/min crops 
  const findExtremeCrops = (crops: ICropProduction[]): {
    maxCrop: ICropProduction | null;
    minCrop: ICropProduction | null;
  } => {
    if (!crops.length) {
      return { maxCrop: null, minCrop: null };
    }

    // Finding max crop
    const maxCrop = crops.reduce((max, curr) =>
      curr.production > max.production ? curr : max,
      crops[0]
    );

    // Finding min crop
    const minCrop = crops.reduce((min, curr) =>
      curr.production < min.production ? curr : min,
      crops[0]
    );

    return { maxCrop, minCrop };
  };

  // Main function to generate Table A 
  function generateTableA(data: ICropData[]): ITableARow[] {

    // Group data by year 
    const yearGroups = data.reduce<IYearGroup>((acc, curr) => {
      const year = extractYear(curr.Year);
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(curr);
      return acc;
    }, {});

    // Process each year's data
    const output: ITableARow[] = Object.entries(yearGroups).map(([year, crops]) => {

      // Filter and transform valid crops
      const validCrops: ICropProduction[] = crops
        .filter(crop => crop["Crop Production (UOM:t(Tonnes))"] !== "")
        .map(crop => ({
          name: crop["Crop Name"],
          production: Number(crop["Crop Production (UOM:t(Tonnes))"])
        }))
        .filter(crop => !isNaN(crop.production));

      const { maxCrop, minCrop } = findExtremeCrops(validCrops);

      return {
        Year: parseInt(year),
        Max: maxCrop?.name || 0,
        Min: minCrop?.name || 0
      };
    });

    // Sort by year for consistent output
    return output.sort((a, b) => a.Year - b.Year);
  }


  const generateTableB = (data: ICropData[]) => {

    // Group data by crop
    const cropGroups = data.reduce<IYearGroup>((acc, curr) => {
      const cropName = curr["Crop Name"]
      if (!acc[cropName]) {
        acc[cropName] = [];
      }
      acc[cropName].push(curr);
      return acc;
    }, {});

    const output = Object.entries(cropGroups).map(([cropName, cropData]): ITableBRow => {

      // Filter out empty values and calculate averages
      const validYields = cropData
        .filter(d => d["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] !== "")
        .map(d => Number(d["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]));

      const validAreas = cropData
        .filter(d => d["Area Under Cultivation (UOM:Ha(Hectares))"] !== "")
        .map(d => Number(d["Area Under Cultivation (UOM:Ha(Hectares))"]));


      // Finding the avg yield
      const avgYield = validYields.length > 0
        ? validYields.reduce((sum, val) => sum + val, 0) / validYields.length
        : 0;

      // Finding the avg area
      const avgArea = validAreas.length > 0
        ? validAreas.reduce((sum, val) => sum + val, 0) / validAreas.length
        : 0;

      return {
        Crop: cropName,
        AvgYield: Number(avgYield.toFixed(3)),
        AvgCultivation: Number(avgArea.toFixed(3))
      };
    });

    return output
  }


  const Table1 = generateTableA(rawData);
  const Table2 = generateTableB(rawData)

  return (
    <>
      <MantineProvider theme={{
      colors: {
        brand: ['#E2F0FF', '#BAD9FF', '#91C3FF', '#69ACFF', '#4196FF', '#1980FF', '#006AFF', '#0054CC', '#003D99', '#002766'],
      },
      primaryColor: 'brand',
      components: {
        Title: {
          styles: {
            root: {
              '&[data-order="2"]': {
                fontSize: '2.5rem',
                fontWeight: 700,
              },
            },
          },
        },
      },
    }}>
      <Container size="xl" py="xl">
        {/* Centered Heading with bottom margin */}
        <Box mb={30}>
          <Title 
            order={2} 
            ta="center"
            variant="gradient"
          >
            Agricultural Crop Production & Yield Analysis 
          </Title>
        </Box>

        {/* Tables Container */}
        <div style={{ 
          display: "flex", 
          gap: "2rem",
          justifyContent: "space-between"
        }}>
          {/* Table A Card */}
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder 
            style={{ flex: 1 }}
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Text
                size="xl"
                fw={900}
                variant="gradient"
                gradient={{ from: 'pink', to: 'cyan', deg: 90 }}
                ta="center"
                mb="md"
              >
                Table A
              </Text>
            </Card.Section>
            
            <ScrollArea h={400} type="hover" scrollbarSize={8}>
              <TableDemo tableData={Table1} />
            </ScrollArea>
          </Card>

          {/* Table B Card */}
          <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder 
            style={{ flex: 1 }}
          >
            <Card.Section withBorder inheritPadding py="xs">
              <Text
                size="xl"
                fw={900}
                variant="gradient"
                gradient={{ from: 'pink', to: 'cyan', deg: 90 }}
                  ta="center"
                mb="md"
              >
                Table B
              </Text>
            </Card.Section>
            
            <ScrollArea h={400} type="hover" scrollbarSize={8}>
              <TableDemo tableData={Table2} />
            </ScrollArea>
          </Card>
        </div>
      </Container>
    </MantineProvider>
    </>
  )
}
