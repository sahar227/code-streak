import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { TestTW } from "@/components/TestTW";
import Auth, { Logout } from "@/components/Auth";
import { useAtomValue } from "jotai";
import { userAtom } from "../state/auth";

export default function TabOneScreen() {
  const user = useAtomValue(userAtom);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <TestTW />
      {!user && <Auth />}
      {user && <Logout />}
      {user && <Text>Hello {user.name}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
