'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HelpCircle, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Slider } from './ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { roiCalculatorSchema, type RoiCalculatorFormData } from '@/lib/schemas'
import { DEFAULT_VALUES, DEPARTMENTS, CATEGORIES, INDUSTRIES, CURRENCIES, CONFIDENCE_LEVELS } from '@/lib/constants'

interface FormCardProps {
  data: RoiCalculatorFormData
  onChange: (data: RoiCalculatorFormData) => void
}

export function FormCard({ data, onChange }: FormCardProps) {
  const { control, handleSubmit, watch, reset, setValue } = useForm<RoiCalculatorFormData>({
    resolver: zodResolver(roiCalculatorSchema),
    defaultValues: data,
  })

  const watchedValues = watch()

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        onChange(value as RoiCalculatorFormData)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  React.useEffect(() => {
    reset(data)
  }, [data, reset])

  const handleReset = () => {
    reset(DEFAULT_VALUES)
  }

  const currency = CURRENCIES.find(c => c.code === watchedValues.currency)

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ROI Calculator Inputs</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="processDescription">Process Name</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Give your process a clear, descriptive name</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="processDescription"
                    render={({ field }) => (
                      <Input
                        placeholder="e.g. Monthly expense reporting, Customer onboarding, Invoice processing..."
                        maxLength={100}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {watchedValues.processDescription?.length || 0}/100
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="hoursPerWeekPerPerson">Hours per Week per Person</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average hours spent on this process per person per week</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="hoursPerWeekPerPerson"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          max={60}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0</span>
                          <Badge variant="secondary">{field.value}h</Badge>
                          <span>60</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="people">Number of People</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total number of people involved in this process</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="people"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          min={1}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>1</span>
                          <Badge variant="secondary">{field.value} people</Badge>
                          <span>10</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="avgSalary">Average Salary</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Average salary cost including benefits and overhead</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Controller
                        control={control}
                        name="avgSalary"
                        render={({ field }) => (
                          <Input
                            type="number"
                            placeholder="Salary amount"
                            value={field.value || ''}
                            onChange={e => {
                              const value = e.target.value
                              field.onChange(value === '' ? 0 : Number(value))
                            }}
                          />
                        )}
                      />
                    </div>
                    <Controller
                      control={control}
                      name="salaryPeriod"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="mt-1">
                    <Controller
                      control={control}
                      name="currency"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map(curr => (
                              <SelectItem key={curr.code} value={curr.code}>
                                {curr.symbol} {curr.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Controller
                      control={control}
                      name="industry"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map(industry => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Controller
                      control={control}
                      name="department"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map(dept => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>


                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Automation Percentage</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>What percentage of this work can be automated?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="automationPct.real"
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Slider
                          value={[field.value]}
                          onValueChange={([value]) => field.onChange(value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0%</span>
                          <Badge variant="secondary">{field.value}%</Badge>
                          <span>100%</span>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Implementation Cost</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>One-time cost to implement the automation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="implOneOff"
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="e.g. 10000"
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? 0 : Number(value))
                        }}
                      />
                    )}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Monthly Running Cost</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ongoing monthly costs for maintenance and operations</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    control={control}
                    name="runMonthly"
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="e.g. 500"
                        value={field.value || ''}
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === '' ? 0 : Number(value))
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}