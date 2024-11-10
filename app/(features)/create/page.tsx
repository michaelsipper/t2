// app/(features)/create/page.tsx
'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Upload, Link as LinkIcon } from 'lucide-react';
import { EventData, EventLocation } from '@/lib/types';

type PlanType = 'scheduled' | 'realtime' | 'external';

interface CreateFormData {
  title: string;
  description: string;
  location: EventLocation;
  totalSpots: number;
  datetime?: string;
  duration?: number;
  externalUrl?: string;
}

export default function CreatePage() {
  const [planType, setPlanType] = useState<PlanType>('scheduled');
  const [formData, setFormData] = useState<CreateFormData>({
    title: '',
    description: '',
    location: { name: '' },
    totalSpots: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Submitting:', { type: planType, ...formData });
  };

  const renderPlanTypeSelector = () => (
    <div className="flex space-x-2 mb-6">
      {[
        { id: 'scheduled', label: 'Scheduled Plan', icon: Calendar },
        { id: 'realtime', label: 'Real-time Activity', icon: Clock },
        { id: 'external', label: 'External Event', icon: LinkIcon },
      ].map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setPlanType(id as PlanType)}
          className={`flex-1 flex items-center justify-center p-4 rounded-lg border transition-colors ${
            planType === id 
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-5 h-5 mr-2" />
          <span className="font-medium">{label}</span>
        </button>
      ))}
    </div>
  );

  const renderScheduledForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What's the plan?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add more details about your plan..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location.name}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, name: e.target.value } 
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where's it happening?"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Spots
          </label>
          <input
            type="number"
            min="1"
            value={formData.totalSpots}
            onChange={(e) => setFormData({ ...formData, totalSpots: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );

  const renderRealtimeForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What's happening now?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add more details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (hours)
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={formData.location.name}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, name: e.target.value } 
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Where are you?"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderExternalForm = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event URL
          </label>
          <input
            type="url"
            value={formData.externalUrl}
            onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste event link here"
          />
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <Upload className="w-8 h-8 mx-auto mb-2" />
          <p>Or drag and drop event image/flyer here</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a Plan</h1>
      
      {renderPlanTypeSelector()}

      <form onSubmit={handleSubmit} className="space-y-6">
        {planType === 'scheduled' && renderScheduledForm()}
        {planType === 'realtime' && renderRealtimeForm()}
        {planType === 'external' && renderExternalForm()}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
}