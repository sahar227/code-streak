import { Text, View } from "react-native";
import Auth, { Logout } from "@/components/Auth";
import { useAtomValue } from "jotai";
import { userAtom } from "../../state/auth";

export default function TabOneScreen() {
  const user = useAtomValue(userAtom);
  if (!user) return <Auth />;
  return (
    <View className="flex-col items-center justify-center w-full">
      <Text className="text-2xl font-bold text-center">
        Welcome to Code-Streak
      </Text>
      <View className="flex-row items-center justify-center w-full m-2">
        <Text>Hello {user.name}</Text>
        <View className="w-4" />
        <Logout />
      </View>
      <View className="items-center justify-center w-full pt-2 pb-2 m-10 bg-sky-700">
        <Text className="text-3xl text-white">Code Streak:</Text>
        <View className="w-full pt-4 pb-4 m-1 bg-sky-200">
          <Text className="text-6xl font-bold text-center text-sky-700">
            60 Days!
          </Text>
        </View>
        <Text className="text-xl text-white">Keep it up!</Text>
      </View>
    </View>
  );
}
