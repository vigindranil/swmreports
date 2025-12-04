"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Zap, TrendingUp, MapPin, Calendar, DownloadCloud, ArrowRight, Check, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time waste collection data with detailed charts and visualizations"
    },
    {
      icon: MapPin,
      title: "Location-Based Tracking",
      description: "Track waste collection across multiple locations, districts, and blocks"
    },
    {
      icon: Calendar,
      title: "Date Range Filtering",
      description: "Analyze data by specific time periods with flexible date range selection"
    },
    {
      icon: DownloadCloud,
      title: "Export Reports",
      description: "Download waste collection reports in Excel format for further analysis"
    },
    {
      icon: TrendingUp,
      title: "Property-wise Breakdown",
      description: "Detailed waste statistics by property type across all locations"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get the latest waste collection data instantly with fast API integration"
    }
  ]

  const stats = [
    { value: "100+", label: "Locations Tracked" },
    { value: "11", label: "Property Types" },
    { value: "24/7", label: "Live Monitoring" },
    { value: "4+", label: "Years of Data" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SWM Reports</span>
            </div>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Welcome to SWM Dashboard</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Solid Waste Management<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Analytics Platform
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Comprehensive waste collection tracking and reporting system with real-time data analysis, location-based insights, and powerful export capabilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-lg px-8 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all">
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-slate-700 hover:bg-slate-800 text-slate-200 text-lg px-8 h-12 rounded-lg"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-emerald-500/50 transition-colors">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-2">
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm sm:text-base">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-slate-400">
            Everything you need to manage and analyze waste collection data
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
                <CardContent className="pt-8">
                  <div className="mb-4 p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg w-fit group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-colors">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Key Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700">
          <CardContent className="pt-12 pb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
              Key Capabilities
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Hierarchical Data Navigation",
                  items: ["State", "District", "Block", "Gram Panchayat level drilling"]
                },
                {
                  title: "Advanced Filtering",
                  items: ["Month and year selection", "Date range filtering", "Collection level categorization"]
                },
                {
                  title: "Property Type Analysis",
                  items: ["11 different property types", "Organic/Inorganic breakdown", "Active property tracking"]
                },
                {
                  title: "Data Export",
                  items: ["Excel format reports", "CSV downloads", "Batch export capability"]
                }
              ].map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-emerald-400 mb-4">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-3 text-slate-300">
                        <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border-emerald-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-12 pb-12 relative z-10">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Access comprehensive waste management analytics and reporting tools in seconds.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white text-lg px-10 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  Open Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-400 text-sm">
            <p>&copy; 2025 SWM Reports. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-6 sm:mt-0">
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
