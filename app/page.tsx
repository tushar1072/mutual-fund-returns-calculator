"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/ui/footer"



// Helper function to format numbers with commas and two decimal places
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(num);
}

export default function SIPCalculator() {
  const [investmentType, setInvestmentType] = useState("sip")
  const [amount, setAmount] = useState("1000")
  const [years, setYears] = useState("5")
  const [returnRate, setReturnRate] = useState("12")
  const [result, setResult] = useState(null)

  const calculateReturns = () => {
    const principal = parseFloat(amount)
    const time = parseInt(years)
    const rateOfReturn = parseFloat(returnRate) / 100 // Convert percentage to decimal

    if (isNaN(principal) || isNaN(time) || isNaN(rateOfReturn)) {
      alert("Please enter valid numbers for all fields.")
      return
    }

    let yearlyData = []
    let totalAmount, totalInvestment, totalReturns

    if (investmentType === "sip") {
      // SIP calculation
      const monthlyRate = rateOfReturn / 12
      let runningInvestment = 0
      let runningReturns = 0

      for (let year = 1; year <= time; year++) {
        runningInvestment = principal * year * 12
        totalAmount = principal * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) * (1 + monthlyRate)
        runningReturns = totalAmount - runningInvestment

        yearlyData.push({
          year,
          investment: runningInvestment,
          returns: runningReturns,
          totalValue: totalAmount
        })
      }
    } else {
      // Lump sum calculation
      for (let year = 1; year <= time; year++) {
        totalAmount = principal * Math.pow(1 + rateOfReturn, year)
        totalReturns = totalAmount - principal

        yearlyData.push({
          year,
          investment: principal,
          returns: totalReturns,
          totalValue: totalAmount
        })
      }
    }

    setResult(yearlyData)
  }

  const finalResult = useMemo(() => {
    if (!result) return null
    const lastYear = result[result.length - 1]
    return {
      totalInvestment: lastYear.investment,
      totalReturns: lastYear.returns,
      totalAmount: lastYear.totalValue
    }
  }, [result])

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">SIP Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 mb-6">
          <RadioGroup className="flex space-x-4" value={investmentType} onValueChange={setInvestmentType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sip" id="sip" />
              <Label htmlFor="sip">SIP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lumpsum" id="lumpsum" />
              <Label htmlFor="lumpsum">One-time Investment</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">
                {investmentType === "sip" ? "Monthly SIP Amount" : "One-time Investment Amount"}
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="years">Investment Period (Years)</Label>
              <Select value={years} onValueChange={setYears}>
                <SelectTrigger>
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 10, 15, 20, 25, 30].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year} {year === 1 ? "year" : "years"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="returnRate">Expected Annual Return Rate (%)</Label>
              <Input
                id="returnRate"
                type="number"
                placeholder="Enter expected return rate"
                value={returnRate}
                onChange={(e) => setReturnRate(e.target.value)}
              />
            </div>
          </div>

          <Button className="w-full bg-black text-white z-40" onClick={calculateReturns}>Calculate Returns</Button>
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Total Investment</h4>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(finalResult.totalInvestment)}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Total Returns</h4>
                <p className="text-2xl font-bold text-green-600">{formatNumber(finalResult.totalReturns)}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Total Amount</h4>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(finalResult.totalAmount)}</p>
              </div>
            </div>

            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={result}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => formatNumber(value).replace('₹', '')} />
                  <Tooltip 
                    formatter={(value, name) => [formatNumber(value), name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="investment" stackId="a" fill="#3b82f6" name="Investment" />
                  <Bar dataKey="returns" stackId="a" fill="#10b981" name="Returns" />
                  <Line type="monotone" dataKey="totalValue" stroke="#8b5cf6" name="Total Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    <Footer/>
    </>
  )
}