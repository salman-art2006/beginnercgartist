import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriberProvider } from "@/contexts/SubscriberContext";
import { AdminProvider } from "@/contexts/AdminContext";
import ContentProtection from "@/components/ContentProtection";
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
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:id" element={<PortfolioDetail />} />
                <Route path="/workflow" element={<Workflow />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/library" element={<ResourceLibrary />} />
                <Route path="/tutorials" element={<Tutorials />} />
                <Route path="/tutorials/:slug" element={<TutorialDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/portfolio" element={<AdminPortfolio />} />
                <Route path="/admin/portfolio/new" element={<AdminPortfolioForm />} />
                <Route path="/admin/portfolio/edit/:id" element={<AdminPortfolioForm />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/tutorials" element={<AdminTutorials />} />
                <Route path="/admin/emails" element={<AdminEmails />} />
                <Route path="/admin/resources" element={<AdminResources />} />
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SubscriberProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
