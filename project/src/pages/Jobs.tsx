import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import JobCard from '../components/Jobs/JobCard'
import JobFilters from '../components/Jobs/JobFilters'
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

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 12

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    experience: searchParams.get('experience') || ''
  })

  useEffect(() => {
    fetchJobs()
  }, [filters, currentPage])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('jobs')
        .select('*', { count: 'exact' })
        .eq('status', 'active')

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.experience) {
        query = query.eq('experience_level', filters.experience)
      }

      // Pagination
      const from = (currentPage - 1) * jobsPerPage
      const to = from + jobsPerPage - 1

      const { data, count, error } = await query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setJobs(data || [])
      setTotalJobs(count || 0)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setCurrentPage(1)

    // Update URL parameters
    const newSearchParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v)
    })
    setSearchParams(newSearchParams)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      category: '',
      type: '',
      experience: ''
    }
    setFilters(clearedFilters)
    setCurrentPage(1)
    setSearchParams(new URLSearchParams())
  }

  const totalPages = Math.ceil(totalJobs / jobsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">
            {totalJobs} job{totalJobs !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Filters */}
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Job Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search terms to find more opportunities.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}