"use client";

import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="size-12 rounded-2xl bg-rose-100 text-2xl grid place-items-center">!</div>
          <h2 className="text-lg font-black text-slate-950">Terjadi Kesalahan</h2>
          <p className="max-w-sm text-sm text-slate-500">{this.state.error?.message || "Something went wrong"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded-2xl bg-slate-950 px-6 py-2 text-sm font-bold text-white"
          >
            Coba Lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
