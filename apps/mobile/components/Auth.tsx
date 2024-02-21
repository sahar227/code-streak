import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { codeStreakApi } from "@/api";
import * as SecureStore from "expo-secure-store";
import { useSetAtom } from "jotai";
import { tokenExistsAtom, userAtom } from "@/app/state/auth";

WebBrowser.maybeCompleteAuthSession();

const clientID =
  process.env.EXPO_PUBLIC_AUTH_CLIENT_ID || "CLIENT_ID IS REQUIRED";

// Endpoint
const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${clientID}`,
};

export default function Auth() {
  const setTokenExists = useSetAtom(tokenExistsAtom);
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

  useEffect(() => {
    console.log(response);

    if (!response) return;
    if (response.type !== "success") return; // TODO: do something when this happens

    const { code } = response.params;

    console.log("code-", code);
    codeStreakApi
      .post("auth", { code })
      .then(({ data }) => {
        SecureStore.setItemAsync("auth-token", data.token);
        setTokenExists(true);
      })
      .catch((e) => console.log(e.message));
  }, [response]);

  return (
    <View>
      <Text>Github Auth</Text>
      <Button disabled={!request} title="Login" onPress={() => promptAsync()} />
    </View>
  );
}

export function Logout() {
  const setTokenExists = useSetAtom(tokenExistsAtom);
  const setUser = useSetAtom(userAtom);
  function logout() {
    SecureStore.deleteItemAsync("auth-token").then(() => {
      setTokenExists(false);
      setUser(undefined);
    });
  }
  return <Button title="Logout" onPress={logout} />;
}
