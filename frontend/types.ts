export interface Certification {
  id?: string;
  _id?: any;
  title: string;
  issuer: string;
  date: string;
  status?: 'completed' | 'in-progress';
  iconUrl?: string;
}
