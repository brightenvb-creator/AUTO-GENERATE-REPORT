import { DataSummary } from '../types';

export const processData = (data: Record<string, any>[]): { 
  processedData: Record<string, any>[], 
  summary: DataSummary 
} => {
  if (!data || data.length === 0) {
    return {
      processedData: [],
      summary: {
        totalRows: 0,
        duplicatesRemoved: 0,
        missingValuesHandled: 0,
        columns: [],
        numericalColumns: [],
        categoricalColumns: [],
        stats: {}
      }
    };
  }

  const originalLength = data.length;
  const columns = Object.keys(data[0] || {});
  
  // Remove duplicates
  const uniqueData = data.filter((item, index, arr) => 
    index === arr.findIndex(t => JSON.stringify(t) === JSON.stringify(item))
  );
  
  const duplicatesRemoved = originalLength - uniqueData.length;
  
  // Handle missing values
  let missingValuesHandled = 0;
  const processedData = uniqueData.map(row => {
    const newRow = { ...row };
    
    Object.keys(newRow).forEach(key => {
      if (newRow[key] === null || newRow[key] === undefined || newRow[key] === '') {
        missingValuesHandled++;
        
        // Fill missing values based on column type
        const columnValues = uniqueData
          .map(r => r[key])
          .filter(v => v !== null && v !== undefined && v !== '');
        
        if (columnValues.length > 0) {
          const firstValue = columnValues[0];
          
          if (typeof firstValue === 'number') {
            // Use mean for numerical values
            const sum = columnValues.reduce((acc, val) => acc + (Number(val) || 0), 0);
            newRow[key] = sum / columnValues.length;
          } else {
            // Use mode for categorical values
            const mode = columnValues
              .sort((a, b) => 
                columnValues.filter(v => v === a).length - columnValues.filter(v => v === b).length
              )
              .pop();
            newRow[key] = mode || 'Unknown';
          }
        } else {
          newRow[key] = typeof newRow[key] === 'number' ? 0 : 'Unknown';
        }
      }
    });
    
    return newRow;
  });

  // Generate statistics
  const numericalColumns: string[] = [];
  const categoricalColumns: string[] = [];
  const stats: Record<string, any> = {};

  columns.forEach(column => {
    const values = processedData.map(row => row[column]);
    const numericValues = values.filter(v => !isNaN(Number(v))).map(Number);
    
    if (numericValues.length > values.length * 0.5) {
      // Mostly numeric column
      numericalColumns.push(column);
      stats[column] = {
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        count: numericValues.length
      };
    } else {
      // Categorical column
      categoricalColumns.push(column);
      const uniqueValues = [...new Set(values)];
      stats[column] = {
        unique: uniqueValues.length,
        count: values.length
      };
    }
  });

  return {
    processedData,
    summary: {
      totalRows: processedData.length,
      duplicatesRemoved,
      missingValuesHandled,
      columns,
      numericalColumns,
      categoricalColumns,
      stats
    }
  };
};