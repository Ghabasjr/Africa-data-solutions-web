const testimonials = [
    {
        name: "Chukwuemeka Obi",
        role: "Business Owner, Lagos",
        message:
            "Africa Data Solutions transformed how I handle payments for my business. The speed and reliability are unmatched — I process hundreds of transactions daily without a single hiccup.",
        initials: "CO",
    },
    {
        name: "Amina Bello",
        role: "Freelancer, Abuja",
        message:
            "Paying my DStv and electricity bills used to be a hassle. Now it takes seconds. I can't imagine going back to the old way of doing things.",
        initials: "AB",
    },
    {
        name: "Kwame Asante",
        role: "E-commerce Merchant, Accra",
        message:
            "The security features give me total peace of mind. My customers trust me more knowing their payment data is fully protected. Absolutely worth it.",
        initials: "KA",
    },
    {
        name: "Ngozi Adeyemi",
        role: "Student, Port Harcourt",
        message:
            "Buying airtime and data bundles has never been this easy. The platform is fast, simple, and always available whenever I need it.",
        initials: "NA",
    },
];

const Testimonials = () => {
    return (
        <section className="min-h-screen bg-white font-serif text-gray-900 relative overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-40 -translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50 rounded-full opacity-60 translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

            {/* Top accent bar */}
            <div className="h-1 bg-linear-to-r from-blue-400 via-blue-600 to-blue-400" />

            <div className="max-w-5xl mx-auto px-6 py-20 relative z-10">

                {/* Header */}
                <div className="mb-16">
                    <p className="text-xs tracking-widest uppercase text-blue-500 font-mono mb-4">
                        ◈ What People Say
                    </p>
                    <h1 className="text-6xl font-light text-gray-900 leading-tight tracking-tight mb-4">
                        Testimonials
                    </h1>
                    <p className="text-lg text-gray-400 italic">
                        Real stories from real customers across Africa.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-14">
                    <div className="w-16 h-px bg-blue-500" />
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            className={`group rounded-2xl p-8 transition-all duration-300 ${index === 1
                                ? "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-xl"
                                : "bg-white border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-lg"
                                }`}
                        >
                            {/* Quote mark */}
                            <div
                                className={`text-5xl font-serif leading-none mb-4 select-none ${index === 1 ? "text-white/30" : "text-blue-200"
                                    }`}
                            >
                                "
                            </div>

                            {/* Message */}
                            <p
                                className={`text-sm leading-relaxed mb-8 ${index === 1 ? "text-blue-100" : "text-gray-600"
                                    }`}
                            >
                                {t.message}
                            </p>

                            {/* Expanding underline */}
                            <div
                                className={`h-0.5 w-10 mb-6 group-hover:w-full transition-all duration-500 rounded-full ${index === 1 ? "bg-white/40" : "bg-blue-400"
                                    }`}
                            />

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${index === 1
                                        ? "bg-white/20 text-white"
                                        : "bg-blue-600 text-white"
                                        }`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <p
                                        className={`text-sm font-semibold tracking-tight ${index === 1 ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {t.name}
                                    </p>
                                    <p
                                        className={`text-xs ${index === 1 ? "text-blue-200" : "text-gray-400"
                                            }`}
                                    >
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default Testimonials;