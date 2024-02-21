import { tokenExistsAtom, userAtom } from "@/state/auth";
import * as SecureStore from "expo-secure-store";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { authStorageKey } from "./constants";
import { codeStreakApi } from "@/api";

export const useLoadUser = () => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const setUser = useSetAtom(userAtom);
  const tokenExists = useAtomValue(tokenExistsAtom);

  useEffect(() => {
    if (!tokenExists) return;

    async function loadToken() {
      const token = await SecureStore.getItemAsync(authStorageKey);
      if (!token) {
        return;
      }
      codeStreakApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      // TODO: fetch user from token
      setUser({ name: "Sahar" });
    }
    setAuthLoaded(false);
    loadToken().finally(() => setAuthLoaded(true));
  }, [tokenExists]);

  return authLoaded;
};
