import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function EcopontoCard({ ecoponto, onPress }) {
  const { nome, bairro, cidade, fotoUri } = ecoponto;
  const localizacao = [bairro, cidade].filter(Boolean).join(" - ");

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
            <Text style={styles.placeholderText}>♻️</Text>
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
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  thumbWrapper: {
    marginRight: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#e8f5e9",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1b5e20",
  },
  local: {
    marginTop: 2,
    fontSize: 13,
    color: "#555",
  },
  chevron: {
    fontSize: 28,
    color: "#999",
    marginLeft: 8,
  },
});
