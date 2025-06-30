import React from 'react'
import { Search, MapPin, Briefcase, Clock } from 'lucide-react'

interface JobFiltersProps {
  filters: {
    search: string
    location: string
    category: string
    type: string
    experience: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
}

export default function JobFilters({ filters, onFilterChange, onClearFilters }: JobFiltersProps) {
  const categories = [
    'Technology',
    'Marketing',
    'Design',
    'Sales',
    'Finance',
    'Healthcare',
    'Education',
    'Engineering',
    'Customer Service',
    'Human Resources'
  ]

  const jobTypes = ['full-time', 'part-time', 'contract', 'remote']
  const experienceLevels = ['entry', 'mid', 'senior', 'executive']

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Jobs
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Job title, keywords..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City, state..."
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Experience Level and Clear Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.experience}
              onChange={(e) => onFilterChange('experience', e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level === 'entry' ? 'Entry Level' : 
                   level === 'mid' ? 'Mid Level' : 
                   level === 'senior' ? 'Senior Level' : 'Executive'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}