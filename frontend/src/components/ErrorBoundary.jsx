import React from "react";
import { ShieldAlert, RefreshCw, Terminal, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    // You could log to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden font-sans text-white">
          {/* Background Ambient */}
          <div className="absolute inset-0 bg-dot-grid opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-xl w-full relative z-10">
            {/* Header Identity */}
            <div className="flex items-center gap-3 mb-12">
              <div className="size-10 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="size-6 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">System<span className="text-red-500"> Breach</span></h1>
                <p className="font-mono-cipher text-[10px] text-zinc-500 uppercase tracking-widest">Critical Core Failure</p>
              </div>
            </div>

            {/* Error Content */}
            <div className="glass-card rounded-2xl border-red-500/20 bg-red-500/[0.02] p-8 space-y-8 relative overflow-hidden">
               {/* Red focus line */}
               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
               
               <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tighter leading-tight">
                    Unexpected<br />execution <span className="text-red-500">halt.</span>
                  </h2>
                  <p className="text-zinc-400 text-lg font-medium leading-relaxed">
                    The encryption layer encountered an unhandled exception. Secure session has been paused to prevent data leakage.
                  </p>
               </div>

               {/* Technical details (The mock cipher part) */}
               <div className="font-mono-cipher text-[11px] bg-black/40 border border-white/5 rounded-xl p-5 space-y-2 overflow-x-auto">
                  <div className="flex items-center gap-2 text-red-500/60 mb-2">
                    <Terminal className="size-3" />
                    <span className="uppercase tracking-[0.2em]">Crash Dump Log</span>
                  </div>
                  <p className="text-red-400/80">ERROR_CODE: SIG_ILL_0x3FF1</p>
                  <p className="text-zinc-500">SOURCE: {this.state.error?.toString() || "Unknown Component Tree"}</p>
                  <p className="text-zinc-600 italic">Attempting emergency protocol recovery...</p>
                  <div className="flex gap-1 mt-2">
                     {Array.from({length: 12}).map((_, i) => (
                        <div key={i} className={`h-1 w-3 rounded-full ${i < 4 ? 'bg-red-500' : 'bg-white/5 animate-pulse'}`} />
                     ))}
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 h-14 rounded-xl bg-white text-black font-bold text-sm tracking-wide hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                  >
                    <RefreshCw className="size-4" />
                    <span>Reboot System</span>
                  </button>
                  <a
                    href="/"
                    className="flex-1 h-14 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Home className="size-4" />
                    <span>Return to Safety</span>
                  </a>
               </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-[10px] font-mono-cipher text-zinc-700 tracking-[0.3em] uppercase">
               Authorized Personnel Only — CipherChat Secure Engine
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
