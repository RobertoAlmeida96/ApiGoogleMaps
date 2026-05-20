import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import EcopontoCard from "../src/components/EcopontoCard";
import { listarEcopontos } from "../src/storage/ecopontos";

export default function ListaEcopontos() {
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

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {ecopontos.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.vazioTitulo}>Nenhum ecoponto cadastrado</Text>
          <Text style={styles.vazioTexto}>
            Toque no botão + para adicionar o primeiro.
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.lista}
          data={ecopontos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EcopontoCard
              ecoponto={item}
              onPress={() => router.push(`/ecoponto/${item.id}`)}
            />
          )}
        />
      )}

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push("/novo")}
        accessibilityLabel="Adicionar ecoponto"
      >
        <Text style={styles.fabIcone}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  vazioTitulo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b5e20",
    marginBottom: 6,
  },
  vazioTexto: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
  lista: {
    padding: 16,
    paddingBottom: 96,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  fabIcone: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "300",
  },
});
