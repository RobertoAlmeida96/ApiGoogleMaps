import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../src/components/BottomNav";

export default function Conta() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conta</Text>
      </View>
      <View style={styles.centro}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#ccc" />
        </View>
        <Text style={styles.titulo}>Usuário</Text>
        <Text style={styles.sub}>
          Gerencie seu perfil, configurações e preferências.
        </Text>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#111" },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: { fontSize: 18, fontWeight: "600", color: "#111" },
  sub: { fontSize: 14, color: "#888", textAlign: "center", lineHeight: 20 },
});
