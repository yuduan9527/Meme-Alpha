import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult, GroundingSource } from '../types';
import { ExternalLink, CheckCircle, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Main Analysis Terminal */}
      <div className="bg-crypto-card border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
        {/* Top Bar */}
        <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="text-xs font-mono text-slate-400">ANALYSIS_OUTPUT.MD</div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 text-slate-200">
          <article className="prose prose-invert prose-headings:text-neon-green prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2 prose-strong:text-white max-w-none font-sans">
             <ReactMarkdown 
              components={{
                h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 flex items-center gap-2" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-slate-300" {...props} />,
                li: ({node, ...props}) => <li className="mb-2" {...props} />,
              }}
             >
              {result.markdown}
             </ReactMarkdown>
          </article>
        </div>
        
        {/* Footer Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-green"></div>
      </div>

      {/* Sources Section */}
      {result.sources.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-mono text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
            <ExternalLink size={14} /> Sources / Intel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.sources.slice(0, 6).map((source, index) => (
              <a
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-neon-purple/50 transition-all group"
              >
                <div className="mt-1 text-neon-green group-hover:text-neon-purple transition-colors">
                  <ExternalLink size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                    {source.title}
                  </div>
                  <div className="text-xs text-slate-500 truncate font-mono">
                    {new URL(source.uri).hostname}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};