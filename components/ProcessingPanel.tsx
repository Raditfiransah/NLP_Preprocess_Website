
import React from 'react';
import { ProcessingOptions } from '../types';
import { Settings, Type, Scissors, Link as LinkIcon, Hash, Smile, AlignLeft, BookOpen, Layers, AtSign, Globe, Trash2, Edit3, MessageSquare, CheckCircle } from 'lucide-react';

interface ProcessingPanelProps {
  options: ProcessingOptions;
  setOptions: React.Dispatch<React.SetStateAction<ProcessingOptions>>;
  columns: string[];
  selectedColumn: string;
  setSelectedColumn: (col: string) => void;
  onProcess: () => void;
}

export const ProcessingPanel: React.FC<ProcessingPanelProps> = ({
  options,
  setOptions,
  columns,
  selectedColumn,
  setSelectedColumn,
  onProcess
}) => {

  const toggleOption = (key: keyof ProcessingOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Configuration Column */}
      <div className="lg:col-span-1 space-y-6">
        {/* Language Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Language
          </h3>
          <p className="text-sm text-slate-500 mb-3">Determines Stopwords and Stemming rules.</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setOptions(p => ({...p, language: 'en'}))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${options.language === 'en' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              English
            </button>
            <button 
              onClick={() => setOptions(p => ({...p, language: 'id'}))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${options.language === 'id' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Indonesia
            </button>
          </div>
        </div>

        {/* Column Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <AlignLeft className="w-5 h-5 mr-2 text-blue-600" />
            Target Column
          </h3>
          <select 
            value={selectedColumn} 
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        {/* Action Card */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Clean?</h3>
          <p className="text-sm text-blue-700 mb-4">
            Processing runs locally.
          </p>
          <button 
            onClick={onProcess}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors flex items-center justify-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            Process Dataset
          </button>
        </div>
      </div>

      {/* Options Grid */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Basic Cleaning */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center border-b pb-4">
            <Scissors className="w-5 h-5 mr-2 text-indigo-600" />
            Standard Text Cleaning
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox label="Lowercase Text" checked={options.lowercase} onChange={() => toggleOption('lowercase')} icon={<Type size={16} />} desc="Convert to lowercase." />
            <Checkbox label="Remove Punctuation" checked={options.removePunctuation} onChange={() => toggleOption('removePunctuation')} icon={<Scissors size={16} />} desc="Strip symbols (!?,.)." />
            <Checkbox label="Remove Numbers" checked={options.removeNumbers} onChange={() => toggleOption('removeNumbers')} icon={<Hash size={16} />} desc="Remove digits 0-9." />
            <Checkbox label="Remove URLs & Emails" checked={options.removeUrls} onChange={() => { toggleOption('removeUrls'); toggleOption('removeEmails'); }} icon={<LinkIcon size={16} />} desc="Remove http:// and emails." />
            <Checkbox label="Remove Emojis" checked={options.removeEmoji} onChange={() => toggleOption('removeEmoji')} icon={<Smile size={16} />} desc="Strip emoji characters." />
            <Checkbox label="Remove Mentions" checked={options.removeMentions} onChange={() => toggleOption('removeMentions')} icon={<AtSign size={16} />} desc="Remove @username." />
            <Checkbox label="Remove Hashtags" checked={options.removeHashtags} onChange={() => toggleOption('removeHashtags')} icon={<Hash size={16} />} desc="Remove #hashtags." />
            <Checkbox label="Trim Whitespace" checked={options.removeWhitespace} onChange={() => toggleOption('removeWhitespace')} icon={<AlignLeft size={16} />} desc="Single spaces only." />
          </div>
        </div>

        {/* NLP & Dataset */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-100">
             <div className="flex items-center justify-between mb-4 border-b border-indigo-200 pb-2">
               <h3 className="font-semibold text-indigo-900 flex items-center">
                 <Layers className="w-4 h-4 mr-2" /> NLP Operations
               </h3>
             </div>
             <div className="space-y-3">
               <Checkbox label="Remove Stopwords" checked={options.removeStopwords} onChange={() => toggleOption('removeStopwords')} icon={<BookOpen size={16} />} desc={`Common ${options.language === 'en' ? 'English' : 'Indonesian'} words.`} />
               <Checkbox label="Stemming / Root" checked={options.stemming} onChange={() => toggleOption('stemming')} icon={<Settings size={16} />} desc={`Root extraction (${options.language === 'en' ? 'Porter' : 'Sastrawi-lite'}).`} />
               <Checkbox label="Normalize Slang" checked={options.normalizeSlang} onChange={() => toggleOption('normalizeSlang')} icon={<Smile size={16} />} desc={`Fix ${options.language === 'en' ? 'u, idk' : 'yg, gk'} to formal.`} />
               <Checkbox label="Fix Typos / Formalize" checked={options.fixTypos} onChange={() => toggleOption('fixTypos')} icon={<CheckCircle size={16} />} desc={`Fix typos & ${options.language === 'en' ? 'spelling' : 'standardize'}.`} />
             </div>
           </div>

           <div className="bg-slate-50 p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
               <h3 className="font-semibold text-slate-900 flex items-center">
                 <Trash2 className="w-4 h-4 mr-2" /> Dataset Sanitization
               </h3>
             </div>
             <div className="space-y-3">
               <Checkbox label="Remove Duplicates" checked={options.removeDuplicates} onChange={() => toggleOption('removeDuplicates')} icon={<Layers size={16} />} desc="Drop duplicate text rows." />
               <Checkbox label="Remove Empty Rows" checked={options.removeMissingValues} onChange={() => toggleOption('removeMissingValues')} icon={<Trash2 size={16} />} desc="Drop rows if text is empty." />
               <Checkbox label="Fix Repeated Chars" checked={options.removeRepeatedChars} onChange={() => toggleOption('removeRepeatedChars')} icon={<Type size={16} />} desc="sooooo -> so" />
             </div>
           </div>
        </div>

        {/* Custom Configuration Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center border-b pb-4">
                <Edit3 className="w-5 h-5 mr-2 text-purple-600" />
                Advanced Customization
             </h3>
             
             <div className="space-y-6">
               {/* Regex */}
               <div>
                  <div className="flex items-start mb-2">
                      <input 
                        type="checkbox" 
                        checked={options.customCleaning} 
                        onChange={() => toggleOption('customCleaning')}
                        className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 w-full">
                        <label className="text-sm font-medium text-slate-900">Custom Regex Find & Replace</label>
                        <div className="flex gap-2 mt-2">
                          <input 
                            value={options.customFind}
                            onChange={(e) => setOptions(prev => ({ ...prev, customFind: e.target.value }))}
                            disabled={!options.customCleaning}
                            placeholder="Regex (e.g. \b[0-9]+\b)"
                            className="w-1/2 p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                          />
                          <input 
                            value={options.customReplace}
                            onChange={(e) => setOptions(prev => ({ ...prev, customReplace: e.target.value }))}
                            disabled={!options.customCleaning}
                            placeholder="Replace with..."
                            className="w-1/2 p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                          />
                        </div>
                      </div>
                  </div>
               </div>

               {/* Divider */}
               <div className="border-t border-slate-100"></div>

               {/* Custom Slang */}
               <div>
                  <div className="flex items-start">
                      <input 
                        type="checkbox" 
                        checked={options.useCustomSlang} 
                        onChange={() => toggleOption('useCustomSlang')}
                        className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 w-full">
                        <div className="flex items-center mb-1">
                          <label className="text-sm font-medium text-slate-900">Custom Dictionary / Slang</label>
                          <span className="ml-2 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">key=value</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">Define your own substitutions. Example:</p>
                        <textarea 
                          value={options.customSlangRaw}
                          onChange={(e) => setOptions(prev => ({ ...prev, customSlangRaw: e.target.value }))}
                          disabled={!options.useCustomSlang}
                          placeholder={`brb=be right back\ngg=good game\nl8r=later`}
                          className="w-full h-24 p-2 text-sm border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 font-mono"
                        />
                      </div>
                  </div>
               </div>
             </div>
        </div>
      </div>
    </div>
  );
};

const Checkbox = ({ label, checked, onChange, icon, desc }: { label: string, checked: boolean, onChange: () => void, icon: React.ReactNode, desc: string }) => (
  <div 
    onClick={onChange}
    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-start space-x-3
      ${checked ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
  >
    <div className={`mt-0.5 p-1 rounded ${checked ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-semibold ${checked ? 'text-blue-900' : 'text-slate-700'}`}>{label}</h4>
      <p className={`text-xs mt-0.5 ${checked ? 'text-blue-700' : 'text-slate-500'}`}>{desc}</p>
    </div>
  </div>
);