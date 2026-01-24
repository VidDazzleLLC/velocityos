'use client'

import Link from 'next/link'

export default function LandingPage() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-[#7B61FF] to-[#00D4FF] flex items-center justify-center p-5">
        <div className="max-w-6xl w-full text-center text-white">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-4">VelocityOS</h1>
          </div>

          {/* Hero Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Transform Your Business with AI-Powered Intelligence
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            The all-in-one AI business operating system that automates your workflow, 
            unifies your data, and accelerates your growth—all in one powerful platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white text-[#7B61FF] font-bold text-lg rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Get Started
            </Link>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all"
            >
              Learn More
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-white opacity-75"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your operations and drive business growth
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">AI-Powered Automation</h3>
              <p className="text-gray-600 leading-relaxed">
                Let AI handle repetitive tasks, generate insights, and make intelligent recommendations 
                to boost productivity and efficiency.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Unified Workflows</h3>
              <p className="text-gray-600 leading-relaxed">
                Bring all your business processes together in one seamless platform. No more switching 
                between multiple tools and systems.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Data Centralization</h3>
              <p className="text-gray-600 leading-relaxed">
                Centralize all your business data in one secure location. Get real-time insights 
                and make data-driven decisions faster.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Accelerated Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                Scale your business with confidence. Our platform grows with you, providing the tools 
                and insights you need at every stage.
              </p>
            </div>
          </div>

          {/* Additional CTA */}
          <div className="text-center mt-16">
            <Link
              href="/dashboard"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-bold text-lg rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">VelocityOS</h3>
          <p className="text-gray-400 mb-4">The AI-Powered Business Operating System</p>
          <p className="text-gray-500 text-sm">© 2026 VelocityOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
