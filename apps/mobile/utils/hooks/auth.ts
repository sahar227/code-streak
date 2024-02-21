import { tokenExistsAtom, userAtom } from "@/state/auth";
import { useSetAtom } from "jotai";
import * as SecureStore from "expo-secure-store";
import { codeStreakApi } from "@/api";

const authStorageKey = "auth-token";

export const useLogin = () => {
  const setTokenExists = useSetAtom(tokenExistsAtom);
  function login(code: string) {
    codeStreakApi
      .post("auth", { code })
      .then(({ data }) => {
        SecureStore.setItemAsync(authStorageKey, data.token);
        setTokenExists(true);
      })
      .catch((e) => console.log(e.message));
  }
  return login;
};

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
