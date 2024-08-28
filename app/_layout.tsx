import Header from "@/components/Header";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";

export default function RootLayout() {

  useFonts({
    "Poppins": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-med": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-extraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
  });

  return (
    <Stack 
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: true,
          header: () => <Header />
        }}
      />
    </Stack>
  );
}
