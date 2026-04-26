import { Schema, model, models, Document, Types } from "mongoose";

export interface IComment extends Document {
  blogId: Types.ObjectId;
  blogSlug: string;
  content: string;
  authorName: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    blogSlug: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    authorName: {
      type: String,
      trim: true,
      default: "Anonymous",
      maxlength: 50,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Comment = models.Comment || model<IComment>("Comment", CommentSchema);
