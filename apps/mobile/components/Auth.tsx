import { View, Text, Button, TouchableOpacity } from "react-native";
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
  return (
    <TouchableOpacity onPress={logout}>
      <Text className="pt-2 pb-2 pl-4 pr-4 text-center text-white rounded-lg bg-slate-700">
        Logout
      </Text>
    </TouchableOpacity>
  );
}
