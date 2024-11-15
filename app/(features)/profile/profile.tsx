"use client";

import { useState, useRef } from 'react';
import { 
  Camera, MapPin, Shield, Plus, X, Check, 
  Edit3, Activity, GripVertical, PlusCircle,
  ChevronDown, Pencil
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert } from '@/components/ui/alert';
import { useAppContext } from '@/components/shared/AppContext';
import { FeedCard } from '@/components/shared/feed-card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FeedItem } from '@/lib/types';

interface ProfilePhoto {
  id: string;
  url: string | null;
  order: number;
}

interface ProfileBlurb {
  id: string;
  prompt: string;
  response: string;
}

interface ProfileData {
  name: string;
  age: number;
  location: string;
  bio: string;
  photos: ProfilePhoto[];
  blurbs: ProfileBlurb[];
  joinDate: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
}

interface SortableBlurbProps {
  id: string;
  prompt: string;
  response: string;
  isEditing: boolean;
  onUpdate: (response: string) => void;
  onRemove: () => void;
}

const SortableBlurb = ({ id, prompt, response, isEditing, onUpdate, onRemove }: SortableBlurbProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        {isEditing && (
          <button 
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-zinc-400" />
          </button>
        )}
        <h3 className="text-lg font-medium dark:text-zinc-100">{prompt}</h3>
      </div>
      {isEditing ? (
        <div className="relative">
          <textarea
            value={response}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full text-zinc-600 dark:text-zinc-300 bg-transparent resize-none focus:outline-none min-h-[60px] pr-8"
            placeholder="Your response..."
          />
          <button
            onClick={onRemove}
            className="absolute top-0 right-0 p-1 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <p className="text-zinc-600 dark:text-zinc-300">{response}</p>
      )}
    </div>
  );
};

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (prompt: string) => void;
  defaultPrompts: string[];
}

const PromptModal = ({ isOpen, onClose, onAdd, defaultPrompts }: PromptModalProps) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full mx-4 p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Add a Prompt</h3>
        
        <div className="space-y-2 mb-4">
          {defaultPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                onAdd(prompt);
                onClose();
              }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {showCustomInput ? (
          <div className="space-y-4">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Type your custom prompt..."
              className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCustomInput(false)}
                className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customPrompt.trim()) {
                    onAdd(customPrompt);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
                disabled={!customPrompt.trim()}
              >
                Add Custom Prompt
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCustomInput(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-colors text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Create Custom Prompt
          </button>
        )}
      </div>
    </div>
  );
};

