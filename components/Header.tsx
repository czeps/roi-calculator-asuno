'use client'

import React from 'react'
import { Calculator } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Asuno ROI Calculator
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Automation Return on Investment Analysis
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center">
          <span className="text-sm font-medium text-primary">
            Powered by Asuno
          </span>
        </div>
      </div>
    </header>
  )
}