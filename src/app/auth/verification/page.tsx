'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

export default function VerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const { sendOTP, verifyOTP } = useAuth()

  useEffect(() => {
    // Focus on first input when component mounts
    inputRefs.current[0]?.focus()
  }, [])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Email is required for verification')
      return
    }

    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await verifyOTP(email, otpCode)

      if (result.success) {
        setSuccess('Email verified successfully! Redirecting...')
        setTimeout(() => {
          router.push('/') // Redirect to home page after successful verification
        }, 2000)
      } else {
        setError(result.error || 'Invalid verification code. Please try again.')
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestNewCode = async () => {
    if (!email) {
      setError('Email is required to send verification code')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await sendOTP(email)

      if (result.success) {
        setSuccess('New verification code sent to your email!')
        // Clear current OTP
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        setError(result.error || 'Failed to send new code. Please try again.')
      }
    } catch (err) {
      setError('Failed to send new code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image src="/assets/cbgs-logo.png" alt="CBGS Logo" width={80} height={45} priority />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h2>
          <p className="text-gray-600 text-sm">
            We have sent a verification code to your email:{' '}
            {email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 'your email'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter OTP
            </label>

            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-colors"
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        {/* Request New Code */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleRequestNewCode}
            disabled={isLoading}
            className="text-green-600 hover:text-green-700 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Request a new code
          </button>
        </div>
      </div>
    </div>
  )
}
