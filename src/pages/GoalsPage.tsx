import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { GoalList } from '../components/goals/GoalList';
import { GoalForm } from '../components/goals/GoalForm';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { StatCard } from '../components/common/StatCard';
import { Goal } from '../types';
import { useLifeData } from '../hooks/useLifeData';
import { calculateGoalProgress } from '../utils/calculations';
import { triggerConfetti } from '../utils/confetti';

export interface GoalsPageProps {
  lifeData: ReturnType<typeof useLifeData>;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = ({ lifeData, onShowToast }) => {
  const { goals, addGoal, updateGoal, updateGoalProgress, toggleGoalCompleted, deleteGoal } = lifeData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const completedCount = goals.filter(g => g.completed).length;
  const inProgressCount = goals.filter(g => !g.completed).length;
  const overallProgress = calculateGoalProgress(goals);

  const handleToggleComplete = (id: string) => {
    const goal = goals.find(g => g.id === id);
    const willBeCompleted = goal ? !goal.completed : true;
    toggleGoalCompleted(id);
    if (willBeCompleted) {
      triggerConfetti(2200);
      onShowToast('🎉 Milestone Achieved!', `Congratulations on completing "${goal?.title || 'your goal'}"!`, 'success');
    }
  };

  const handleUpdateProgress = (id: string, progress: number) => {
    updateGoalProgress(id, progress);
    if (progress >= 100) {
      triggerConfetti(2200);
      onShowToast('🎯 100% Milestone Hit!', 'Goal completed with full progress!', 'success');
    }
  };

  const handleAddSubmit = (data: Parameters<typeof addGoal>[0]) => {
    try {
      addGoal(data);
      setIsModalOpen(false);
      onShowToast('Goal Created', `${data.title} added to targets.`, 'success');
      if (data.progress >= 100) {
        triggerConfetti(2000);
      }
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    }
  };

  const handleEditSubmit = (data: Parameters<typeof addGoal>[0]) => {
    if (!editingGoal) return;
    try {
      updateGoal(editingGoal.id, data);
      setEditingGoal(null);
      onShowToast('Goal Updated', `"${data.title}" updated successfully.`, 'success');
      if (data.progress >= 100 && (!editingGoal.completed || editingGoal.progress < 100)) {
        triggerConfetti(2000);
      }
    } catch (err: any) {
      onShowToast('Error', err.message, 'error');
    }
  };

  return (
    <PageContainer
      title="Personal Goals & Milestones"
      subtitle="Track your long-term ambitions and mark completed achievements on your Life Receipt."
      action={
        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
          + Add Goal
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Overall Progress"
            value={`${overallProgress}%`}
            subtitle="Average progress of all goals"
            icon={<span className="text-xl">📈</span>}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Active compounding targets"
            icon={<span className="text-xl">⏳</span>}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Milestones checked off"
            icon={<span className="text-xl">🏆</span>}
          />
        </div>

        {/* Goals Grid */}
        <GoalList
          goals={goals}
          onUpdateProgress={handleUpdateProgress}
          onToggleComplete={handleToggleComplete}
          onDelete={deleteGoal}
          onEdit={setEditingGoal}
          onAddClick={() => setIsModalOpen(true)}
        />

        {/* Add Goal Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Goal"
        >
          <GoalForm
            onSubmit={handleAddSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        {/* Edit Goal Modal */}
        <Modal
          isOpen={Boolean(editingGoal)}
          onClose={() => setEditingGoal(null)}
          title="Edit Goal"
        >
          {editingGoal && (
            <GoalForm
              initialData={editingGoal}
              submitLabel="Update Goal"
              onSubmit={handleEditSubmit}
              onCancel={() => setEditingGoal(null)}
            />
          )}
        </Modal>
      </div>
    </PageContainer>
  );
};
