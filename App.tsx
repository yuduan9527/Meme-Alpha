import React, { useState } from 'react';
import { Search, Zap, Code, Terminal, AlertCircle } from 'lucide-react';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { analyzeMemeNarrative } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';

function App() {
  const [name, setName] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contractAddress) return;

    setStatus(AnalysisState.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeMemeNarrative(name, contractAddress);
      setResult(data);
      setStatus(AnalysisState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check the API key or try again later.");
      setStatus(AnalysisState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-crypto-dark relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-green/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/5 blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center mb-16 w-full animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-neon-green text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            SYSTEM_ONLINE // V2.5.0
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-4">
            MEME <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-purple">AGENT</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            AI-powered narrative decoding for crypto assets.
            <br className="hidden md:block"/>
            Paste the CA, we find the alpha.
          </p>
        </header>

        {/* Search Input Section */}
        <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-12">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-neon-green uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} /> Asset Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. PEPE"
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-neon-purple uppercase tracking-widest flex items-center gap-2">
                  <Code size={12} /> Contract Address (CA)
                </label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-black/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              isLoading={status === AnalysisState.ANALYZING} 
              className="w-full"
            >
              {status === AnalysisState.ANALYZING ? 'Scanning Blockchain...' : 'Initialize Analysis'}
              {!status && <Terminal size={18} />}
            </Button>
          </form>
        </div>

        {/* Loading State Visualization */}
        {status === AnalysisState.ANALYZING && (
          <div className="w-full max-w-2xl mb-12 font-mono text-sm text-slate-500 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-neon-green">➜</span>
              <span>Connecting to Mainnet... <span className="text-green-500">OK</span></span>
            </div>
            <div className="flex items-center gap-3 animate-pulse delay-75">
              <span className="text-neon-green">➜</span>
              <span>Scanning Social Sentiment...</span>
            </div>
            <div className="flex items-center gap-3 animate-pulse delay-150">
              <span className="text-neon-green">➜</span>
              <span>Validating Contract Narrative...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === AnalysisState.ERROR && error && (
          <div className="w-full max-w-2xl bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 text-red-200 mb-12">
            <AlertCircle className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">System Error</h4>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Result Output */}
        {status === AnalysisState.SUCCESS && result && (
          <ResultCard result={result} />
        )}

      </div>
    </div>
  );
}

export default App;