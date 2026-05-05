export default function HeroSection() {
    return (
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              DentFlow
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600">
            No credit card required • 14 days free • Cancel anytime
          </p>
        </div>
    )
}