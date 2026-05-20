import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#2e7d32" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Ecopontos" }} />
        <Stack.Screen name="novo" options={{ title: "Novo Ecoponto" }} />
        <Stack.Screen
          name="ecoponto/[id]"
          options={{ title: "Detalhes" }}
        />
      </Stack>
    </>
  );
}
