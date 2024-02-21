import { Text, View } from "react-native";
import Auth, { Logout } from "@/components/Auth";
import { useAtomValue } from "jotai";
import { userAtom } from "../../state/auth";

export default function TabOneScreen() {
  const user = useAtomValue(userAtom);
  return (
    <View>
      <Text>Tab One</Text>
      <View />
      {!user && <Auth />}
      {user && <Logout />}
      {user && <Text>Hello {user.name}</Text>}
    </View>
  );
}
