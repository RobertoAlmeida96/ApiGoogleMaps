import * as ImagePicker from "expo-image-picker";
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

export default function NovoEcoponto() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
  const [salvando, setSalvando] = useState(false);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Permita acesso às fotos para anexar uma imagem."
      );
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

  async function salvar() {
    if (!nome.trim() || !rua.trim() || !cidade.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos nome, rua e cidade."
      );
      return;
    }

    setSalvando(true);
    try {
      const endereco = [
        [rua, numero].filter(Boolean).join(", "),
        bairro,
        cidade,
        cep,
      ]
        .filter(Boolean)
        .join(", ");

      let coordenadas = null;
      try {
        coordenadas = await geocodificarEndereco(endereco);
      } catch (err) {
        Alert.alert(
          "Erro ao localizar endereço",
          "Não foi possível consultar o serviço de mapas. Verifique sua conexão e tente novamente."
        );
        return;
      }

      if (!coordenadas) {
        Alert.alert(
          "Endereço não localizado",
          "Não conseguimos encontrar coordenadas para este endereço. Revise os campos (cidade e CEP ajudam) e tente novamente."
        );
        return;
      }

      await salvarEcoponto({
        nome: nome.trim(),
        descricao: descricao.trim(),
        rua: rua.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        cidade: cidade.trim(),
        cep: cep.trim(),
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
      >
        <Campo
          label="Nome *"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex.: Ecoponto Centro"
        />
        <Campo
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="O que é coletado, horários, etc."
          multiline
        />
        <Campo
          label="Rua *"
          value={rua}
          onChangeText={setRua}
          placeholder="Ex.: Av. Paulista"
        />
        <View style={styles.linha}>
          <View style={styles.colCurta}>
            <Campo
              label="Número"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.colLarga}>
            <Campo
              label="Bairro"
              value={bairro}
              onChangeText={setBairro}
            />
          </View>
        </View>
        <Campo label="Cidade *" value={cidade} onChangeText={setCidade} />
        <Campo
          label="CEP"
          value={cep}
          onChangeText={setCep}
          keyboardType="numeric"
          placeholder="00000-000"
        />

        <Text style={styles.label}>Foto (opcional)</Text>
        <Pressable
          style={({ pressed }) => [styles.fotoBox, pressed && styles.pressed]}
          onPress={escolherFoto}
        >
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.fotoPreview} />
          ) : (
            <Text style={styles.fotoTexto}>📷 Toque para adicionar foto</Text>
          )}
        </Pressable>
        {fotoUri && (
          <Pressable onPress={() => setFotoUri(null)}>
            <Text style={styles.removerFoto}>Remover foto</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.botaoSalvar,
            (pressed || salvando) && styles.pressed,
          ]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.botaoSalvarTexto}>
            {salvando ? "Salvando..." : "Salvar ecoponto"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ label, multiline, ...props }) {
  return (
    <View style={styles.campoWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultilinha]}
        placeholderTextColor="#999"
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: 16,
    paddingBottom: 48,
  },
  campoWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    fontSize: 15,
    color: "#222",
  },
  inputMultilinha: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  linha: {
    flexDirection: "row",
    gap: 10,
  },
  colCurta: { width: 110 },
  colLarga: { flex: 1 },
  fotoBox: {
    height: 160,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 8,
  },
  fotoPreview: {
    width: "100%",
    height: "100%",
  },
  fotoTexto: {
    color: "#666",
    fontSize: 14,
  },
  removerFoto: {
    color: "#c62828",
    fontSize: 13,
    textAlign: "right",
    marginBottom: 16,
  },
  pressed: { opacity: 0.7 },
  botaoSalvar: {
    backgroundColor: "#2e7d32",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  botaoSalvarTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
