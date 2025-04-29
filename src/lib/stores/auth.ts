import { writable } from 'svelte/store';

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const user = writable<User | null>(null); 