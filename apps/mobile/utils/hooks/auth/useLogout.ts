import { tokenExistsAtom, userAtom } from "@/state/auth";
import { useSetAtom } from "jotai";
import { authStorageKey } from "./constants";
import * as SecureStore from "expo-secure-store";

export const useLogout = () => {
  const setTokenExists = useSetAtom(tokenExistsAtom);
  const setUser = useSetAtom(userAtom);
  function logout() {
    SecureStore.deleteItemAsync(authStorageKey).then(() => {
      setTokenExists(false);
      setUser(undefined);
    });
  }
  return logout;
};
