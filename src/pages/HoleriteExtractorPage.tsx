import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Upload, Play, FileText, Brain, Calendar,
  AlertTriangle, CreditCard, X, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import AppHeader from "@/components/AppHeader";
import { useUserPlan } from "@/hooks/useUserPlan";

const aiModels = [
  {
    id: "holerite-padrao",
    name: "IA Holerite",
    subtitle: "Padrão",
    desc: "Extração de campos comuns: salário, descontos, FGTS, INSS",
    icon: Brain,
  },
  {
    id: "holerite-completo",
    name: "IA Holerite",
    subtitle: "Completo",
    desc: "Extração detalhada com rubricas, adicionais e benefícios",
    icon: Calendar,
  },
];

function parsePageRange(range: string): number {
  if (!range.trim()) return 0;
  let total = 0;
  const parts = range.split(",").map((s) => s.trim());
  for (const part of parts) {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end) && end >= start) total += end - start + 1;
    } else {
      if (!isNaN(Number(part))) total += 1;
    }
  }
  return total;
}

const HoleriteExtractorPage = () => {
  const { plan } = useUserPlan();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const pagesToConsume = useMemo(() => parsePageRange(pageRange), [pageRange]);
  const hasEnoughPages = plan.pageBalance >= pagesToConsume;
  const limitReached = plan.pageBalance <= 0;

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file?.type === "application/pdf") {
        setSelectedFile(file);
        toast.success(`PDF "${file.name}" importado.`);
      } else {
        toast.error("Selecione um arquivo PDF válido.");
      }
    };
    input.click();
  };

  const handleStart = () => {
    if (!selectedModel) { toast.warning("Selecione um modelo de IA."); return; }
    if (!selectedFile) { toast.warning("Importe um arquivo PDF."); return; }
    if (!pageRange.trim()) { toast.warning("Informe o intervalo de páginas."); return; }
    if (!hasEnoughPages) { setShowLimitAlert(true); return; }
    setIsProcessing(true);
    toast.info(`Processando ${pagesToConsume} holerite(s)...`);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Processamento de holerites concluído!");
    }, 3000);
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      <AppHeader />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card p-8 w-full max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/app" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h3 className="text-lg font-semibold text-foreground">Extrator de Holerite</h3>
          </div>

          {limitReached && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between gap-4 p-4 rounded-lg bg-warning/10 border border-warning/30 mb-6"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Seu limite de teste acabou.</span>{" "}
                  Adquira um plano para continuar processando.
                </p>
              </div>
              <Link
                to="/#pricing"
                className="gradient-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Ver Planos
              </Link>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {aiModels.map((model) => (
              <motion.div
                key={model.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedModel(model.id)}
                className={`relative cursor-pointer rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 ${
                  selectedModel === model.id
                    ? "bg-primary/10 border-primary/60 shadow-[0_0_20px_rgba(74,158,255,0.2)]"
                    : "bg-card/50 border-border/40 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(74,158,255,0.1)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedModel === model.id ? "gradient-primary" : "bg-secondary"}`}>
                    <model.icon className={`w-6 h-6 ${selectedModel === model.id ? "text-primary-foreground" : "text-primary"}`} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">{model.name}</h4>
                    <p className="text-primary text-sm font-medium">{model.subtitle}</p>
                    <p className="text-muted-foreground text-xs mt-1">{model.desc}</p>
                  </div>
                </div>
                {selectedModel === model.id && (
                  <div className="absolute top-3 right-3 w-3 h-3 rounded-full gradient-primary" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleFileSelect}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-border bg-secondary/50 text-foreground text-sm font-medium hover:bg-surface-hover transition-all"
            >
              <Upload className="w-4 h-4 text-primary" />
              {selectedFile ? selectedFile.name : "Importar PDF"}
            </button>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="Páginas (ex: 1-5, 8, 10-12)"
              className="flex-1 px-4 py-3 bg-background/60 border border-border rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {pagesToConsume > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-sm mt-4 ${hasEnoughPages ? "text-muted-foreground" : "text-warning font-medium"}`}
            >
              <FileText className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Você usará <span className="font-semibold text-foreground">{pagesToConsume}</span> página(s) do seu saldo de{" "}
              <span className="font-semibold text-foreground">{plan.pageBalance}</span>.
              {!hasEnoughPages && " Saldo insuficiente!"}
            </motion.p>
          )}

          <button
            onClick={handleStart}
            disabled={isProcessing || limitReached || (pagesToConsume > 0 && !hasEnoughPages)}
            className="w-full mt-6 gradient-primary text-primary-foreground py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Play className="w-5 h-5" />
            {isProcessing ? "Processando..." : "Iniciar"}
          </button>
        </div>
      </main>

      <AnimatePresence>
        {showLimitAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="glass-card p-8 max-w-md w-full relative"
            >
              <button onClick={() => setShowLimitAlert(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-warning/15 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Saldo Insuficiente</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Você precisa de {pagesToConsume} página(s), mas só tem {plan.pageBalance} disponível(is).
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowLimitAlert(false)} className="flex-1 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-surface-hover transition-all">
                    Fechar
                  </button>
                  <Link to="/#pricing" className="flex-1">
                    <button className="w-full py-3 rounded-lg gradient-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Ver Planos
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoleriteExtractorPage;
