// app/login/[tab]/page.tsx
'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { signInAction, signUpAction } from '../actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props {
  params: {
    tab: string // "sign-in" or "sign-up"
  }
}

export default function LoginTabPage({ params }: Props) {
  const { tab } = params
  const router = useRouter()
  const { user, loading, refreshProfile } = useUser()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // If already logged in, go to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [loading, user, router])

  // Validate the tab
  if (tab !== 'sign-in' && tab !== 'sign-up') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <h1 className="text-2xl font-bold">404 – Page Not Found</h1>
          <p className="mt-4">The page &quot;{tab}&quot; does not exist.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const isSignIn = tab === 'sign-in'
  const title = isSignIn ? 'Sign In' : 'Create Account'
  const action = isSignIn ? signInAction : signUpAction

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await action(formData)
        await refreshProfile()
        router.replace('/dashboard')
      } catch (err: any) {
        setError(err.message)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">{title}</h1>

          {error && (
            <div className="mb-4 rounded bg-red-100 px-4 py-2 text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* For “sign-up” we need a Full Name field */}
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded border border-border px-3 py-2"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded border border-border px-3 py-2"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded border border-border px-3 py-2"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 disabled:opacity-50"
            >
              {isPending
                ? isSignIn
                  ? 'Signing In…'
                  : 'Creating Account…'
                : title}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
