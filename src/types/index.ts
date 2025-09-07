export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  industry: 'finance' | 'admin' | 'hr';
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  data: Record<string, any>[];
  processedData?: Record<string, any>[];
  summary?: DataSummary;
}

export interface DataSummary {
  totalRows: number;
  duplicatesRemoved: number;
  missingValuesHandled: number;
  columns: string[];
  numericalColumns: string[];
  categoricalColumns: string[];
  stats: Record<string, {
    min?: number;
    max?: number;
    average?: number;
    count?: number;
    unique?: number;
  }>;
}

export interface ReportTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  fields: string[];
}