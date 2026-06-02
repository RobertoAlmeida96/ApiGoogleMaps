import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomNav from "../src/components/BottomNav";

export default function Home() {
  const router = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const nome = await AsyncStorage.getItem("@usuario_nome");
        setNomeUsuario(nome && nome.trim() ? nome.trim() : "Usuário");
      })();
    }, [])
  );

  const iniciais = nomeUsuario
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="leaf" size={22} color="#2e7d32" />
          <Text style={styles.headerGreeting}>Olá, {nomeUsuario}!</Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push("/conta")}>
          <Text style={styles.avatarText}>{iniciais}</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <View style={styles.container}>
          <View style={styles.topo}>
            <Text style={styles.subtitulo}>O que deseja fazer hoje?</Text>
          </View>
          <View style={styles.acoes}>
            <Pressable
              style={({ pressed }) => [styles.botao, pressed && styles.botaoPressed]}
              onPress={() => router.push("/novo")}
            >
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <Text style={styles.botaoTexto}>Cadastrar Ecoponto</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.botao, styles.botaoSecundario, pressed && styles.botaoPressed]}
              onPress={() => router.push("/agendamentos")}
            >
              <Ionicons name="calendar-outline" size={24} color="#111" />
              <Text style={[styles.botaoTexto, styles.botaoTextoSecundario]}>Fazer Agendamento</Text>
            </Pressable>
          </View>
        </View>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#111" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  body: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center", gap: 48 },
  topo: { alignItems: "center" },
  subtitulo: { fontSize: 15, color: "#888", textAlign: "center" },
  acoes: { gap: 14 },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 18,
    elevation: 3,
  },
  botaoSecundario: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    elevation: 0,
  },
  botaoPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  botaoTexto: { fontSize: 16, fontWeight: "700", color: "#fff" },
  botaoTextoSecundario: { color: "#111" },
});
