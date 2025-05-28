export interface Story {
    id: number;
    username: string;
    imageUrl: string;
    avatarUrl: string;
    location?: string;
    isVerified?: boolean;
    isPromoted?: boolean;
  }