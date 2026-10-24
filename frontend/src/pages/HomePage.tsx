import React, { useState } from 'react';
import { TopContactStrip } from '../components/layout/TopContactStrip';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { IntroWelcomeSection } from '../components/sections/IntroWelcomeSection';
import { ServicesSection } from '../components/sections/ServicesSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ProcessSection } from '../components/sections/ProcessSection';
import { InsightsSection } from '../components/sections/InsightsSection';
import { StakeholderBenefitsSection } from '../components/sections/StakeholderBenefitsSection';
import { PrimaryCtaSection } from '../components/sections/PrimaryCtaSection';
import { WasteAnalysisWorkspace } from '../components/analysis/WasteAnalysisWorkspace';
import { SiteAuditQuoteSection } from '../components/sections/SiteAuditQuoteSection';
import { Footer } from '../components/layout/Footer';
import { WasteAnalysisModal } from '../components/analysis/WasteAnalysisModal';

export const HomePage: React.FC = () => {
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const scrollToAnalysis = () => {
    const el = document.getElementById('analysis-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsAnalysisModalOpen(true);
    }
  };

  const scrollToAudit = () => {
    const el = document.getElementById('quote');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbf9] text-[#1e293b]">
      {/* Top Contact & Initiative Strip */}
      <TopContactStrip onOpenAuditModal={scrollToAudit} />

      {/* Main Navigation Header */}
      <Header
        onOpenAnalysis={scrollToAnalysis}
        onOpenAudit={scrollToAudit}
      />

      {/* Main Page Sections in Required Sequence */}
      <main className="flex-1">
        {/* Section B: Hero Section */}
        <HeroSection
          onAnalyzeWaste={scrollToAnalysis}
          onExploreSolution={scrollToServices}
        />

        {/* Section C: Introduction / Welcome Section */}
        <IntroWelcomeSection onAnalyzeWaste={scrollToAnalysis} />

        {/* Section D: What We Do — 8 Services Grid */}
        <ServicesSection onAnalyzeWaste={scrollToAnalysis} />

        {/* Section E: About BuildCycle AI (Tabs & Measured Metrics) */}
        <AboutSection onAnalyzeWaste={scrollToAnalysis} />

        {/* Section F: How It Works — 5-Step Process Section */}
        <ProcessSection onAnalyzeWaste={scrollToAnalysis} />

        {/* Section G: Insights and Educational Content */}
        <InsightsSection />

        {/* Section H: Testimonials / Stakeholder Benefits Scenarios */}
        <StakeholderBenefitsSection />

        {/* Section I: Primary Call-to-Action Section */}
        <PrimaryCtaSection
          onAnalyzeWaste={scrollToAnalysis}
          onRequestAudit={scrollToAudit}
        />

        {/* Section J: Interactive Waste Analysis Preview Workspace */}
        <WasteAnalysisWorkspace id="analysis-workspace" />

        {/* Quotation / Site Audit Assessment Form */}
        <SiteAuditQuoteSection />
      </main>

      {/* Section K/L: Contact and Footer */}
      <Footer
        onAnalyzeWaste={scrollToAnalysis}
        onRequestAudit={scrollToAudit}
      />

      {/* Quick Modal fallback if opened from navigation buttons */}
      <WasteAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
      />
    </div>
  );
};
