
import React from 'react';
import { ForensicReport } from '../types.ts';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  report: ForensicReport;
  onReset: () => void;
}

const ForensicDashboard: React.FC<Props> = ({ report, onReset }) => {
  const chartData = [
    { name: 'Score', value: report.authenticity_score },
    { name: 'Remaining', value: 100 - report.authenticity_score },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
      case 'Suspect': return 'text-amber-400 border-amber-500 bg-amber-500/10';
      case 'Counterfeit': return 'text-rose-400 border-rose-500 bg-rose-500/10';
      default: return 'text-slate-400 border-slate-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 80) return '#10b981';
    if (score > 50) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Forensic Recommendation - Top Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-xl space-y-4 border border-blue-400/20">
        <h3 className="text-xl font-bold flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          Forensic Recommendation
        </h3>
        <p className="text-xl font-bold text-white leading-relaxed">
          {report.recommendation}
        </p>
        <div className="pt-2 text-xs text-white/60 font-mono tracking-widest uppercase">
          PHARM-AUDIT CASE REF: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white tracking-tight">Forensic Audit Result</h1>
            <span className={`px-4 py-1 rounded-full border text-sm font-semibold uppercase tracking-wider ${getStatusColor(report.status)}`}>
              {report.status}
            </span>
          </div>
          <p className="text-slate-400 max-w-xl">{report.reasoning_summary}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  <Cell fill={getScoreColor(report.authenticity_score)} />
                  <Cell fill="#1e293b" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xl font-bold">{report.authenticity_score}%</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors border border-slate-600"
          >
            New Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4 shadow-inner">
          <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Extracted Data
          </h2>
          <div className="space-y-3">
            {Object.entries(report.extracted_data).map(([key, value]) => (
              <div key={key} className="flex flex-col border-b border-slate-700/50 pb-2 last:border-0">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{key.replace('_', ' ')}</span>
                <span className="text-slate-200 font-medium truncate">{value || 'Not detected'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            Visual Forensics
          </h2>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-tighter">Analysis Findings</span>
              <ul className="space-y-1.5">
                {report.visual_forensics.findings.map((f, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2 leading-snug">
                    <span className="text-indigo-500 font-bold">•</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            {report.visual_forensics.red_flags.length > 0 && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <span className="text-xs font-bold text-rose-400 block mb-2 uppercase">Integrity Red Flags</span>
                <ul className="space-y-1">
                  {report.visual_forensics.red_flags.map((f, i) => (
                    <li key={i} className="text-sm text-rose-300 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-2 border-t border-slate-700/50">
              <div className={`text-center p-2 rounded text-[10px] font-bold uppercase tracking-widest ${report.visual_forensics.assets.qr_present ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700/30 text-slate-500 border border-slate-700'}`}>
                Security Markers: {report.visual_forensics.assets.qr_present ? 'DETECTED' : 'NOT DETECTED'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 space-y-4">
          <h2 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            Registry Check
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 ${report.grounding_check.manufacturer_verified ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Mfg Registry</span>
                <span className={`font-bold text-sm ${report.grounding_check.manufacturer_verified ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.grounding_check.manufacturer_verified ? 'VERIFIED' : 'FAILED'}
                </span>
              </div>
              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1 ${report.grounding_check.batch_valid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <span className="text-[10px] uppercase text-slate-400 font-bold">Batch Logic</span>
                <span className={`font-bold text-sm ${report.grounding_check.batch_valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.grounding_check.batch_valid ? 'VALID' : 'INVALID'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-tighter">Market Alerts (2025-2026)</span>
              {report.grounding_check.alerts_found.length > 0 ? (
                <ul className="space-y-2">
                  {report.grounding_check.alerts_found.map((a, i) => (
                    <li key={i} className="text-xs p-2 bg-rose-500/10 text-rose-300 rounded border border-rose-500/20 flex items-start gap-2">
                      <svg className="w-3 h-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-emerald-400 bg-emerald-500/5 p-2 rounded border border-emerald-500/10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Registry Clear
                </div>
              )}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-500 block mb-2 uppercase tracking-widest">Evidence Links</span>
              <div className="flex flex-wrap gap-2">
                {report.grounding_check.sources?.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[9px] px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors border border-slate-600 max-w-[140px] truncate"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicDashboard;
