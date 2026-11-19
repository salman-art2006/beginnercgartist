import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import PageMeta from "@/components/PageMeta";
import { ToolsStrip, CompareBand, FeaturedWork, LearnSection } from "@/components/home/WorkSections";
import { LibrarySection, ServicesSection, WorkflowSteps, AboutBlock, SubscribeBand, ContactBand } from "@/components/home/OfferSections";

const Home = () => (
  <Layout>
    <PageMeta
      title="Realistic Blender Environments"
      description="Realistic, cinematic Blender environments and how to build them step by step. Tutorials, free project files, scene packs and custom environment work by Salman."
      path="/"
    />
    <HeroSection />
    <ToolsStrip />
    <CompareBand />
    <FeaturedWork />
    <LearnSection />
    <LibrarySection />
    <ServicesSection />
    <WorkflowSteps />
    <AboutBlock />
    <SubscribeBand />
    <ContactBand />
  </Layout>
);

export default Home;
