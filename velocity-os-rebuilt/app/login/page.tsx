'use client'

import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7B61FF] to-[#00D4FF] flex items-center justify-center p-5">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] bg-clip-text text-transparent mb-2">
            VelocityOS
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-[#00D4FF] hover:text-[#7B61FF]">
              Forgot password?
            </a>
          </div>

          <Link
            href="/dashboard"
            className="block w-full py-3 bg-gradient-to-r from-[#7B61FF] to-[#00D4FF] text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center"
          >
            Sign In
          </Link>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-[#00D4FF] hover:text-[#7B61FF] font-semibold">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}
