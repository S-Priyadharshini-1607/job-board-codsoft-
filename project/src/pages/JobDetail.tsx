import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Building2, Calendar, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from '../components/UI/LoadingSpinner'

interface Job {
  id: string
  employer_id: string
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
  requirements: string
  benefits: string | null
  featured: boolean
  applications_count: number
  created_at: string
}

export default function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasApplied, setHasApplied] = useState(false)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    if (id) {
      fetchJob()
      if (user && profile?.role === 'candidate') {
        checkApplicationStatus()
      }
    }
  }, [id, user, profile])

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .single()

      if (error) throw error
      setJob(data)
    } catch (error) {
      console.error('Error fetching job:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkApplicationStatus = async () => {
    if (!user || !id) return

    try {
      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('candidate_id', user.id)
        .single()

      setHasApplied(!!data)
    } catch (error) {
      // Not applied yet
    }
  }

  const handleApply = () => {
    if (!user) {
      navigate('/signin')
      return
    }

    if (profile?.role !== 'candidate') {
      alert('Only candidates can apply for jobs.')
      return
    }

    navigate(`/jobs/${id}/apply`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
      </div>
    )
  }

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `${job.currency}${job.salary_min.toLocaleString()} - ${job.currency}${job.salary_max.toLocaleString()}`
    }
    if (job.salary_min) {
      return `${job.currency}${job.salary_min.toLocaleString()}+`
    }
    return 'Salary not specified'
  }

  const getTypeColor = (type: string) => {
    const colors = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'remote': 'bg-orange-100 text-orange-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getExperienceLevel = (level: string) => {
    const levels = {
      'entry': 'Entry Level',
      'mid': 'Mid Level',
      'senior': 'Senior Level',
      'executive': 'Executive'
    }
    return levels[level as keyof typeof levels] || level
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Job Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  {job.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✨ Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <span className="text-xl text-gray-700 font-medium">{job.company}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatSalary()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{getExperienceLevel(job.experience_level)}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{job.applications_count} applicant{job.applications_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                    {job.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {job.category}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-6 lg:mt-0 lg:ml-8">
                {profile?.role === 'candidate' ? (
                  hasApplied ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg text-center">
                      ✓ Application Submitted
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full lg:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                    >
                      {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                  )
                ) : profile?.role === 'employer' && profile.user_id === job.employer_id ? (
                  <Link
                    to={`/employer/jobs/${job.id}/edit`}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Edit Job</span>
                  </Link>
                ) : (
                  <Link
                    to="/signin"
                    className="w-full lg:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center block"
                  >
                    Sign In to Apply
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Job Description */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </div>

              {/* Requirements */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>

              {/* Benefits */}
              {job.benefits && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Apply Section */}
          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="text-center">
              {profile?.role === 'candidate' ? (
                hasApplied ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-lg inline-block">
                      ✓ Your application has been submitted successfully
                    </div>
                    <p className="text-gray-600">
                      You can track the status of your application in your{' '}
                      <Link to="/candidate/dashboard" className="text-blue-600 hover:text-blue-700">
                        dashboard
                      </Link>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Ready to apply?</h3>
                    <p className="text-gray-600">
                      Take the next step in your career journey.
                    </p>
                    <button
                      onClick={handleApply}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Apply for This Position
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Interested in this position?</h3>
                  <p className="text-gray-600">
                    Sign in or create an account to apply for this job.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/signin"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}