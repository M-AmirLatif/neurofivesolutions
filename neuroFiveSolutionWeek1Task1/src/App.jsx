import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TrustedBrands from './components/TrustedBrands/TrustedBrands';
import Features from './components/Features/Features';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Pricing from './components/Pricing/Pricing';
import Testimonials from './components/Testimonials/Testimonials';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

export default function App() {
  return <><Navbar /><main><Hero /><TrustedBrands /><Features /><HowItWorks /><Pricing /><Testimonials /><CTA /></main><Footer /></>;
}
