import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  AlertCircle,
  Sparkles,
  Download,
  RotateCcw,
  Server,
  Layers,
  CheckCircle,
  HelpCircle,
  Clock,
  Cpu,
  History,
  X,
  FileText,
} from 'lucide-react';
import type { AnalysisResult, AnalysisMode, AnalysisHistoryItem } from '../../types/analysis';
import {
  analyzeWasteImage,
  API_BASE_URL,
  downloadAnalysisCsv,
  fetchAnalysisHistory,
  fetchAnalysisById,
} from '../../services/api';
import type { ApiError } from '../../services/api';
import { sampleAnalysisRubble } from '../../data/mockAnalysisData';
import { AnnotatedVisionCanvas } from './AnnotatedVisionCanvas';
import { CompositionChart } from './CompositionChart';
import { MaterialCountCards } from './MaterialCountCards';
import { RecoveryRecommendations } from './RecoveryRecommendations';

interface WasteAnalysisWorkspaceProps {
  id?: string;
  defaultMode?: AnalysisMode;
}

export const WasteAnalysisWorkspace: React.FC<WasteAnalysisWorkspaceProps> = ({
  id = 'analysis-workspace',
  defaultMode = 'live',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/assets/images/sample-rubble.jpg');
  const [activePreset, setActivePreset] = useState<string>('mixed-rubble');
  const [mode, setMode] = useState<AnalysisMode>(defaultMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(sampleAnalysisRubble);
  const [error, setError] = useState<ApiError | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample Presets for instant user testing
  const presets = [
    {
      id: 'mixed-rubble',
      name: 'Mixed Demolition Debris',
      image: '/assets/images/sample-rubble.jpg',
      description: 'Heterogeneous mix of concrete, wood framing, rebar wires & red brick',
    },
    {
      id: 'concrete-pile',
      name: 'Crushed Concrete Rubble',
      image: '/assets/images/concrete.jpg',
      description: 'Fractured cement slabs and heavy aggregate chunks',
    },
    {
      id: 'brick-masonry',
      name: 'Demolition Brick Pile',
      image: '/assets/images/bricks.jpg',
      description: 'Pallet of reclaimed architectural clay bricks and terracotta',
    },
  ];

  const handlePresetSelect = async (preset: typeof presets[0]) => {
    setActivePreset(preset.id);
    setPreviewUrl(preset.image);
    setSelectedFile(null);
    setError(null);

    // Fetch local preset as a File object so user can test Analyze Image
    try {
      const response = await fetch(preset.image);
      const blob = await response.blob();
      const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      setSelectedFile(file);
    } catch {
      // Fallback
    }

    if (preset.id === 'mixed-rubble') {
      setResult(sampleAnalysisRubble);
    } else {
      setResult(null);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError({
        message: 'Unsupported format. Please upload a high-resolution JPG, PNG, or WebP construction image.',
      });
      return;
    }

    // 15 MB limit
    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      setError({
        message: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed upload size is 15MB.`,
      });
      return;
    }

    setSelectedFile(file);
    setActivePreset('custom-upload');
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRunAnalysis = async () => {
    let fileToAnalyze = selectedFile;

    // If no custom file is selected, fetch the active preset image as a File
    if (!fileToAnalyze && previewUrl) {
      try {
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        fileToAnalyze = new File([blob], 'demo_construction_debris.jpg', { type: 'image/jpeg' });
      } catch {
        setError({ message: 'Failed to load demo image for processing.' });
        return;
      }
    }

    if (!fileToAnalyze) {
      setError({ message: 'Please select or upload an image first.' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgressStep('Preprocessing image tensors & extracting EXIF metadata...');

    try {
      setTimeout(() => setProgressStep('Running YOLOv11 bounding box inference...'), 400);
      setTimeout(() => setProgressStep('Computing visible surface composition & circular recommendations...'), 900);

      const analysisResponse = await analyzeWasteImage(fileToAnalyze, mode);
      setResult(analysisResponse);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
      setProgressStep('');
    }
  };

  const handleOpenHistory = async () => {
    setShowHistoryModal(true);
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const resp = await fetchAnalysisHistory(30, 0);
      setHistoryList(resp.items || []);
    } catch (err: any) {
      setHistoryError(err.message || 'Unable to fetch analysis history from backend.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSelectHistoryItem = async (analysisId: string) => {
    setIsLoading(true);
    setShowHistoryModal(false);
    try {
      const fullAnalysis = await fetchAnalysisById(analysisId);
      setResult(fullAnalysis);
      setActivePreset('custom-upload');
      setMode('live');
    } catch (err: any) {
      setError({ message: err.message || 'Failed to load analysis details.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!result) return;

    if (!result.is_mock_demo) {
      try {
        await downloadAnalysisCsv(result.analysis_id);
        return;
      } catch (err) {
        console.warn('Backend CSV download endpoint failed, falling back to client CSV export', err);
      }
    }

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'BuildCycle AI - Waste Analysis Report\n';
    csvContent += `Analysis ID,${result.analysis_id}\n`;
    csvContent += `Timestamp,${result.created_at}\n`;
    csvContent += `Model,${result.model_information.model_name} ${result.model_information.version}\n`;
    csvContent += `Inference Latency (ms),${result.inference_time_ms}\n`;
    csvContent += `Mode,${result.is_mock_demo ? 'Interactive Demo Simulation' : 'Live FastAPI Backend'}\n\n`;

    csvContent += 'MATERIAL COMPOSITION SUMMARY\n';
    csvContent += 'Material Fraction,Surface Area %,Estimated Coverage,Classification Badge\n';
    result.composition.forEach((c) => {
      csvContent += `"${c.material}",${c.percentage}%,"${c.estimated_visible_area}","${c.badge}"\n`;
    });

    csvContent += '\nOBJECT DETECTIONS\n';
    csvContent += 'Detection ID,Label,Class,Confidence,BBox (X1 Y1 X2 Y2 %)\n';
    result.detections.forEach((d) => {
      csvContent += `"${d.id}","${d.label}","${d.material_class}",${(d.confidence * 100).toFixed(1)}%,"${d.bbox.join(' ')}"\n`;
    });

    csvContent += '\nCIRCULAR RECOVERY RECOMMENDATIONS\n';
    csvContent += 'Material,Recommended Pathway,Action,Target Industry,Environmental Benefit,Grade\n';
    result.recommendations.forEach((r) => {
      csvContent += `"${r.material}","${r.pathway}","${r.action}","${r.target_industry}","${r.environmental_benefit}","${r.recovery_grade}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buildcycle_analysis_${result.analysis_id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id={id} className="py-16 sm:py-24 bg-[#f4f8f6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#dfb163]" />
              <span>Interactive AI Waste Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1c503a] tracking-tight">
              Test Construction Debris Analysis
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Upload a site photograph or select a sample waste pile to observe visible material identification,
              bounding box detection, and circular recovery pathways.
            </p>
          </div>

          {/* Controls: Mode Switcher & History Button */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={handleOpenHistory}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-800 hover:border-emerald-300 shadow-xs"
              title="View past analyses from Neon PostgreSQL database"
            >
              <History className="w-4 h-4 text-emerald-600" />
              <span>Analysis History</span>
            </button>

            {/* Mode Switcher */}
            <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200 inline-flex items-center">
              <button
                onClick={() => {
                  setMode('demo');
                  setError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'demo'
                    ? 'bg-[#097e51] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#dfb163]" />
                <span>Demo Mode</span>
              </button>
              <button
                onClick={() => {
                  setMode('live');
                  setError(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'live'
                    ? 'bg-[#1c503a] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Live FastAPI</span>
              </button>
            </div>
          </div>
        </div>

        {/* Technical Notice Banner */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Important Operational Note:</span> Computer vision analyzes visible surface materials to assist with sorting decisions. It does not determine internal structural safety, exact gravimetric weight, or chemical purity from photographs alone.
            {mode === 'demo' && (
              <span className="block mt-1 font-semibold text-emerald-800">
                Currently running in <strong className="underline">Interactive Demo Simulation</strong> with client-side detection simulation. Switch to &quot;Live FastAPI&quot; when backend server is running.
              </span>
            )}
          </div>
        </div>

        {/* Upload & Sample Selector Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Upload Dropzone (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={triggerFileInput}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-emerald-400 bg-[#fafcfb]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-2xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Drag and drop a construction waste photo here
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  or <span className="text-[#097e51] font-semibold underline">browse local files</span> from your device
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Supported formats: JPG, PNG, WebP</span>
                  <span>•</span>
                  <span>Max size: 15MB</span>
                </div>
              </div>
            </div>

            {/* Selected File Details / Action Bar */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto truncate">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <FileImage className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="truncate text-left">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {selectedFile ? selectedFile.name : activePreset === 'mixed-rubble' ? 'Sample: mixed-demolition-rubble.jpg' : 'Active Sample'}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Custom Image`
                      : 'Sample Construction Rubble Dataset'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleRunAnalysis}
                  disabled={isLoading}
                  className={`w-full sm:w-auto theme-btn text-xs sm:text-sm py-2.5 px-6 font-bold shadow-md cursor-pointer ${
                    isLoading ? 'opacity-80 cursor-wait' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#dfb163]" />
                      <span>{result ? 'Re-Analyze Image' : 'Analyze Image'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Preset Sample Cards (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#1c503a] uppercase tracking-wider">
                  Or Test with Sample Data
                </h4>
                <span className="text-[11px] text-slate-400">Click to load</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Test the computer vision pipeline immediately using verified construction site photographs.
              </p>

              <div className="space-y-2.5">
                {presets.map((p) => {
                  const isCurrent = activePreset === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handlePresetSelect(p)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {p.name}
                          </span>
                          {isCurrent && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {p.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>FastAPI Endpoint:</span>
              <code className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                {API_BASE_URL}
              </code>
            </div>
          </div>
        </div>

        {/* Loading Spinner & Scanning Simulation */}
        {isLoading && (
          <div className="my-8 bg-slate-900 text-white rounded-2xl p-8 text-center shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="ai-scanline" />
            <div className="w-16 h-16 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Vision Model Inferencing in Progress
            </h4>
            <p className="text-xs text-emerald-300 font-mono tracking-wide">
              {progressStep}
            </p>
            <div className="w-64 h-1.5 bg-slate-800 rounded-full mx-auto mt-4 overflow-hidden">
              <div className="w-full h-full bg-emerald-500 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="my-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-rose-900">
                  {error.message}
                </h5>
                {error.details && (
                  <p className="text-xs text-rose-700 leading-relaxed font-mono mt-1">
                    {error.details}
                  </p>
                )}
                {error.isBackendUnavailable && (
                  <div className="mt-3 pt-3 border-t border-rose-200/80 flex items-center gap-3">
                    <button
                      onClick={() => {
                        setMode('demo');
                        setError(null);
                        handleRunAnalysis();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Switch to Demo Mode Now
                    </button>
                    <span className="text-xs text-slate-600">
                      Or run <code className="bg-white px-1.5 py-0.5 rounded text-slate-800">uvicorn main:app --reload</code> on port 8000
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {result && !isLoading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Results Header Status Strip */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    result.is_mock_demo ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Analysis #{result.analysis_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        result.is_mock_demo
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {result.is_mock_demo ? 'Interactive Demo Result' : 'Live FastAPI Backend Inference'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Inference: {result.inference_time_ms}ms</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Cpu className="w-3 h-3" />
                      <span>{result.model_information.model_name}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenHistory}
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Browse historical analyses"
                >
                  <History className="w-3.5 h-3.5 text-emerald-700" />
                  <span>History</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="theme-btn text-xs py-2 px-4 shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>
            </div>

            {/* Material Count Overview Cards */}
            <MaterialCountCards materialCounts={result.material_counts} />

            {/* Main Visuals Grid: Annotated Vision Canvas & Composition Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vision Canvas with Bounding Boxes (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Visual Object Detections</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Confidence: 84% — 96%
                  </span>
                </div>
                <AnnotatedVisionCanvas
                  imageUrl={previewUrl}
                  annotatedImageUrl={result.annotated_image}
                  detections={result.detections}
                />
              </div>

              {/* Recharts Composition Donut Chart (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Surface Area Breakdown
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Classified
                  </span>
                </div>
                <CompositionChart composition={result.composition} />
              </div>
            </div>

            {/* Circular Recovery Recommendations */}
            <RecoveryRecommendations recommendations={result.recommendations} />
          </div>
        )}

        {/* Analysis History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Analysis History</h3>
                    <p className="text-xs text-slate-500">
                      Past debris detection runs stored in Neon PostgreSQL
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                    <span className="text-sm">Loading historical analyses from Neon PostgreSQL...</span>
                  </div>
                ) : historyError ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                    <div className="font-semibold mb-1">Failed to fetch analysis history</div>
                    <div>{historyError}</div>
                  </div>
                ) : historyList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <div className="font-semibold text-slate-700">No analyses found yet</div>
                    <p className="text-xs text-slate-500 mt-1">
                      Run an inference using &quot;Live FastAPI&quot; mode to save your first analysis.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="text-xs uppercase bg-slate-100 text-slate-700">
                        <tr>
                          <th className="py-3 px-4 rounded-l-lg">Analysis ID</th>
                          <th className="py-3 px-4">Filename</th>
                          <th className="py-3 px-4">Detections</th>
                          <th className="py-3 px-4">Model</th>
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {historyList.map((item) => (
                          <tr
                            key={item.analysis_id}
                            className="hover:bg-emerald-50/40 transition-colors group"
                          >
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-emerald-800">
                              #{item.analysis_id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-800 truncate max-w-[180px]">
                              {item.original_filename}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800">
                                {item.total_detections} items
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono text-slate-500">
                              {item.model_name}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                              {new Date(item.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSelectHistoryItem(item.analysis_id)}
                                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-700 text-white hover:bg-emerald-800 transition-colors cursor-pointer"
                                  title="Load analysis into workspace"
                                >
                                  Load
                                </button>
                                <button
                                  onClick={() => downloadAnalysisCsv(item.analysis_id)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                                  title="Download CSV report"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span>Total records: {historyList.length}</span>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
