
const About = () => {
    return (
        <section className="min-h-screen bg-white font-serif text-gray-900 relative overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50 rounded-full opacity-60 translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

            {/* Top accent bar */}
            <div className="h-1 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400" />

            <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">

                {/* Header */}
                <div className="mb-16">
                    <p className="text-xs tracking-widest uppercase text-blue-500 font-mono mb-4">
                        ◈ Who We Are
                    </p>
                    <h1 className="text-6xl font-light text-gray-900 leading-tight tracking-tight mb-4">
                        About Us
                    </h1>
                    <p className="text-lg text-gray-400 italic">
                        Know more about us.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-14">
                    <div className="w-16 h-px bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Main paragraphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="border-l-2 border-blue-500 pl-6">
                        <p className="text-base leading-relaxed text-gray-600">
                            Africa Data Solutions is a{" "}
                            <span className="text-blue-600 font-semibold">leading provider</span>{" "}
                            of digital payment solutions in Africa. We help businesses and
                            individuals manage their payments efficiently and securely.
                        </p>
                    </div>
                    <div className="border-l-2 border-blue-200 pl-6">
                        <p className="text-base leading-relaxed text-gray-600">
                            Enjoy seamless and instant recharge services for airtime, data
                            bundles, and Cable TV subscriptions — including{" "}
                            <span className="text-blue-600">DStv, GOtv,</span> and Startimes.
                            Pay electricity bills effortlessly and access a wide range of
                            digital payment solutions.
                        </p>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">

                    {/* Fast */}
                    <div className="group bg-white border border-blue-100 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                            ⚡
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                            We're Fast
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Transactions processed in seconds. No delays, no waiting — just instant results.
                        </p>
                        <div className="mt-6 h-0.5 w-10 bg-blue-400 group-hover:w-full transition-all duration-500 rounded-full" />
                    </div>

                    {/* Secure */}
                    <div className="group bg-blue-600 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:bg-blue-700 transition-all duration-300">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-6">
                            🔒
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                            100% Secure
                        </h3>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            Bank-grade encryption protecting every payment you make, every single time.
                        </p>
                        <div className="mt-6 h-0.5 w-10 bg-white/50 group-hover:w-full transition-all duration-500 rounded-full" />
                    </div>
                </div>

                {/* Footer strip */}
                <div className="pt-8 border-t border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-gray-400 tracking-widest uppercase font-mono">
                        Africa Data Solutions · Trusted Across the Continent
                    </span>
                </div>

            </div>

            {/* Bottom accent bar */}
            <div className="h-1 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400" />
        </section>
    );
};

export default About;