export interface ExpertiseSkill {
  id: string;
  name: string;
  percentage: number;
  category: string;
}

export interface ExpertiseCategory {
  id: string;
  name: string;
  skills: ExpertiseSkill[];
}

export interface ExpertiseData {
  id: string;
  title: string;
  subtitle: string;
  categories: ExpertiseCategory[];
  updatedAt: string;
  createdAt?: string;
}
