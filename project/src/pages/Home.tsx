import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Briefcase, Users, TrendingUp, ArrowRight, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import JobCard from '../components/Jobs/JobCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  category: string
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  salary_min: number | null
  salary_max: number | null
  currency: string
  description: string
  featured: boolean
  created_at: string
}

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([])
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Fetch featured jobs
      const { data: featured } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      // Fetch recent jobs
      const { data: recent } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6)

      setFeaturedJobs(featured || [])
      setRecentJobs(recent || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchTerm.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with top employers and discover career opportunities that match your skills and ambitions.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-6">
                  <Briefcase className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">10,000+</div>
                  <div className="text-blue-100">Active Jobs</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-6">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">50,000+</div>
                  <div className="text-blue-100">Job Seekers</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-lg p-6">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">5,000+</div>
                  <div className="text-blue-100">Companies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
              </div>
              <p className="text-gray-600 text-lg">
                Hand-picked opportunities from top companies
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recent Jobs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Opportunities</h2>
              <p className="text-gray-600 text-lg">
                Fresh job postings updated daily
              </p>
            </div>
            <Link
              to="/jobs"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <span>View All Jobs</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect job through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              to="/signup"
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Post Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}