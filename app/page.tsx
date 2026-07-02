import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { WhyChoose } from "@/components/site/WhyChoose";
import { Stats } from "@/components/site/Stats";
import { Gallery } from "@/components/site/Gallery";
import { Pricing } from "@/components/site/Pricing";
import { Booking } from "@/components/site/Booking";
import { Team } from "@/components/site/Team";
import { Testimonials } from "@/components/site/Testimonials";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { serviceProvider } from "@/utils/serviceProvider";

export default async function Home() {
  let dbServices: any[] = [];
  let dbFeaturedServices: any[] = [];
  let dbSettings: any = null;
  let dbStaff: any[] = [];
  let dbTestimonials: any[] = [];
  let dbGallery: any[] = [];
  
  try {
    const provider = await serviceProvider();
    
    const servicesResponse = await provider.getMethod("api/services?featured=false");
    if (servicesResponse && servicesResponse.success) {
      dbServices = servicesResponse.services;
    }

    const featuredServicesResponse = await provider.getMethod("api/services?featured=true");
    if (featuredServicesResponse && featuredServicesResponse.success) {
      dbFeaturedServices = featuredServicesResponse.services;
    }

    const settingsResponse = await provider.getMethod("api/settings");
    if (settingsResponse && settingsResponse.success) {
      dbSettings = settingsResponse.settings;
    }

    const staffResponse = await provider.getMethod("api/staff");
    if (staffResponse && staffResponse.success) {
      dbStaff = staffResponse.staff;
    }

    const testimonialsResponse = await provider.getMethod("api/testimonials");
    if (testimonialsResponse && testimonialsResponse.success) {
      dbTestimonials = testimonialsResponse.testimonials;
    }

    const galleryResponse = await provider.getMethod("api/gallery");
    if (galleryResponse && galleryResponse.success) {
      dbGallery = galleryResponse.gallery;
    }
  } catch (error) {
    console.warn("Could not fetch database records via service provider during server rendering:", error);
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar themeSetting={dbSettings?.theme} />
      <main>
        <Hero settings={dbSettings} services={dbServices} />
        <Services initialServices={dbServices} />
        <WhyChoose />
        <Stats />
        <Gallery initialImages={dbGallery} />
        <Pricing initialServices={dbFeaturedServices} />
        <Booking services={dbServices} staff={dbStaff} />
        <Team initialStaff={dbStaff} />
        <Testimonials initialTestimonials={dbTestimonials} />
        <About />
        <Contact settings={dbSettings} />
      </main>
      <Footer settings={dbSettings} />
    </div>
  );
}
