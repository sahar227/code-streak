import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import { useColorScheme } from "@/components/useColorScheme";
import { codeStreakApi } from "@/api";
import { useAtomValue, useSetAtom } from "jotai";
import { tokenFetchAtom, userAtom } from "./state/auth";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [authLoaded, setAuthLoaded] = useState(false);
  const setUser = useSetAtom(userAtom);
  const tokenFetched = useAtomValue(tokenFetchAtom);

  useEffect(() => {
    async function loadToken() {
      const token = await SecureStore.getItemAsync("auth-token");
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
  }, [tokenFetched]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, authLoaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
