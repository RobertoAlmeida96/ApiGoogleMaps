import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

export default function MapaEcoponto({ latitude, longitude, titulo }) {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  return (
    <View style={styles.wrap}>
      <Text style={styles.titulo}>🗺️ {titulo}</Text>
      <Text style={styles.coords}>
        {latitude.toFixed(5)}, {longitude.toFixed(5)}
      </Text>
      <Text style={styles.aviso}>
        O mapa interativo não está disponível no navegador. Use o app no celular
        ou abra a localização no Google Maps.
      </Text>
      <Pressable style={styles.botao} onPress={() => Linking.openURL(url)}>
        <Text style={styles.botaoTexto}>Abrir no Google Maps</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 280,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b5e20",
    marginBottom: 6,
  },
  coords: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  aviso: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 16,
  },
  botao: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "700",
  },
});
