import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriberProvider } from "@/contexts/SubscriberContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ContentProtection from "@/components/ContentProtection";
import ErrorBoundary from "@/components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import Workflow from "./pages/Workflow";
import Resources from "./pages/Resources";
import ResourceLibrary from "./pages/ResourceLibrary";
import Tutorials from "./pages/Tutorials";
import TutorialDetail from "./pages/TutorialDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminPortfolioForm from "./pages/admin/AdminPortfolioForm";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminResources from "./pages/admin/AdminResources";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminEmails from "./pages/admin/AdminEmails";
import AdminTutorials from "./pages/admin/AdminTutorials";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <SubscriberProvider>
            <ContentProtection />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
                <Route path="/about" element={<ErrorBoundary><About /></ErrorBoundary>} />
                <Route path="/portfolio" element={<ErrorBoundary><Portfolio /></ErrorBoundary>} />
                <Route path="/portfolio/:id" element={<ErrorBoundary><PortfolioDetail /></ErrorBoundary>} />
                <Route path="/workflow" element={<ErrorBoundary><Workflow /></ErrorBoundary>} />
                <Route path="/resources" element={<ErrorBoundary><Resources /></ErrorBoundary>} />
                <Route path="/library" element={<ErrorBoundary><ResourceLibrary /></ErrorBoundary>} />
                <Route path="/tutorials" element={<ErrorBoundary><Tutorials /></ErrorBoundary>} />
                <Route path="/tutorials/:slug" element={<ErrorBoundary><TutorialDetail /></ErrorBoundary>} />
                <Route path="/blog" element={<ErrorBoundary><Blog /></ErrorBoundary>} />
                <Route path="/blog/:slug" element={<ErrorBoundary><BlogPost /></ErrorBoundary>} />
                <Route path="/contact" element={<ErrorBoundary><Contact /></ErrorBoundary>} />
                <Route path="/admin/login" element={<ErrorBoundary><AdminLogin /></ErrorBoundary>} />
                <Route path="/admin" element={<ErrorBoundary><AdminDashboard /></ErrorBoundary>} />
                <Route path="/admin/portfolio" element={<ErrorBoundary><AdminPortfolio /></ErrorBoundary>} />
                <Route path="/admin/portfolio/new" element={<ErrorBoundary><AdminPortfolioForm /></ErrorBoundary>} />
                <Route path="/admin/portfolio/edit/:id" element={<ErrorBoundary><AdminPortfolioForm /></ErrorBoundary>} />
                <Route path="/admin/blog" element={<ErrorBoundary><AdminBlog /></ErrorBoundary>} />
                <Route path="/admin/tutorials" element={<ErrorBoundary><AdminTutorials /></ErrorBoundary>} />
                <Route path="/admin/emails" element={<ErrorBoundary><AdminEmails /></ErrorBoundary>} />
                <Route path="/admin/resources" element={<ErrorBoundary><AdminResources /></ErrorBoundary>} />
                <Route path="/admin/subscribers" element={<ErrorBoundary><AdminSubscribers /></ErrorBoundary>} />
                <Route path="/admin/settings" element={<ErrorBoundary><AdminSettings /></ErrorBoundary>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SubscriberProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
