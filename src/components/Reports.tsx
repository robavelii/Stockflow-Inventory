import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Product } from '@/types';
import { generateEfficiencyReport } from '@/services/aiService';
import { FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface ReportsProps {
  products: Product[];
}

export const Reports: React.FC<ReportsProps> = ({ products }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      // No API key needed - using mock AI service
      const result = await generateEfficiencyReport(products);
      setReport(result);
    } catch (err) {
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Supply Chain Analyst</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Generate inventory optimization strategies using AI analysis
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {!report && !loading && !error && (
          <div className="text-center py-12">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Ready to Optimize</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              Our AI will analyze your stock levels, turnover rates, and categorical distribution to
              provide actionable insights for purchasing and sales. This is a simulated AI analysis
              for demonstration purposes.
            </p>
            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-primary-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-primary-700 transition-colors font-medium shadow-lg shadow-slate-900/20 hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4" />
              Generate Optimization Report
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-300 font-medium">Crunching the numbers...</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Analyzing inventory data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Analysis Failed</h3>
            <p className="text-red-500 dark:text-red-400 mt-2">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium underline"
            >
              Try Again
            </button>
          </div>
        )}

        {report && (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <FileText className="w-5 h-5" />
                <span>Generated Report</span>
              </div>
              <button
                onClick={() => setReport(null)}
                className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Clear
              </button>
            </div>
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};