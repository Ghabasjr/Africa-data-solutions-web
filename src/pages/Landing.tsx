import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Shield, Zap, Globe, ArrowRight, ChevronRight, Activity, Phone, Database, Router, Mail, MapPin } from 'lucide-react';
import About from '../components/ui/About';
import Testimonials from '../components/ui/testimonial';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-text-primary overflow-x-hidden font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20"> */}
                        <img className='w-10 h-10 object-contain' src="../../assets/datalog.png" alt="logo" />
                        {/* </div> */}
                        <span className="font-heading font-bold text-xl tracking-tight hidden sm:block">Africa Data Solutions</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors hidden sm:block"
                        >
                            Log In
                        </button>
                        <Button
                            size="sm"
                            onClick={() => navigate('/signup')}
                            className="rounded-full px-6 shadow-lg shadow-primary/20"
                            rightIcon={<ArrowRight size={16} />}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
                {/* Background Elements - Hero Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/assets/youngman.jpg"
                        alt="Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/80 to-white/90" />
                </div>

                {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-accent/10 rounded-full blur-[100px] -z-10" /> */}

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-8 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/60 backdrop-blur-md shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                            </span>
                            <span className="text-xs font-semibold text-text-secondary tracking-wide uppercase">The Future of Payments</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-heading font-bold leading-[1.1] tracking-tight">
                            Seamless <span className="text-transparent bg-clip-text primary-gradient">Digital</span> <br />
                            Transactions
                        </h1>

                        <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the next generation of bill payments. Data, Airtime, Cable TV, and electricity bills handled with unprecedented speed and security.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button
                                size="lg"
                                onClick={() => navigate('/signup')}
                                className="w-full sm:w-auto shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
                                rightIcon={<ChevronRight size={20} />}
                            >
                                Create Free Account
                            </Button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-text-primary bg-white border border-gray-200 hover:bg-gray-50 transition-all hover:scale-105"
                            >
                                Login to Dashboard
                            </button>
                        </div>

                        <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 text-text-secondary">
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-text-primary">50k+</span>
                                <span className="text-xs">Active Users</span>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-text-primary">99.9%</span>
                                <span className="text-xs">Uptime</span>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-2xl text-text-primary">24/7</span>
                                <span className="text-xs">Support</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative lg:h-150 flex items-center justify-center animate-fade-in mt-12 lg:mt-0" style={{ animationDelay: '0.2s' }}>
                        <div className="relative w-full max-w-[320px] sm:max-w-md aspect-4/5 perspective-1000 mx-auto">
                            {/* Floating Cards Mockup */}
                            <Card variant="glass" className="absolute top-10 left-0 right-0 z-20 p-6 transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500 shadow-2xl border-white/40">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <p className="text-xs text-text-secondary">Total Balance</p>
                                        <h3 className="text-3xl font-bold text-text-primary">₦25,450.00</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Activity size={20} />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/40 border border-white/20">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
                                            <div className="flex-1 space-y-2">
                                                <div className="w-2/3 h-2 rounded bg-gray-200 animate-pulse" />
                                                <div className="w-1/3 h-2 rounded bg-gray-200 animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Decorative floating elements */}
                            <Card className="absolute -bottom-4 right-0 sm:-bottom-10 sm:-right-10 z-30 p-4 w-48 shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500">Transaction</p>
                                        <p className="text-sm font-bold text-success">Successful</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Why Choose ADS?</h2>
                        <p className="text-text-secondary">Built for speed, reliability, and security. We provide the best infrastructure for your digital needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Shield size={32} />}
                            title="Bank-Grade Security"
                            description="Your transactions are protected by industry-leading encryption and security protocols."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Zap size={32} />}
                            title="Lightning Fast"
                            description="Experience instant processing for Data, Airtime, and Bill payments. No delays."
                            delay={100}
                        />
                        <FeatureCard
                            icon={<Globe size={32} />}
                            title="Nationwide Coverage"
                            description="Support for all major networks and utility providers across the country."
                            delay={200}
                        />
                    </div>
                </div>
            </section>
            <section className="py-24 px-6 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Our services</h2>
                        <p className="text-text-secondary">We run all kinds of service that your success depends on.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Phone size={32} />}
                            title="Airtime Top Up"
                            description="Quick and secure airtime top-ups for all major networks."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<Database size={32} />}
                            title="Buy Data"
                            description="Instant data purchases for all Nigerian networks with real-time processing."
                            delay={100}
                        />
                        <FeatureCard
                            icon={<Router size={32} />}
                            title="Electricity Bills"
                            description="Support for all major networks and utility providers across the country."
                            delay={200}
                        />
                        <FeatureCard
                            icon={<Router size={32} />}
                            title="Cable Subscription"
                            description="Support for all major networks and utility providers across the country."
                            delay={200}
                        />
                        <FeatureCard
                            icon={<Router size={32} />}
                            title="Bulk SMS"
                            description="Send bulk SMS at the best rates and reach your audience instantly."
                            delay={200}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                        {/* Background Image for CTA */}
                        <div className="absolute inset-0">
                            <img
                                src="/assets/pretty-black.jpg"
                                alt="CTA Background"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
                        </div>

                        <div className="relative z-10 space-y-6 p-12 text-center text-white">
                            <h2 className="text-3xl lg:text-4xl font-heading font-bold">Ready to get started?</h2>
                            <p className="text-blue-100 max-w-xl mx-auto">Join thousands of satisfied users who trust Africa Data Solutions for their daily transactions.</p>
                            <Button
                                size="lg"
                                onClick={() => navigate('/signup')}
                                className="bg-white text-primary hover:bg-gray-50 border-none shadow-xl"
                            >
                                Create Your Free Account
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* About  */}
            <About />
            <Testimonials />
            {/* 
            <section className='py-12 px-6 border-t border-gray-200 bg-white'>
                <h2 className='text-3xl lg:text-4xl font-heading font-bold'>Get in Touch</h2>
                <p className='text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed'>We'd love to hear from you. Whether you have a question, feedback, or need support, we're here to help.</p>
                <ul className='space-y-4 mt-8'>
                    <li className='flex items-center gap-4'>
                        <Mail size={24} />
                        <span>africadatasolution@gmail.com</span>
                    </li>
                    <li className='flex items-center gap-4'>
                        <Phone size={24} />
                        <span>09060425772</span>
                    </li>
                    <li className='flex items-center gap-4'>
                        <MapPin size={24} />
                        <span>Low-cost area, Potiskum, Yobe State, Nigeria</span>
                    </li>
                </ul>
            </section> */}

            <section className="relative bg-white overflow-hidden border-t border-blue-100 py-20 px-6">

                {/* Background blobs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-40 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-50 rounded-full opacity-60 translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Header */}
                    <div className="mb-14">
                        <p className="text-xs tracking-widest uppercase text-blue-500 font-mono mb-4">
                            ◈ Reach Out
                        </p>
                        <h2 className="text-5xl font-light text-gray-900 leading-tight tracking-tight mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-lg text-gray-400 italic max-w-xl leading-relaxed">
                            We'd love to hear from you. Whether you have a question, feedback, or need support, we're here to help.
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-16 h-px bg-blue-500" />
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Contact Cards */}
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">

                        {/* Email */}
                        <li className="group bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                                <Mail size={22} className="text-blue-600" />
                            </div>
                            <p className="text-xs tracking-widest uppercase text-gray-400 font-mono mb-2">Email</p>
                            <p className="text-sm font-semibold text-gray-800 break-all">africadatasolution@gmail.com</p>
                            <div className="mt-6 h-0.5 w-10 bg-blue-400 group-hover:w-full transition-all duration-500 rounded-full" />
                        </li>

                        {/* Phone — highlighted */}
                        <li className="group bg-blue-600 rounded-2xl p-8 shadow-sm hover:bg-blue-700 hover:shadow-xl transition-all duration-300">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                                <Phone size={22} className="text-white" />
                            </div>
                            <p className="text-xs tracking-widest uppercase text-blue-200 font-mono mb-2">Phone</p>
                            <p className="text-sm font-semibold text-white">09060425772</p>
                            <div className="mt-6 h-0.5 w-10 bg-white/40 group-hover:w-full transition-all duration-500 rounded-full" />
                        </li>

                        {/* Address */}
                        <li className="group bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                                <MapPin size={22} className="text-blue-600" />
                            </div>
                            <p className="text-xs tracking-widest uppercase text-gray-400 font-mono mb-2">Address</p>
                            <p className="text-sm font-semibold text-gray-800 leading-relaxed">Low-cost area, Potiskum, Yobe State, Nigeria</p>
                            <div className="mt-6 h-0.5 w-10 bg-blue-400 group-hover:w-full transition-all duration-500 rounded-full" />
                        </li>

                    </ul>

                    {/* Footer strip */}
                    <div className="pt-8 border-t border-gray-100 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-xs text-gray-400 tracking-widest uppercase font-mono">
                            Africa Data Solutions · Always Here to Help
                        </span>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        {/* <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center text-white font-bold text-sm"> */}
                        <img className='h-10 w-10 object-contain' src="/assets/datalog.png" alt="logo" />
                        {/* </div> */}
                        <span className="font-heading font-bold text-lg">Africa Data Solutions</span>
                    </div>
                    <p className="text-sm text-text-secondary">© 2026 Africa Data Solutions. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }: any) => (
    <Card className="p-8 hover:shadow-xl hover:bg-blue-500 hover:text-black transition-all duration-300 transform hover:-translate-y-1 bg-white border-white/50" style={{ animationDelay: `${delay}ms` }}>
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 font-heading">{title}</h3>
        <p className="text-text-secondary leading-relaxed">{description}</p>
    </Card>
);

export default Landing;
