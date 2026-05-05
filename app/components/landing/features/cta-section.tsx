export default function CTASection() {
    return (
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of dental practices already using DentFlow
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/get-started"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:shadow-2xl transition-all duration-200"
            >
              Start Free Trial
            </a>
            <a
              href="/schedule-demo"
              className="px-8 py-4 bg-blue-700/50 text-white rounded-xl font-medium border-2 border-white/30 hover:bg-blue-700/70 transition-all duration-200"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>
    )
}