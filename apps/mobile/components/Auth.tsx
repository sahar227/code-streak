import { View, Text, Button } from "react-native";
import React from "react";
import * as WebBrowser from "expo-web-browser";
import { useGithubLogin, useLogout } from "@/utils/hooks/auth";

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const { isLoading, promptAsync } = useGithubLogin();

  return (
    <View>
      <Text>Github Auth</Text>
      <Button
        disabled={isLoading}
        title={isLoading ? "Loading..." : "Login"}
        onPress={() => promptAsync()}
      />
    </View>
  );
}

export function Logout() {
  const logout = useLogout();
  return <Button title="Logout" onPress={logout} />;
}
