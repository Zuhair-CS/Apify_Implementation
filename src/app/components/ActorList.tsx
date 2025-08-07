'use client'

import { Actor } from '../page'

interface ActorListProps {
  actors: Actor[]
  onSelect: (actor: Actor) => void
  onBack: () => void
}

export default function ActorList({ actors, onSelect, onBack }: ActorListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Actors</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {actors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No actors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actors.map((actor) => (
            <div
              key={actor.id}
              onClick={() => onSelect(actor)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border hover:border-blue-300"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {actor.title || actor.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {actor.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                  {actor.name}
                </span>
                <span className="text-blue-600 text-sm font-medium">
                  Run →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}