function Profile() {
  const { showToast } = useToast();
  const { profileData, feedItems, updateProfilePhoto, updateAvatarPhoto, updateBannerPhoto, updateBlurb, removeBlurb, addBlurb } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultPrompts = [
    "My go-to adventure is...",
    "You'll find me...",
    "Best local spot...",
    "Next on my list...",
    "My signature move...",
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activePlans = feedItems.filter(item => 
    item.poster.name === profileData.name && 
    (item.type === 'scheduled' || item.type === 'realtime')
  );

  const handlePhotoUpload = async (id: string, file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      updateProfilePhoto(id, url);
      showToast("Photo updated successfully!");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      updateAvatarPhoto(url);
      showToast("Profile photo updated successfully!");
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (file) {
      const url = URL.createObjectURL(file);
      updateBannerPhoto(url);
      showToast("Banner updated successfully!");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = profileData.blurbs.findIndex(blurb => blurb.id === active.id);
      const newIndex = profileData.blurbs.findIndex(blurb => blurb.id === over.id);
      const newBlurbs = arrayMove(profileData.blurbs, oldIndex, newIndex);
      // Update blurbs order in context
      newBlurbs.forEach(blurb => updateBlurb(blurb.id, blurb.response));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      {/* Banner */}
      <div 
        className="relative h-32 bg-gradient-to-r from-indigo-400 to-sky-400 bg-cover bg-center"
        style={profileData.bannerUrl ? { backgroundImage: `url(${profileData.bannerUrl})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        {isEditing && (
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])}
            />
            <div className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
              <Camera className="w-5 h-5" />
            </div>
          </label>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Profile Header Section */}
        <div className="relative -mt-16">
          <div className="flex gap-6">
            {/* Profile Picture */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-2xl ring-4 ring-white dark:ring-zinc-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center overflow-hidden">
                {profileData.avatarUrl ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profileData.name[0]}
                  </span>
                )}
              </div>

              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute -top-2 -right-2 p-2 rounded-full bg-white dark:bg-zinc-900 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                {isEditing ? (
                  <Check className="w-4 h-4 text-blue-500" />
                ) : (
                  <Edit3 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                )}
              </button>

              {isEditing && (
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                  />
                  <div className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                </label>
              )}
            </div>

            {/* Name, Age, Location Section */}
            <div className="flex-1 pt-20">
              <div className="inline-flex items-center gap-2 max-w-full">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => updateProfileData({ name: e.target.value })}
                      className="text-xl font-bold bg-transparent dark:text-white focus:outline-none max-w-[200px]"
                    />
                    <span className="text-zinc-400 dark:text-zinc-500">,</span>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => updateProfileData({ age: parseInt(e.target.value) })}
                      className="w-16 text-lg bg-transparent dark:text-zinc-300 focus:outline-none"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold dark:text-white">
                      {profileData.name}
                    </h2>
                    <span className="text-zinc-400 dark:text-zinc-500">,</span>
                    <span className="text-lg dark:text-zinc-300">
                      {profileData.age}
                    </span>
                  </>
                )}
                <Shield className="w-5 h-5 text-blue-500" />
              </div>

              <div className="flex items-center gap-1.5 text-zinc-500 mt-2">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => updateProfileData({ location: e.target.value })}
                    className="text-sm bg-transparent focus:outline-none max-w-[200px]"
                  />
                ) : (
                  <span className="text-sm">{profileData.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => updateProfileData({ bio: e.target.value })}
                placeholder="Add a bio..."
                className="w-full text-sm bg-transparent dark:text-zinc-100 focus:outline-none resize-none min-h-[60px] max-h-[120px]"
              />
            ) : (
              <p className="text-sm dark:text-zinc-100">{profileData.bio}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200 dark:border-zinc-800 mt-8">
        <div className="flex gap-8">
            {['photos', 'plans'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-1 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab 
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
              >
                {tab === 'photos' ? 'Photos & Prompts' : 'Active Plans'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="py-6 space-y-6">
          {activeTab === 'photos' ? (
            <div className="space-y-8">
              {/* Photos and Prompts */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={profileData.blurbs.map(blurb => blurb.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {profileData.photos.map((photo, index) => (
                    <div key={photo.id} className="space-y-4">
                      <div className={`relative rounded-2xl overflow-hidden ${
                        index === 0 ? 'aspect-[2/1]' : 'aspect-square'
                      } bg-zinc-100 dark:bg-zinc-900`}>
                        {photo.url ? (
                          <img
                            src={photo.url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Plus className="w-8 h-8 text-zinc-400" />
                          </div>
                        )}
                        {isEditing && (
                          <label className="absolute inset-0 cursor-pointer">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => e.target.files?.[0] && handlePhotoUpload(photo.id, e.target.files[0])}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors group">
                              <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </label>
                        )}
                      </div>
                      
                      {index < profileData.blurbs.length && (
                        <SortableBlurb
                          id={profileData.blurbs[index].id}
                          prompt={profileData.blurbs[index].prompt}
                          response={profileData.blurbs[index].response}
                          isEditing={isEditing}
                          onUpdate={(response) => updateBlurb(profileData.blurbs[index].id, response)}
                          onRemove={() => removeBlurb(profileData.blurbs[index].id)}
                        />
                      )}
                    </div>
                  ))}
                </SortableContext>
              </DndContext>

              {isEditing && profileData.blurbs.length < profileData.photos.length && (
                <button
                  onClick={() => setShowPromptModal(true)}
                  className="w-full p-4 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  + Add another prompt
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activePlans.length > 0 ? (
                activePlans.map(item => (
                  <FeedCard
                    key={item.id}
                    item={item}
                    onInterestToggle={() => {}}
                    onRepostToggle={() => {}}
                    onDelete={() => {}}
                    isInterested={false}
                    isReposted={false}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-400">No active plans</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Prompt Modal */}
      {showPromptModal && (
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          onAdd={(prompt) => addBlurb(prompt)}
          defaultPrompts={defaultPrompts}
        />
      )}
    </div>
  );
}

export default Profile;