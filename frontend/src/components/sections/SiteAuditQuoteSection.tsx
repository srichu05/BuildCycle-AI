import React, { useState } from 'react';
import { SectionTitle } from '../ui/SectionTitle';
import { Send, CheckCircle2, Phone, Mail, Clock } from 'lucide-react';

export const SiteAuditQuoteSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'commercial-demo',
    debrisEstimate: '50-250',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Contact name is required.';
    if (!formData.company.trim()) newErrors.company = 'Company name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid work email address.';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <section id="quote" className="py-20 sm:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Context & Contact Details (inspired by Ecotrix quotation-intro-wrap) */}
          <div className="lg:col-span-5 space-y-6">
            <SectionTitle
              subtitle="Site Assessment"
              title="Request a Circular"
              highlightText="Waste Audit"
              description="Planning a major deconstruction or civil excavation? Request a preliminary photographic waste audit to identify reusable aggregate and salvage streams before breaking ground."
              className="mb-0"
            />

            <div className="p-6 rounded-2xl bg-[#f4f8f6] border border-emerald-900/10 space-y-4">
              <h5 className="font-bold text-sm text-[#1c503a]">
                What our assessment includes:
              </h5>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Preliminary drone or high-res photo classification of rubble stockpiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>On-site mobile crushing feasibility analysis (sub-base Type 1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Matching with regional secondary scrap smelters and reclamation yards</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Phone Inquiry: +1 (800) 458-WASTE</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Direct Mail: assessments@buildcycle.ai</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#dfb163]" />
                <span>Response Time: Typically within 24 business hours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card (inspired by Ecotrix quotation-wrap) */}
          <div className="lg:col-span-7 bg-[#fafcfb] rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-bold text-[#1c503a]">
                  Assessment Inquiry Received
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong> from <strong className="text-slate-900">{formData.company}</strong>. Our waste intelligence engineering team has received your project details and will follow up with audit logistics.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        company: '',
                        email: '',
                        phone: '',
                        projectType: 'commercial-demo',
                        debrisEstimate: '50-250',
                        notes: '',
                      });
                    }}
                    className="theme-btn text-xs py-2.5 px-6 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <h4 className="text-xl font-bold text-[#1c503a]">
                    Audit Request Form
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide project specifics to receive customized segregation recommendations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border ${
                        errors.name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                      } focus:outline-none focus:border-emerald-600`}
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Demolition & Civil"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border ${
                        errors.company ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                      } focus:outline-none focus:border-emerald-600`}
                    />
                    {errors.company && <p className="text-[10px] text-rose-500 mt-1">{errors.company}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      placeholder="jane@acmedemo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border ${
                        errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                      } focus:outline-none focus:border-emerald-600`}
                    />
                    {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border ${
                        errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                      } focus:outline-none focus:border-emerald-600`}
                    />
                    {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="commercial-demo">Commercial Demolition</option>
                      <option value="civil-earthworks">Civil Infrastructure &amp; Roadworks</option>
                      <option value="residential-decon">Residential Architectural Deconstruction</option>
                      <option value="recycling-yard">Recycling Yard Material Inbound</option>
                    </select>
                  </div>

                  {/* Debris Estimate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Volume
                    </label>
                    <select
                      value={formData.debrisEstimate}
                      onChange={(e) => setFormData({ ...formData, debrisEstimate: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="under-50">Under 50 Metric Tons</option>
                      <option value="50-250">50 - 250 Metric Tons</option>
                      <option value="250-1000">250 - 1,000 Metric Tons</option>
                      <option value="over-1000">Over 1,000 Metric Tons</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Project Notes &amp; Material Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe the dominant materials (e.g. reinforced concrete slabs, old red bricks, framing lumber)..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full theme-btn py-3.5 text-sm font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Assessment Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
