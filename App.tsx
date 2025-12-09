
import React, { useState } from 'react';
import Papa from 'papaparse';
import { FileUpload } from './components/FileUpload';
import { ProcessingPanel } from './components/ProcessingPanel';
import { StepIndicator } from './components/StepIndicator';
import { ProcessingOptions, DatasetRow, ProcessingStatus } from './types';
import { processText } from './services/localProcessor';
import { Download, PlayCircle, RefreshCw, Zap, Globe, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState('');
  const [rawData, setRawData] = useState<DatasetRow[]>([]);
  const [processedData, setProcessedData] = useState<DatasetRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [removedStats, setRemovedStats] = useState({ empty: 0, duplicates: 0 });

  // Pagination State
  const [previewPage, setPreviewPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [options, setOptions] = useState<ProcessingOptions>({
    language: 'en',
    lowercase: true,
    removePunctuation: true,
    removeNumbers: false,
    removeUrls: true,
    removeEmails: true,
    removeEmoji: true,
    removeMentions: true,
    removeHashtags: false,
    removeRepeatedChars: false,
    removeWhitespace: true,
    removeStopwords: false,
    stemming: false,
    normalizeSlang: false,
    fixTypos: false,
    useCustomSlang: false,
    customSlangRaw: '',
    removeDuplicates: false,
    removeMissingValues: true,
    customCleaning: false,
    customFind: '',
    customReplace: ''
  });

  const handleDataLoaded = (data: DatasetRow[], name: string) => {
    setRawData(data);
    setFileName(name);
    if (data.length > 0) {
      const cols = Object.keys(data[0]);
      setColumns(cols);
      // Try to auto-detect text column
      const textCol = cols.find(c => c.toLowerCase().includes('text') || c.toLowerCase().includes('content') || c.toLowerCase().includes('review') || c.toLowerCase().includes('comment')) || cols[0];
      setSelectedColumn(textCol);
      setStep(2);
    }
  };

  const runProcessing = async () => {
    setStatus('processing');
    setStep(3);
    setProgress(0);
    setRemovedStats({ empty: 0, duplicates: 0 });
    setPreviewPage(1); // Reset pagination on new process

    setTimeout(async () => {
      let tempProcessed: DatasetRow[] = [];
      const startTime = performance.now();
      const seenTexts = new Set<string>();
      let emptyCount = 0;
      let duplicateCount = 0;

      try {
        const total = rawData.length;
        
        for (let i = 0; i < total; i++) {
          const row = rawData[i];
          const originalText = String(row[selectedColumn] || '');
          
          // 1. Missing Value Check (Pre-processing)
          if (!originalText.trim() && options.removeMissingValues) {
             emptyCount++;
             continue;
          }

          // 2. Text Processing
          const cleanedText = await processText(originalText, options);

          // 3. Missing Value Check (Post-processing check - if cleaning made it empty)
          if (!cleanedText.trim() && options.removeMissingValues) {
             emptyCount++;
             continue;
          }

          // 4. Duplicate Check
          if (options.removeDuplicates) {
            if (seenTexts.has(cleanedText)) {
              duplicateCount++;
              continue;
            }
            seenTexts.add(cleanedText);
          }
          
          tempProcessed.push({
            ...row,
            [`processed_${selectedColumn}`]: cleanedText
          });

          // Update progress
          if (i % 50 === 0) {
            setProgress(Math.round(((i + 1) / total) * 100));
            await new Promise(resolve => setTimeout(resolve, 0)); 
          }
        }
        
        const endTime = performance.now();
        console.log(`Processing complete in ${(endTime - startTime).toFixed(2)}ms`);

        setRemovedStats({ empty: emptyCount, duplicates: duplicateCount });
        setProgress(100);
        setProcessedData(tempProcessed);
        setStatus('completed');
        setStep(4);
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    }, 100);
  };

  const handleDownload = () => {
    const csv = Papa.unparse(processedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clean_${fileName.replace('.json', '.csv')}`); // Force CSV download for NLP compatibility
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setStep(1);
    setRawData([]);
    setProcessedData([]);
    setStatus('idle');
    setPreviewPage(1);
    setRowsPerPage(10);
  };

  // Pagination Logic
  const totalPages = Math.ceil(processedData.length / rowsPerPage);
  const startIndex = (previewPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-blue-600 p-2 rounded-lg">
               <RefreshCw className="text-white w-5 h-5" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">NLP Prep Studio</h1>
               <span className="text-xs text-slate-500 font-medium">Offline Preprocessing Tool</span>
             </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <Globe className="w-3 h-3 mr-1" />
              Multi-Language
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              Offline Mode
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator currentStep={step} />

        {step === 1 && (
          <div className="mt-8 animate-fade-in">
             <div className="text-center mb-10">
               <h2 className="text-3xl font-bold text-slate-900">Prepare your data for NLP Training</h2>
               <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
                 Clean and normalize datasets for BERT, RoBERTa, or LSTM models.
                 <br/>Supports <strong>CSV</strong> & <strong>JSON</strong> with English and Indonesian pipelines.
               </p>
             </div>
             <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 animate-fade-in">
            <ProcessingPanel 
              options={options} 
              setOptions={setOptions}
              columns={columns}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              onProcess={runProcessing}
            />
          </div>
        )}

        {step === 3 && (
          <div className="mt-20 flex flex-col items-center justify-center animate-fade-in text-center">
             <div className="w-full max-w-md">
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-semibold text-blue-700">Cleaning Dataset...</span>
                 <span className="text-sm font-bold text-blue-700">{progress}%</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                 <div 
                   className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 />
               </div>
               <p className="mt-6 text-slate-500">
                 Applying regex, stemming, and filtering logic...
               </p>
               <div className="mt-8">
                  <RefreshCw className="w-12 h-12 text-blue-200 animate-spin mx-auto" />
               </div>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 animate-fade-in">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Preprocessing Complete!</h2>
                  <p className="text-slate-500">Ready for model ingestion.</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={reset} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium transition-colors">
                    Start Over
                  </button>
                  <button onClick={handleDownload} className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 font-medium flex items-center transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Download Clean CSV
                  </button>
                </div>
             </div>

             {/* Stats Cards */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <span className="text-xs text-slate-500 uppercase font-bold">Total Rows</span>
                  <p className="text-2xl font-bold text-slate-900">{rawData.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <span className="text-xs text-green-600 uppercase font-bold">Retained</span>
                  <p className="text-2xl font-bold text-green-600">{processedData.length}</p>
                </div>
                {(removedStats.empty > 0 || removedStats.duplicates > 0) && (
                  <>
                  <div className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-100">
                    <span className="text-xs text-orange-600 uppercase font-bold">Removed Duplicates</span>
                    <p className="text-2xl font-bold text-orange-700">{removedStats.duplicates}</p>
                  </div>
                   <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-100">
                    <span className="text-xs text-red-600 uppercase font-bold">Removed Empty</span>
                    <p className="text-2xl font-bold text-red-700">{removedStats.empty}</p>
                  </div>
                  </>
                )}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                   <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-700">Data Preview</h3>
                        <span className="text-xs text-slate-400">Comparing Original vs Processed</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-500 font-medium">Show:</span>
                        <select 
                          value={rowsPerPage} 
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setPreviewPage(1);
                          }}
                          className="text-sm border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white py-1 pl-2 pr-6"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>
                   </div>
                   
                   <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((row, idx) => {
                           // Use absolute index for key to prevent render issues
                           const absIndex = startIndex + idx;
                           return (
                            <div key={absIndex} className="p-4 grid grid-cols-2 gap-6 text-sm group hover:bg-slate-50 transition-colors">
                              <div className="opacity-60">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-slate-600 font-mono text-xs">RAW #{absIndex + 1}</span>
                                </div>
                                <p className="text-slate-700 break-words">{String(row[selectedColumn])}</p>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-green-600 font-mono text-xs font-bold">CLEAN</span>
                                </div>
                                <p className="text-slate-900 font-medium break-words">{String(row[`processed_${selectedColumn}`])}</p>
                              </div>
                            </div>
                           );
                        })
                      ) : (
                        <div className="p-8 text-center text-slate-500">No data to display.</div>
                      )}
                   </div>

                   {/* Pagination Footer */}
                   <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between mt-auto">
                      <span className="text-sm text-slate-500 font-medium">
                        Page {previewPage} of {totalPages || 1}
                      </span>
                      <div className="flex space-x-2">
                         <button 
                           onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                           disabled={previewPage === 1}
                           className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all"
                         >
                           <ChevronLeft className="w-5 h-5 text-slate-600" />
                         </button>
                         <button 
                           onClick={() => setPreviewPage(p => Math.min(totalPages, p + 1))}
                           disabled={previewPage === totalPages || totalPages === 0}
                           className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all"
                         >
                           <ChevronRight className="w-5 h-5 text-slate-600" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-900 text-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-bold mb-3">Model Ready</h3>
                    <p className="text-blue-200 text-sm mb-4">
                      This dataset is optimized for:
                    </p>
                    <ul className="space-y-2 text-sm text-white font-medium">
                      <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-400" /> BERT / DistilBERT</li>
                      <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-400" /> RoBERTa (IndoBERT)</li>
                      <li className="flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-400" /> LSTM / GRU</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-2">Applied Pipeline</h4>
                    <div className="flex flex-wrap gap-2">
                       {options.lowercase && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Lowercase</span>}
                       {options.removeStopwords && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Stopwords ({options.language})</span>}
                       {options.stemming && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Stemming</span>}
                       {options.removeDuplicates && <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Deduplication</span>}
                       {(options.normalizeSlang || options.useCustomSlang) && <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded font-medium">Slang Fix</span>}
                       {options.fixTypos && <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded font-medium">Typo Correction</span>}
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}