import React, { useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle, FileJson } from 'lucide-react';
import Papa from 'papaparse';

interface FileUploadProps {
  onDataLoaded: (data: any[], fileName: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const processFile = (file: File) => {
    setError(null);
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            onDataLoaded(results.data, file.name);
          } else {
            setError("The CSV file appears to be empty or invalid.");
          }
        },
        error: (err) => {
          setError(`Error parsing CSV: ${err.message}`);
        }
      });
    } else if (fileName.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (Array.isArray(json) && json.length > 0) {
             onDataLoaded(json, file.name);
          } else {
             setError("JSON must be an array of objects.");
          }
        } catch (err) {
          setError("Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    } else {
      setError("Unsupported format. Please upload CSV or JSON.");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) processFile(files[0]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10">
      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          id="fileInput" 
          type="file" 
          accept=".csv,.json" 
          className="hidden" 
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <UploadCloud className="w-10 h-10 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Upload your dataset</h3>
            <p className="text-sm text-slate-500 mt-1">Drag and drop or click to browse</p>
            <div className="flex gap-2 justify-center mt-2">
               <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded flex items-center"><FileText size={10} className="mr-1"/> CSV</span>
               <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded flex items-center"><FileJson size={10} className="mr-1"/> JSON</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center">
          <AlertCircle size={16} className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};