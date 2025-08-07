'use client'

import { useState } from 'react'
import ApiKeyForm from './components/ApiKeyForm'
import ActorList from './components/ActorList'
import ActorRunner from './components/ActorRunner'

export interface Actor {
  id: string
  name: string
  title: string
  description: string
}

export default function Home() {
  const [apiKey, setApiKey] = useState('')
  const [actors, setActors] = useState<Actor[]>([])
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleApiKeySubmit = async (key: string) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/actors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key })
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch actors')
      }
      
      const data = await response.json()
      setApiKey(key)
      setActors(data.actors)
    } catch (err) {
      console.log('Error fetching actors:', err)
      setError('Failed to fetch actors. Please check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (selectedActor) {
      setSelectedActor(null)
    } else {
      setApiKey('')
      setActors([])
      setError('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Apify Actor Runner
        </h1>
        <p className="text-gray-600">
          Execute your Apify actors with dynamic schema loading
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!apiKey && (
        <ApiKeyForm onSubmit={handleApiKeySubmit} loading={loading} />
      )}

      {apiKey && !selectedActor && (
        <ActorList 
          actors={actors} 
          onSelect={setSelectedActor}
          onBack={handleBack}
        />
      )}

      {selectedActor && (
        <ActorRunner 
          actor={selectedActor}
          apiKey={apiKey}
          onBack={handleBack}
        />
      )}
    </div>
  )
}