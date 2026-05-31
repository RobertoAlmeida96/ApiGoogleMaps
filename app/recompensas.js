import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../src/components/BottomNav";

export default function Recompensas() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recompensas</Text>
      </View>
      <View style={styles.centro}>
        <Ionicons name="gift-outline" size={64} color="#ccc" />
        <Text style={styles.titulo}>Em breve</Text>
        <Text style={styles.sub}>
          Aqui você verá seus pontos e recompensas por reportar ecopontos.
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
  titulo: { fontSize: 18, fontWeight: "600", color: "#111" },
  sub: { fontSize: 14, color: "#888", textAlign: "center", lineHeight: 20 },
});
