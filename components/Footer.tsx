'use client'

import React from 'react'
import { format } from 'date-fns'

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <p>© 2024 ROI Calculator. Built with Next.js, TypeScript & Tailwind CSS.</p>
          </div>
          <div className="flex items-center gap-4">
            <span>Generated on {format(new Date(), 'PPP')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}