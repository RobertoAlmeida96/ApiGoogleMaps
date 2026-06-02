import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BottomNav from "../src/components/BottomNav";
import EcopontoCard from "../src/components/EcopontoCard";
import { listarEcopontos } from "../src/storage/ecopontos";

export default function Ecopontos() {
  const router = useRouter();
  const [ecopontos, setEcopontos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        setCarregando(true);
        const dados = await listarEcopontos();
        if (ativo) {
          setEcopontos(dados);
          setCarregando(false);
        }
      })();
      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Ecopontos</Text>
          <Text style={styles.headerSub}>
            {carregando
              ? "Carregando..."
              : `${ecopontos.length} ${ecopontos.length === 1 ? "ponto cadastrado" : "pontos cadastrados"}`}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
          onPress={() => router.push("/novo")}
          accessibilityLabel="Reportar ecoponto"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      {carregando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : ecopontos.length === 0 ? (
        <View style={styles.centro}>
          <Ionicons name="leaf-outline" size={56} color="#ccc" />
          <Text style={styles.vazioTitulo}>Nenhum ecoponto cadastrado</Text>
          <Text style={styles.vazioTexto}>
            Toque em + para reportar o primeiro ponto de coleta.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.lista}
          data={ecopontos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EcopontoCard
              ecoponto={item}
              onPress={() => router.push(`/ecoponto/${item.id}`)}
            />
          )}
        />
      )}

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },
  headerSub: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  vazioTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
  },
  vazioTexto: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  lista: {
    padding: 16,
    paddingBottom: 12,
  },
});
