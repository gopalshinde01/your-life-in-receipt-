import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/common/Button';
import { ROUTES } from '../constants';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer
      title="404 — Ledger Entry Not Found"
      subtitle="The page or receipt record you requested does not exist in this ledger."
    >
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-4xl shadow-xl font-mono text-amber-400">
          🧾
        </div>

        <div>
          <h2 className="text-xl font-bold text-neutral-100 mb-2">
            Lost in the Ledger?
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            The URL path you entered doesn't match any registered application route.
            Don't worry — your recorded activities and receipts are completely safe.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.DASHBOARD}>
            <Button variant="primary" size="md">
              Return to Dashboard
            </Button>
          </Link>
          <Link to={ROUTES.RECEIPT}>
            <Button variant="outline" size="md">
              View Life Receipt
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
