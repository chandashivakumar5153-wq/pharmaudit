
import React, { useState, useRef } from 'react';
import { AnalysisStep, ForensicReport } from './types.ts';
import { GeminiService } from './services/geminiService.ts';
import ForensicDashboard from './components/ForensicDashboard.tsx';

const App: React.FC = () => {
  const [step, setStep] = useState<AnalysisStep>(AnalysisStep.IDLE);
  const [preview, setPreview] = useState<string | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const geminiService = useRef(new GeminiService());

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setReport(null);
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start analysis
    await performAnalysis(file);
  };

  const performAnalysis = async (file: File) => {
    setStep(AnalysisStep.EXTRACTING);
    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });

      // Simulate step progression for better UX
      setTimeout(() => setStep(AnalysisStep.VERIFYING), 2000);
      setTimeout(() => setStep(AnalysisStep.REASONING), 5000);

      const result = await geminiService.current.analyzeMedicine(base64, file.type);
      setReport(result);
      setStep(AnalysisStep.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during the forensic audit.");
      setStep(AnalysisStep.ERROR);
    }
  };

  const reset = () => {
    setStep(AnalysisStep.IDLE);
    setPreview(null);
    setReport(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-slate-100 uppercase">Pharm<span className="text-cyan-400">Audit</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <span>Indian Market Forensic Division</span>
          <span>•</span>
          <span>CDSCO Compliance Engine</span>
          <span>•</span>
          <span>v3.4.1</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl">
        {step === AnalysisStep.IDLE && (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">Detect Counterfeit Medicines <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">with Forensic AI.</span></h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                Perform professional-grade analysis of pharmaceutical packaging. Extract batch data, verify license numbers against CDSCO databases, and identify visual red flags instantly.
              </p>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md p-10 border-2 border-dashed border-slate-700 rounded-3xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-slate-200">Upload Package Image</p>
                  <p className="text-sm text-slate-500">Drag & drop or click to browse files</p>
                </div>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*,video/*" 
              className="hidden" 
            />
          </div>
        )}

        {(step === AnalysisStep.EXTRACTING || step === AnalysisStep.VERIFYING || step === AnalysisStep.REASONING) && (
          <div className="flex flex-col items-center justify-center py-20 space-y-12">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-slate-800 rounded-full flex items-center justify-center">
                <div className="w-24 h-24 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-cyan-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
            </div>
            
            <div className="space-y-6 w-full max-w-sm">
              <div className="flex flex-col items-center gap-2">
                <p className="text-2xl font-bold text-white uppercase tracking-tighter">Forensic Audit Active</p>
                <p className="text-slate-400 font-medium">Scanning multimodal artifacts...</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { step: AnalysisStep.EXTRACTING, label: 'OCR & Visual Asset Extraction' },
                  { step: AnalysisStep.VERIFYING, label: 'CDSCO Database Grounding' },
                  { step: AnalysisStep.REASONING, label: 'Forensic Logic Processing' }
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    step === item.step ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-800/50 border-slate-700 text-slate-500 opacity-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${step === item.step ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`}></div>
                    <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === AnalysisStep.COMPLETED && report && (
          <ForensicDashboard report={report} onReset={reset} />
        )}

        {step === AnalysisStep.ERROR && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center border border-rose-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-white">Forensic Audit Failed</h3>
              <p className="text-slate-400 max-w-md">{error}</p>
            </div>
            <button onClick={reset} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all">
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-auto py-8 text-center text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        Secure Forensic Pipeline • AES-256 Encrypted Transfer • Private CDSCO Endpoint
      </footer>
    </div>
  );
};

export default App;
