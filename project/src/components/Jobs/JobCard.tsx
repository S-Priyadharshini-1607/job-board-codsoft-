import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, DollarSign, Building2, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

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

interface JobCardProps {
  job: Job
  className?: string
}

export default function JobCard({ job, className = '' }: JobCardProps) {
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
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${job.featured ? 'ring-2 ring-blue-500 ring-opacity-20' : ''} ${className}`}>
      {job.featured && (
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
          <span className="text-blue-700 text-sm font-medium">✨ Featured Job</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link to={`/jobs/${job.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-1">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700 font-medium">{job.company}</span>
            </div>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.type)}`}>
            {job.type.replace('-', ' ').toUpperCase()}
          </span>
        </div>

        <div className="space-y-2 mb-4">
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
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
          </div>
          
          <Link
            to={`/jobs/${job.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}