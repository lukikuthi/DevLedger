import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStateProvider } from "@/hooks/use-app-state";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Login from "./pages/Login";
import ModeSelector from "./pages/ModeSelector";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Subscriptions from "./pages/Subscriptions";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Files from "./pages/Files";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppStateProvider>
        <Toaster />
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mode" element={
              <ProtectedRoute><ModeSelector /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute><AppLayout><Transactions /></AppLayout></ProtectedRoute>
            } />
            <Route path="/subscriptions" element={
              <ProtectedRoute><AppLayout><Subscriptions /></AppLayout></ProtectedRoute>
            } />
            <Route path="/leads" element={
              <ProtectedRoute><AppLayout><Leads /></AppLayout></ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute><AppLayout><Clients /></AppLayout></ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute><AppLayout><Projects /></AppLayout></ProtectedRoute>
            } />
            <Route path="/files" element={
              <ProtectedRoute><AppLayout><Files /></AppLayout></ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </AppStateProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
