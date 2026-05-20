import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapaEcoponto from "../../src/components/MapaEcoponto";
import { obterEcoponto, removerEcoponto } from "../../src/storage/ecopontos";

export default function DetalhesEcoponto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [ecoponto, setEcoponto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    (async () => {
      const dados = await obterEcoponto(String(id));
      if (ativo) {
        setEcoponto(dados);
        setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [id]);

  function abrirNoGoogleMaps() {
    if (!ecoponto) return;
    const { latitude, longitude, nome } = ecoponto;
    const rotulo = encodeURIComponent(nome || "Ecoponto");
    const url = Platform.select({
      ios: `maps://?q=${rotulo}&ll=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${rotulo})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      );
    });
  }

  function confirmarExcluir() {
    Alert.alert(
      "Excluir ecoponto",
      `Deseja remover "${ecoponto.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await removerEcoponto(ecoponto.id);
            router.back();
          },
        },
      ]
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!ecoponto) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>Ecoponto não encontrado.</Text>
      </View>
    );
  }

  const enderecoCompleto = [
    [ecoponto.rua, ecoponto.numero].filter(Boolean).join(", "),
    ecoponto.bairro,
    ecoponto.cidade,
    ecoponto.cep,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapaEcoponto
        latitude={ecoponto.latitude}
        longitude={ecoponto.longitude}
        titulo={ecoponto.nome}
        descricao={enderecoCompleto}
      />

      {ecoponto.fotoUri ? (
        <Image source={{ uri: ecoponto.fotoUri }} style={styles.foto} />
      ) : null}

      <View style={styles.bloco}>
        <Text style={styles.nome}>{ecoponto.nome}</Text>
        {!!ecoponto.descricao && (
          <Text style={styles.descricao}>{ecoponto.descricao}</Text>
        )}
        {!!enderecoCompleto && (
          <View style={styles.linhaInfo}>
            <Text style={styles.infoLabel}>Endereço</Text>
            <Text style={styles.infoValor}>{enderecoCompleto}</Text>
          </View>
        )}
        <View style={styles.linhaInfo}>
          <Text style={styles.infoLabel}>Coordenadas</Text>
          <Text style={styles.infoValor}>
            {ecoponto.latitude.toFixed(5)}, {ecoponto.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.botao, pressed && styles.pressed]}
        onPress={abrirNoGoogleMaps}
      >
        <Text style={styles.botaoTexto}>Abrir no Google Maps</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          styles.botaoExcluir,
          pressed && styles.pressed,
        ]}
        onPress={confirmarExcluir}
      >
        <Text style={[styles.botaoTexto, styles.botaoExcluirTexto]}>
          Excluir ecoponto
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  erro: {
    color: "#c62828",
    fontSize: 15,
  },
  foto: {
    width: "92%",
    height: 200,
    alignSelf: "center",
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  bloco: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  nome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
    lineHeight: 20,
  },
  linhaInfo: {
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#777",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValor: {
    fontSize: 15,
    color: "#222",
    marginTop: 2,
  },
  botao: {
    backgroundColor: "#2e7d32",
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoExcluir: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c62828",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  botaoExcluirTexto: {
    color: "#c62828",
  },
  pressed: { opacity: 0.7 },
});
