import React from 'react';

const SkeletonInput = () => (
  <div className="mb-6 animate-pulse">
    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
    <div className="h-10 bg-gray-100 rounded-md w-full"></div>
  </div>
);

const SkeletonButton = () => (
  <div className="h-12 w-full bg-gray-200 rounded-md animate-pulse"></div>
);

const VerifiedCardSkeleton = () => (
  <div className="w-full bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="ml-4 space-y-2 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  </div>
);

const PendingCardSkeleton = () => (
  <div className="w-full bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="ml-4 space-y-2 flex-grow">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-12 bg-gray-100 rounded-md w-full mt-3"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mt-3"></div>
    </div>
  </div>
);

const UserFormSkeleton = () => (
  <div className="w-full bg-white rounded-lg shadow-md overflow-hidden p-4 animate-pulse">
    <div className="space-y-4">
      <div className="h-5 w-36 bg-gray-200 rounded mx-auto mb-4"></div>
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonInput />
      <SkeletonButton />
    </div>
  </div>
);

const VerificationSkeleton = ({ type = 'form' }) => {
  const skeletons = {
    verified: <VerifiedCardSkeleton />,
    pending: <PendingCardSkeleton />,
    form: <UserFormSkeleton />
  };

  return (
    <div className="w-full">
      {skeletons[type] || skeletons.form}
    </div>
  );
};

export default VerificationSkeleton;