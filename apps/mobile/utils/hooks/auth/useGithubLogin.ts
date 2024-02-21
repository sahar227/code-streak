import { tokenExistsAtom } from "@/state/auth";
import { useSetAtom } from "jotai";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { codeStreakApi } from "@/api";
import { authStorageKey } from "./constants";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const clientID =
  process.env.EXPO_PUBLIC_AUTH_CLIENT_ID || "CLIENT_ID IS REQUIRED";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${clientID}`,
};

export const useGithubLogin = () => {
  const setTokenExists = useSetAtom(tokenExistsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientID,
      scopes: ["identity", "user:email"],
      redirectUri: makeRedirectUri({
        scheme: "code-streak",
      }),
    },
    discovery
  );

  function login(code: string) {
    setIsLoading(true);
    codeStreakApi
      .post("auth", { code })
      .then(({ data }) => {
        SecureStore.setItemAsync(authStorageKey, data.token);
        setTokenExists(true);
      })
      .catch((e) => console.log(e.message))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (!response) return;
    if (response.type !== "success") return; // TODO: do something when this happens

    const { code } = response.params;
    login(code);
  }, [response]);

  return { isLoading: !request || isLoading, promptAsync };
};
