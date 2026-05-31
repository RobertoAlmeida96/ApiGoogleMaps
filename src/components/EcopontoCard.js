import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function EcopontoCard({ ecoponto, onPress }) {
  const { nome, bairro, cidade, fotoUri, categoria } = ecoponto;
  const localizacao = [bairro, cidade].filter(Boolean).join(" · ");

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.thumbWrapper}>
        {fotoUri ? (
          <Image source={{ uri: fotoUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.placeholder]}>
            <Ionicons name="leaf" size={24} color="#2e7d32" />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>
          {nome}
        </Text>
        {!!localizacao && (
          <Text style={styles.local} numberOfLines={1}>
            {localizacao}
          </Text>
        )}
        {!!categoria && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>{categoria}</Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#ccc" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  thumbWrapper: {
    marginRight: 12,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7f0",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nome: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },
  local: {
    fontSize: 12,
    color: "#999",
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeTexto: {
    fontSize: 10,
    color: "#555",
    fontWeight: "600",
  },
});
