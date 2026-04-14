export interface PublicationData {
  _id?: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  url?: string;
  abstract?: string;
  type: "journal" | "conference" | "book" | "thesis" | "other";
  tags: string[];
  featured: boolean;
  isActive: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PublicationsResponse {
  success: boolean;
  data?: PublicationData[];
  message?: string;
}

export interface PublicationResponse {
  success: boolean;
  data?: PublicationData;
  message?: string;
}

export const publicationTypes = [
  { value: "journal", label: "Journal Article" },
  { value: "conference", label: "Conference Paper" },
  { value: "book", label: "Book / Book Chapter" },
  { value: "thesis", label: "Thesis / Dissertation" },
  { value: "other", label: "Other" },
] as const;
