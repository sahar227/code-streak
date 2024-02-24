import { tokenExistsAtom, userAtom } from "@/state/auth";
import * as SecureStore from "expo-secure-store";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { authStorageKey } from "./constants";
import { codeStreakApi } from "@/api";
import { userResponseSchema } from "contracts";

export const useLoadUser = () => {
  const [authLoaded, setAuthLoaded] = useState(false);
  const setUser = useSetAtom(userAtom);
  const tokenExists = useAtomValue(tokenExistsAtom);

  useEffect(() => {
    async function loadToken() {
      if (!tokenExists) return;

      const token = await SecureStore.getItemAsync(authStorageKey);
      if (!token) {
        return;
      }
      codeStreakApi.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      const { data } = await codeStreakApi.get("/users");
      const user = userResponseSchema.parse(data);
      setUser(user);
    }
    setAuthLoaded(false);
    loadToken().finally(() => setAuthLoaded(true));
  }, [tokenExists]);

  return authLoaded;
};
