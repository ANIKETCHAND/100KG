/**
 * 100KG Performance OS — Resilient Error Boundary
 * Prevents complete app blank screens when a 3D scene, WebGL context, or child component throws.
 */

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[100KG Crash Caught by ErrorBoundary]:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[280px] w-full flex items-center justify-center p-6 bg-[#080d08] border border-red-500/20 rounded-2xl text-center">
          <div className="max-w-md space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold font-sans text-white uppercase tracking-wide">
                {this.props.fallbackTitle || "Performance Module Interrupted"}
              </h3>
              <p className="text-xs text-[#8b9c8a] mt-1 font-mono">
                {this.props.fallbackMessage ||
                  this.state.error?.message ||
                  "An unexpected rendering error occurred. The system has prevented a full crash."}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#c6ff3d] hover:bg-[#b0eb2f] text-[#080c09] text-xs font-bold font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Recover Component</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
