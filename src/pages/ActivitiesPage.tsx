import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ActivityList } from '../components/activities/ActivityList';
import { ActivityForm } from '../components/activities/ActivityForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { ACTIVITY_CATEGORIES } from '../constants';
import { useLifeData } from '../hooks/useLifeData';
import { calculateTotalTime } from '../utils/calculations';
import { formatMinutesToHoursMinutes } from '../utils/formatters';

export interface ActivitiesPageProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ActivitiesPage: React.FC<ActivitiesPageProps> = ({ lifeData, onShowToast }) => {
  const { activities, addActivity, deleteActivity } = lifeData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchCat = selectedCategory === 'All' || act.category === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.notes && act.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activities, selectedCategory, searchQuery]);

  const totalFilteredMinutes = useMemo(() => {
    return calculateTotalTime(filteredActivities);
  }, [filteredActivities]);

  const handleAddSubmit = (data: Parameters<typeof addActivity>[0]) => {
    try {
      addActivity(data);
      setIsModalOpen(false);
      onShowToast('Activity Added', `${data.title} added successfully.`, 'success');
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    }
  };

  return (
    <PageContainer
      title="Tracked Activities"
      subtitle="View, categorize, and filter how every minute of your day is invested."
      action={
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Add Activity
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter and Metrics Bar */}
        <Card className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-sm">
            <label htmlFor="activity-search" className="sr-only">
              Search activities
            </label>
            <input
              id="activity-search"
              type="search"
              placeholder="Search by title or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-100 placeholder-neutral-500 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[44px]"
            />
          </div>

          {/* Time Total for Current Filter */}
          <div className="flex items-center gap-3 self-end md:self-auto font-mono text-sm">
            <span className="text-neutral-400">Total Duration:</span>
            <span className="text-amber-400 font-bold text-base">
              {formatMinutesToHoursMinutes(totalFilteredMinutes)}
            </span>
          </div>
        </Card>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2" role="group" aria-label="Filter by activity category">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
              selectedCategory === 'All'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            All ({activities.length})
          </button>
          {ACTIVITY_CATEGORIES.map((cat) => {
            const count = activities.filter(a => a.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Activity Feed */}
        <ActivityList
          activities={filteredActivities}
          onDelete={deleteActivity}
          onAddClick={() => setIsModalOpen(true)}
        />

        {/* Add Activity Accessible Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Tracked Activity"
        >
          <ActivityForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </PageContainer>
  );
};
