import { writable } from 'svelte/store';

export type User = {
  id: string;
  email: string;
  name: string;
  full_name?: string;
  role: string;
};

export const user = writable<User | null>(null); 