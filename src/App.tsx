import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import DatacenterList from "./pages/datacenters/DatacenterList";
import DatacenterDetail from "./pages/datacenters/DatacenterDetail";
import ServerList from "./pages/servers/ServerList";
import ServerDetail from "./pages/servers/ServerDetail";
import HostList from "./pages/hosts/HostList";
import HostDetail from "./pages/hosts/HostDetail";
import IPList from "./pages/ips/IPList";
import IPDetail from "./pages/ips/IPDetail";
import OSList from "./pages/os/OSList";
import OSDetail from "./pages/os/OSDetail";
import PersonList from "./pages/persons/PersonList";
import PersonDetail from "./pages/persons/PersonDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/datacenters" element={<DatacenterList />} />
            <Route path="/datacenters/:id" element={<DatacenterDetail />} />
            <Route path="/servers" element={<ServerList />} />
            <Route path="/servers/:id" element={<ServerDetail />} />
            <Route path="/hosts" element={<HostList />} />
            <Route path="/hosts/:id" element={<HostDetail />} />
            <Route path="/ips" element={<IPList />} />
            <Route path="/ips/:id" element={<IPDetail />} />
            <Route path="/os" element={<OSList />} />
            <Route path="/os/:id" element={<OSDetail />} />
            <Route path="/persons" element={<PersonList />} />
            <Route path="/persons/:id" element={<PersonDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
