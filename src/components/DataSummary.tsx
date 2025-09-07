import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Database, TrendingUp, Users, FileText } from 'lucide-react';
import { UploadedFile } from '../types';

interface DataSummaryProps {
  file: UploadedFile;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const DataSummary: React.FC<DataSummaryProps> = ({ file }) => {
  if (!file.summary) return null;

  const { summary, processedData } = file;

  // Create chart data for numerical columns
  const numericalChartData = summary.numericalColumns.slice(0, 6).map(column => ({
    name: column,
    value: summary.stats[column]?.average || 0,
    count: summary.stats[column]?.count || 0
  }));

  // Create chart data for categorical columns
  const categoricalChartData = summary.categoricalColumns.slice(0, 6).map((column, index) => ({
    name: column,
    value: summary.stats[column]?.unique || 0,
    fill: COLORS[index % COLORS.length]
  }));

  // Sample data preview
  const previewData = processedData?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">{summary.totalRows.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Columns</p>
              <p className="text-2xl font-bold text-gray-900">{summary.columns.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Duplicates Removed</p>
              <p className="text-2xl font-bold text-gray-900">{summary.duplicatesRemoved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Missing Values Fixed</p>
              <p className="text-2xl font-bold text-gray-900">{summary.missingValuesHandled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Numerical Data Chart */}
        {numericalChartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Numerical Column Averages</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={numericalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [Number(value).toFixed(2), 'Average']}
                  labelFormatter={(label) => `Column: ${label}`}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Categorical Data Chart */}
        {categoricalChartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorical Column Unique Values</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoricalChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoricalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Data Preview */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview (First 5 Rows)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Column Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Column Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(summary.stats).map(([column, stats]) => (
            <div key={column} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{column}</h4>
              <div className="space-y-1 text-sm">
                {stats.min !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-medium">{stats.min.toFixed(2)}</span>
                  </div>
                )}
                {stats.max !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-medium">{stats.max.toFixed(2)}</span>
                  </div>
                )}
                {stats.average !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg:</span>
                    <span className="font-medium">{stats.average.toFixed(2)}</span>
                  </div>
                )}
                {stats.unique !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unique:</span>
                    <span className="font-medium">{stats.unique}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Count:</span>
                  <span className="font-medium">{stats.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataSummary;