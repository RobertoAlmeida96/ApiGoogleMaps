import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
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
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  if (!ecoponto) {
    return (
      <View style={styles.centro}>
        <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
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
    .join(" · ");

  return (
    <SafeAreaView style={styles.safe}>
      {/* Botão voltar flutuante */}
      <Pressable
        style={({ pressed }) => [styles.voltarBtn, pressed && styles.pressed]}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={22} color="#111" />
      </Pressable>

      {/* Mapa ocupa toda a área superior */}
      <View style={styles.mapaWrap}>
        <MapaEcoponto
          latitude={ecoponto.latitude}
          longitude={ecoponto.longitude}
          titulo={ecoponto.nome}
          descricao={enderecoCompleto}
        />
      </View>

      {/* Bottom sheet */}
      <View style={styles.sheet}>
        {/* Foto se disponível */}
        {ecoponto.fotoUri ? (
          <Image source={{ uri: ecoponto.fotoUri }} style={styles.foto} />
        ) : null}

        {/* Info + badge de categoria */}
        <View style={styles.infoRow}>
          <View style={styles.infoTexto}>
            <Text style={styles.nome} numberOfLines={2}>
              {ecoponto.nome}
            </Text>
            {!!enderecoCompleto && (
              <Text style={styles.endereco} numberOfLines={1}>
                {enderecoCompleto}
              </Text>
            )}
          </View>
          {ecoponto.categoria ? (
            <View style={styles.badge}>
              <Text style={styles.badgeTexto}>{ecoponto.categoria}</Text>
            </View>
          ) : null}
        </View>

        {/* Termos */}
        <Text style={styles.termos}>
          Ao confirmar, você concorda com os{" "}
          <Text style={styles.termosLink}>Termos de Serviço</Text>
          {" "}e{" "}
          <Text style={styles.termosLink}>Política de Privacidade</Text>.
        </Text>

        {/* Botões Cancel / Confirm */}
        <View style={styles.botoes}>
          <Pressable
            style={({ pressed }) => [styles.botaoCancelar, pressed && styles.pressed]}
            onPress={confirmarExcluir}
          >
            <Text style={styles.botaoCancelarTexto}>Excluir</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.botaoConfirmar, pressed && styles.pressed]}
            onPress={abrirNoGoogleMaps}
          >
            <Text style={styles.botaoConfirmarTexto}>Confirmar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  erro: {
    fontSize: 15,
    color: "#888",
  },
  voltarBtn: {
    position: "absolute",
    top: 52,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  mapaWrap: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  foto: {
    width: "100%",
    height: 130,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  infoTexto: {
    flex: 1,
  },
  nome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 3,
  },
  endereco: {
    fontSize: 13,
    color: "#888",
  },
  badge: {
    marginLeft: 12,
    backgroundColor: "#111",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  badgeTexto: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  termos: {
    fontSize: 12,
    color: "#999",
    lineHeight: 18,
    marginBottom: 16,
  },
  termosLink: {
    textDecorationLine: "underline",
    color: "#666",
  },
  botoes: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 4,
  },
  botaoCancelar: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoCancelarTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  botaoConfirmar: {
    flex: 1,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoConfirmarTexto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
