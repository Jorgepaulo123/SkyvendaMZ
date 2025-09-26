import React from 'react';
import LeftSidebar from './LeftSidebar';
import CenterFeed from './CenterFeed';
import RightSidebar from './RightSidebar';

export default function FeedHome() {
  return (
    <div className="container mx-auto max-w-[1200px] px-2 md:px-4 py-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left */}
        <div className="hidden lg:block col-span-3">
          <LeftSidebar />
        </div>
        {/* Center */}
        <div className="col-span-12 lg:col-span-6">
          <CenterFeed />
        </div>
        {/* Right */}
        <div className="hidden xl:block col-span-3">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
