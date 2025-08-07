'use client'

import { useState } from 'react'

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void
  loading: boolean
}

export default function ApiKeyForm({ onSubmit, loading }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      onSubmit(apiKey.trim())
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Enter Your Apify API Key
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="apify_api_..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Get My Actors'}
          </button>
        </form>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Your API key is not stored and only used for this session
        </p>
      </div>
    </div>
  )
}