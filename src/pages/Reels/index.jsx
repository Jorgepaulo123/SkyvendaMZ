import React from 'react';
import ReelsSidebar from '../chat/ui/ReelsSidebar';
import { useNavigate } from 'react-router-dom';

export default function ReelsPage() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center w-full">
      <ReelsSidebar show={true} onBack={() => navigate(-1)} />
    </div>
  );
}
