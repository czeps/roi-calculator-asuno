'use client'

import React from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
              </div>
              <Link href="/">
                <Button>
                  Return to ROI Calculator
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}