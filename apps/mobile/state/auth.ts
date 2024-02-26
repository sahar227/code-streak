import { atom } from "jotai";
import { UserResponse } from "contracts";
export const userAtom = atom<UserResponse | undefined>(undefined);
export const tokenExistsAtom = atom(false);
