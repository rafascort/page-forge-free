import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import ServiceSelectionPage from "./pages/ServiceSelectionPage";
import MainAppPage from "./pages/MainAppPage";
import HoleriteExtractorPage from "./pages/HoleriteExtractorPage";
import TermosPage from "./pages/TermosPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/app" element={<ServiceSelectionPage />} />
          <Route path="/app/ponto" element={<MainAppPage />} />
          <Route path="/app/holerite" element={<HoleriteExtractorPage />} />
          <Route path="/termos" element={<TermosPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
