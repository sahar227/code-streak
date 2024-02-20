import { atom } from "jotai";

interface User {
  name: string;
}
export const userAtom = atom<User | undefined>(undefined);
export const tokenFetchAtom = atom(false);
