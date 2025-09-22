import { FeaturesSection } from '@/components/landing/features-section';
import { HeroSection } from '@/components/landing/hero-section';

export default function LandingPage() {
    return (
        <main className='min-h-screen'>
            <HeroSection />
            <FeaturesSection />
        </main>
    );
}