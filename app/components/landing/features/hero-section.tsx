export default function HeroSection() {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-full mb-6 border border-blue-200">
                    <span className="text-sm text-blue-700">✨ Complete Feature Set</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                    Everything You Need to Run a <br />
                    <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                        Modern Dental Practice
                    </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    From appointment scheduling to payment processing, DentFlow provides all the tools
                    your dental practice needs to deliver exceptional patient care and grow your business.
                </p>
            </div>
        </section>
    );
}