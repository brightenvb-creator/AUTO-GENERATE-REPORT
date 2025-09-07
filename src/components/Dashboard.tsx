import React, { useState } from 'react';
import { LogOut, Download, FileText, BarChart3, Settings, Upload as UploadIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UploadedFile } from '../types';
import { processData } from '../utils/dataProcessor';
import { generatePDFReport, generateCSVReport } from '../utils/reportGenerator';
import FileUpload from './FileUpload';
import DataSummary from './DataSummary';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'reports'>('upload');
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);

  const handleFileProcessed = (file: UploadedFile) => {
    const { processedData, summary } = processData(file.data);
    const updatedFile = { ...file, processedData, summary };
    
    setFiles(prev => [...prev, updatedFile]);
    setSelectedFile(updatedFile);
    setActiveTab('analysis');
  };

  const handleGeneratePDF = () => {
    if (selectedFile && user) {
      generatePDFReport(selectedFile, user);
    }
  };

  const handleGenerateCSV = () => {
    if (selectedFile) {
      generateCSVReport(selectedFile);
    }
  };

  const tabs = [
    { id: 'upload', label: 'Upload Data', icon: UploadIcon },
    { id: 'analysis', label: 'Analysis', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Report Generator
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-gray-500">{user?.company}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'upload' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FileUpload onFileProcessed={handleFileProcessed} />
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Files</h3>
                  {files.length === 0 ? (
                    <p className="text-gray-500 text-sm">No files uploaded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {files.slice(0, 5).map((file) => (
                        <div
                          key={file.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedFile?.id === file.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedFile(file)}
                        >
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • {file.summary?.totalRows || 0} rows
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && selectedFile && (
            <DataSummary file={selectedFile} />
          )}

          {activeTab === 'analysis' && !selectedFile && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No File Selected</h3>
              <p className="text-gray-500">Upload a file or select from your recent uploads to view analysis</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Reports</h3>
                
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Selected File</h4>
                      <p className="text-sm text-blue-700">{selectedFile.name}</p>
                      <p className="text-xs text-blue-600">
                        {selectedFile.summary?.totalRows || 0} rows, {selectedFile.summary?.columns.length || 0} columns
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={handleGeneratePDF}
                        className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Generate PDF Report</span>
                      </button>
                      
                      <button
                        onClick={handleGenerateCSV}
                        className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        <Download className="w-5 h-5" />
                        <span>Download Processed CSV</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Select a file to generate reports</p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Templates</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Executive Summary</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Comprehensive overview with key metrics and visualizations
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Data Quality Report</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Detailed analysis of data cleaning and processing steps
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900">Statistical Analysis</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      In-depth statistical insights and correlations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;