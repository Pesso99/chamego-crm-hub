import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Clientes from "./pages/admin/Clientes";
import Campanhas from "./pages/admin/Campanhas";
import Templates from "./pages/admin/Templates";
import Governanca from "./pages/admin/Governanca";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes - Protected (Admin Only) */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="campanhas" element={<Campanhas />} />
              <Route path="templates" element={<Templates />} />
              <Route path="governanca" element={<Governanca />} />
            </Route>
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
