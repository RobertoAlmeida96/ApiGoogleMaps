import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#111" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="ecopontos" options={{ headerShown: false }} />
        <Stack.Screen name="agendamentos" options={{ headerShown: false }} />
        <Stack.Screen name="recompensas" options={{ headerShown: false }} />
        <Stack.Screen name="pagamento" options={{ headerShown: false }} />
        <Stack.Screen name="conta" options={{ headerShown: false }} />
        <Stack.Screen
          name="novo"
          options={{
            title: "Reportar Ecoponto",
            headerStyle: { backgroundColor: "#fff" },
            headerTintColor: "#111",
            headerTitleStyle: { fontWeight: "700" },
            contentStyle: { backgroundColor: "#fff" },
          }}
        />
        <Stack.Screen
          name="ecoponto/[id]"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}
