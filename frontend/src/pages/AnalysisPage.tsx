import React from 'react';
import { TopContactStrip } from '../components/layout/TopContactStrip';
import { Header } from '../components/layout/Header';
import { WasteAnalysisWorkspace } from '../components/analysis/WasteAnalysisWorkspace';
import { Footer } from '../components/layout/Footer';

export const AnalysisPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafbf9]">
      <TopContactStrip onOpenAuditModal={() => {}} />
      <Header
        onOpenAnalysis={() => {}}
        onOpenAudit={() => {}}
      />
      <main className="flex-1 py-10">
        <WasteAnalysisWorkspace id="analysis-page-workspace" />
      </main>
      <Footer
        onAnalyzeWaste={() => {}}
        onRequestAudit={() => {}}
      />
    </div>
  );
};
