'use client'

import { useState } from 'react'
import { Actor } from '../page'

interface ActorRunnerProps {
  actor: Actor
  apiKey: string
  onBack: () => void
}

export default function ActorRunner({ actor, apiKey, onBack }: ActorRunnerProps) {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [runLoading, setRunLoading] = useState(false)

  const handleRun = async () => {
    if (!url) {
      setError('Please enter a URL.')
      return
    }

    setRunLoading(true)
    setError('')
    setResult(null)

    try {
      const inputs = {
        startUrls: [{ url }]
      }

      const response = await fetch(`/api/actors/${actor.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, inputs })
      })

      if (!response.ok) {
        throw new Error('Failed to run actor')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (err) {
      console.error('Error running actor:', err)
      setError('Failed to run actor')
    } finally {
      setRunLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{actor.title || actor.name}</h2>
          <p className="text-gray-600">{actor.description}</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter website URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleRun}
          disabled={runLoading}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {runLoading ? 'Running...' : 'Run Actor'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>

        {result ? (
          <div className="max-h-[600px] overflow-y-auto space-y-6">
            {Array.isArray(result) ? (
              result.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                  <h4 className="text-xl font-semibold text-blue-700 mb-2">
                    {item.metadata?.title || 'Untitled Page'}
                  </h4>
                  <p className="text-sm text-gray-500 mb-1">URL: {item.url}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Loaded: {new Date(item.crawl?.loadedTime).toLocaleString()} | Status:{' '}
                    {item.crawl?.httpStatusCode}
                  </p>
                  <div className="text-gray-800 whitespace-pre-wrap mb-2">
                    {item.text || 'No visible text content found.'}
                  </div>
                  {item.markdown?.includes('http') && (
                    <a
                      href="https://www.iana.org/domains/example"
                      className="text-blue-600 underline mt-2 inline-block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      More information...
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-700">No structured result found.</div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Run the actor to see results here
          </div>
        )}
      </div>
    </div>
  )
}
