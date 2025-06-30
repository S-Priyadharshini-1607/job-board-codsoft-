import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const hasValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) && 
  !supabaseUrl.includes('your_supabase_project_url_here') &&
  !supabaseAnonKey.includes('your_supabase_anon_key_here')

// Create a mock client if configuration is invalid
const createMockClient = () => {
  const createMockQueryBuilder = () => {
    const mockQuery = {
      eq: () => mockQuery,
      neq: () => mockQuery,
      gt: () => mockQuery,
      gte: () => mockQuery,
      lt: () => mockQuery,
      lte: () => mockQuery,
      like: () => mockQuery,
      ilike: () => mockQuery,
      is: () => mockQuery,
      in: () => mockQuery,
      contains: () => mockQuery,
      containedBy: () => mockQuery,
      rangeGt: () => mockQuery,
      rangeGte: () => mockQuery,
      rangeLt: () => mockQuery,
      rangeLte: () => mockQuery,
      rangeAdjacent: () => mockQuery,
      overlaps: () => mockQuery,
      textSearch: () => mockQuery,
      match: () => mockQuery,
      not: () => mockQuery,
      or: () => mockQuery,
      filter: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      range: () => mockQuery,
      single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      maybeSingle: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      then: (resolve: any) => resolve({ data: [], error: null, count: 0 }),
      catch: () => mockQuery
    }
    return mockQuery
  }

  return {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => createMockQueryBuilder(),
      insert: () => Promise.reject(new Error('Supabase not configured')),
      update: () => ({
        eq: () => Promise.reject(new Error('Supabase not configured'))
      }),
      delete: () => Promise.reject(new Error('Supabase not configured'))
    })
  }
}

export const supabase = hasValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string
          role: 'candidate' | 'employer'
          company_name: string | null
          company_logo: string | null
          phone: string | null
          location: string | null
          website: string | null
          bio: string | null
          resume_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email: string
          role: 'candidate' | 'employer'
          company_name?: string | null
          company_logo?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          bio?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string
          role?: 'candidate' | 'employer'
          company_name?: string | null
          company_logo?: string | null
          phone?: string | null
          location?: string | null
          website?: string | null
          bio?: string | null
          resume_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
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
          status: 'active' | 'closed' | 'draft'
          applications_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employer_id: string
          title: string
          company: string
          location: string
          type: 'full-time' | 'part-time' | 'contract' | 'remote'
          category: string
          experience_level: 'entry' | 'mid' | 'senior' | 'executive'
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          description: string
          requirements: string
          benefits?: string | null
          featured?: boolean
          status?: 'active' | 'closed' | 'draft'
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employer_id?: string
          title?: string
          company?: string
          location?: string
          type?: 'full-time' | 'part-time' | 'contract' | 'remote'
          category?: string
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive'
          salary_min?: number | null
          salary_max?: number | null
          currency?: string
          description?: string
          requirements?: string
          benefits?: string | null
          featured?: boolean
          status?: 'active' | 'closed' | 'draft'
          applications_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          job_id: string
          candidate_id: string
          cover_letter: string
          resume_url: string
          status: 'pending' | 'reviewed' | 'rejected' | 'accepted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          candidate_id: string
          cover_letter: string
          resume_url: string
          status?: 'pending' | 'reviewed' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          candidate_id?: string
          cover_letter?: string
          resume_url?: string
          status?: 'pending' | 'reviewed' | 'rejected' | 'accepted'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}