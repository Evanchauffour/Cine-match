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
      <Stack.Screen 
        name="home" 
        options={{
          headerShown: true,
          header: () => <Header />
        }}
      />
      <Stack.Screen 
        name="auth" 
        options={{
          headerShown: true,
          header: () => <Header />
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: true,
          title: "Connexion",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          headerShown: true,
          title: "Inscription",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          headerShown: true,
          title: "Profil",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="editProfile" 
        options={{
          headerShown: true,
          headerTitle: "Modifier le profil",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="game" 
        options={{
          headerShown: true,
          headerTitle: "Match",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="createGroup" 
        options={{
          headerShown: true,
          headerTitle: "Créer un groupe",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
