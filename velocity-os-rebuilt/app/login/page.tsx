'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual authentication in PR #6
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] p-16 text-white flex flex-col justify-center hidden md:flex">
          <h1 className="text-5xl font-bold mb-5">VelocityOS</h1>
          <p className="text-lg opacity-90 leading-relaxed">
            The AI-powered business operating system that automates your workflow, 
            unifies your data, and accelerates your growth.
          </p>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-10">Sign in to continue to VelocityOS</p>

          {/* Social Login Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium hover:border-[#667eea] hover:text-[#667eea] transition-all">
              Google
            </button>
            <button className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-medium hover:border-[#667eea] hover:text-[#667eea] transition-all">
              Microsoft
            </button>
          </div>

          <div className="text-center text-gray-500 mb-8">or sign in with email</div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#667eea] focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#667eea] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
