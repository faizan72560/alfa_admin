import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Players from "./pages/Players";
import Transfers from "./pages/Transfers";
import Notifications from "./pages/Notifications";
import Export from "./pages/Export";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 p-6 md:p-8">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/players" element={<Players />} />
                        <Route path="/transfers" element={<Transfers />} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/export" element={<Export />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
