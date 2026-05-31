import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { geocodificarEndereco } from "../src/services/geocode";
import { salvarEcoponto } from "../src/storage/ecopontos";

const CATEGORIAS = ["Eletrônicos", "Recicláveis", "Entulho"];

export default function NovoEcoponto() {
  const router = useRouter();
  const [categoria, setCategoria] = useState(null);
  const [fotoUri, setFotoUri] = useState(null);
  const [localizacao, setLocalizacao] = useState("");
  const [detectando, setDetectando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Permita acesso às fotos para anexar uma imagem.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setFotoUri(resultado.assets[0].uri);
    }
  }

  async function detectarLocalizacao() {
    setDetectando(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita o acesso à localização nas configurações.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [addr] = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      if (addr) {
        const partes = [addr.street, addr.district, addr.city].filter(Boolean);
        setLocalizacao(partes.join(", "));
      }
    } catch {
      Alert.alert("Erro", "Não foi possível detectar a localização.");
    } finally {
      setDetectando(false);
    }
  }

  async function enviar() {
    if (!localizacao.trim()) {
      Alert.alert("Localização necessária", "Digite ou detecte sua localização.");
      return;
    }

    setSalvando(true);
    try {
      let coordenadas = null;
      try {
        coordenadas = await geocodificarEndereco(localizacao);
      } catch {
        Alert.alert(
          "Erro ao localizar",
          "Não foi possível consultar o serviço de mapas. Verifique sua conexão."
        );
        return;
      }

      if (!coordenadas) {
        Alert.alert(
          "Endereço não encontrado",
          "Tente ser mais específico. Inclua cidade ou CEP."
        );
        return;
      }

      await salvarEcoponto({
        nome: localizacao.trim(),
        descricao: categoria ? `Categoria: ${categoria}` : "",
        categoria: categoria || "Recicláveis",
        rua: localizacao.trim(),
        numero: "",
        bairro: "",
        cidade: "",
        cep: "",
        fotoUri,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      });

      router.back();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Categorias */}
        <Text style={styles.sectionLabel}>Selecionar Categoria:</Text>
        <View style={styles.chips}>
          {CATEGORIAS.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.chip, categoria === cat && styles.chipAtivo]}
              onPress={() => setCategoria(cat === categoria ? null : cat)}
            >
              <Text style={[styles.chipTexto, categoria === cat && styles.chipTextoAtivo]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Área de upload */}
        <Pressable
          style={({ pressed }) => [styles.uploadArea, pressed && styles.uploadPressed]}
          onPress={escolherFoto}
        >
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
          ) : (
            <Text style={styles.fotoTexto}>Toque para adicionar foto</Text>
          )}
        </Pressable>

        {fotoUri && (
          <Pressable onPress={() => setFotoUri(null)} style={styles.removerWrap}>
            <Text style={styles.removerFoto}>Remover foto</Text>
          </Pressable>
        )}

        {/* Campo de localização */}
        <View style={styles.inputWrap}>
          <Ionicons name="location-outline" size={18} color="#aaa" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua localização..."
            placeholderTextColor="#aaa"
            value={localizacao}
            onChangeText={setLocalizacao}
          />
        </View>

        <Pressable
          onPress={detectarLocalizacao}
          disabled={detectando}
          style={styles.detectarWrap}
        >
          <Ionicons
            name="navigate-outline"
            size={14}
            color={detectando ? "#aaa" : "#2e7d32"}
          />
          <Text style={[styles.detectar, detectando && styles.detectarDisabled]}>
            {detectando ? "Detectando..." : "Detectar Localização"}
          </Text>
        </Pressable>

        {/* Botão Enviar */}
        <Pressable
          style={({ pressed }) => [
            styles.botaoEnviar,
            (pressed || salvando) && styles.botaoPressed,
          ]}
          onPress={enviar}
          disabled={salvando}
        >
          <Text style={styles.botaoEnviarTexto}>
            {salvando ? "Enviando..." : "Enviar"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipAtivo: {
    borderColor: "#111",
    backgroundColor: "#111",
  },
  chipTexto: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
  },
  chipTextoAtivo: {
    color: "#fff",
  },
  uploadArea: {
    borderWidth: 1.5,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 14,
    minHeight: 210,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  uploadPressed: {
    opacity: 0.85,
  },
  uploadConteudo: {
    alignItems: "center",
    gap: 10,
    padding: 24,
  },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadTexto: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  uploadOu: {
    fontSize: 13,
    color: "#aaa",
  },
  uploadBrowse: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    textDecorationLine: "underline",
  },
  fotoPreview: {
    width: "100%",
    height: 210,
  },
  removerWrap: {
    alignItems: "flex-end",
    marginBottom: 16,
    marginTop: 4,
  },
  removerFoto: {
    color: "#c62828",
    fontSize: 13,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    backgroundColor: "#fafafa",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111",
  },
  detectarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
    marginBottom: 28,
  },
  detectar: {
    fontSize: 13,
    color: "#2e7d32",
    fontWeight: "600",
  },
  detectarDisabled: {
    color: "#aaa",
  },
  botaoEnviar: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  botaoPressed: {
    opacity: 0.75,
  },
  botaoEnviarTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
