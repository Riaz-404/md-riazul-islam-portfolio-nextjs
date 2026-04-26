export interface CommentData {
  _id?: string;
  blogId: string;
  blogSlug: string;
  content: string;
  authorName: string;
  isHidden: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
