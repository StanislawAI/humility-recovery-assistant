'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-gray-600">
            There was a problem with your authentication link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>The magic link may have expired or been used already.</p>
            <p className="mt-2">Please try signing in again.</p>
          </div>
          
          <div className="space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full">
                Try Sign In Again
              </Button>
            </Link>
            
            <Link href="/signup" className="block">
              <Button variant="outline" className="w-full">
                Create New Account
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <Link 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




