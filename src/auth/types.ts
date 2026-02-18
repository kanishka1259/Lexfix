export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'learner' | 'educator' | 'parent';
}

export type SessionPayload = {
  user: User;
  expires: string;
};
