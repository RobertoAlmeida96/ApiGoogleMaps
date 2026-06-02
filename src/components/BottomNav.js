import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TABS = [
  { href: "/", label: "Início", icon: "home-outline", iconActive: "home" },
  { href: "/ecopontos", label: "Ecopontos", icon: "leaf-outline", iconActive: "leaf" },
  { href: "/agendamentos", label: "Agendamentos", icon: "calendar-outline", iconActive: "calendar" },
  { href: "/conta", label: "Conta", icon: "person-outline", iconActive: "person" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Pressable
            key={tab.href}
            style={styles.tab}
            onPress={() => router.push(tab.href)}
          >
            <Ionicons
              name={active ? tab.iconActive : tab.icon}
              size={22}
              color={active ? "#111" : "#aaa"}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: "#aaa",
    fontWeight: "500",
  },
  labelActive: {
    color: "#111",
    fontWeight: "700",
  },
});
