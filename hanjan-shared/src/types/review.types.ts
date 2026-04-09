export interface Review {
  id: string;
  meetingId: string;
  reviewerId: string;
  reviewedUserId: string;
  conversationScore: number;
  punctualityScore: number;
  remeetScore: number;
  tags?: string[];
  comment?: string;
  createdAt: Date;
}

export interface CreateReviewDto {
  meetingId: string;
  reviewedUserId: string;
  conversationScore: number;
  punctualityScore: number;
  remeetScore: number;
  tags?: string[];
  comment?: string;
}

export interface MannerScore {
  id: string;
  userId: string;
  conversationAvg: number;
  punctualityAvg: number;
  remeetAvg: number;
  overallScore: number;
  totalReviews: number;
  updatedAt: Date;
}
