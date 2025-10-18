'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PasswordProtectionPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // For now, using a simple password. In production, this should come from environment variables
  const PROTECTED_PASSWORD = 'PanJACEK1969!' // You can change this

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password === PROTECTED_PASSWORD) {
      // Set a session storage flag to remember they've entered the correct password
      sessionStorage.setItem('passwordProtected', 'true')
      router.push('/landing')
    } else {
      setError('Incorrect password. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

      <Card className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-fuchsia-500/80 via-violet-500/80 to-sky-400/80 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-[0_18px_45px_rgba(129,140,248,0.35)]">
            HR
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            Welcome to Humility Recovery
          </CardTitle>
          <CardDescription className="text-white/70">
            Please enter the access password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-300 text-center">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-sky-400 hover:from-fuchsia-600 hover:via-violet-600 hover:to-sky-500 text-white font-semibold py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Continue to Site'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/50">
              This site is currently in development and requires password protection
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
