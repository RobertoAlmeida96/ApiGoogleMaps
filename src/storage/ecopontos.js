import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE = "@ecopontos";

async function carregarLista() {
  const bruto = await AsyncStorage.getItem(CHAVE);
  if (!bruto) return [];
  try {
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

async function persistirLista(lista) {
  await AsyncStorage.setItem(CHAVE, JSON.stringify(lista));
}

export async function listarEcopontos() {
  const lista = await carregarLista();
  return lista.sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
}

export async function obterEcoponto(id) {
  const lista = await carregarLista();
  return lista.find((e) => e.id === id) || null;
}

export async function salvarEcoponto(ecoponto) {
  const lista = await carregarLista();
  if (ecoponto.id) {
    const idx = lista.findIndex((e) => e.id === ecoponto.id);
    if (idx >= 0) {
      lista[idx] = { ...lista[idx], ...ecoponto };
    } else {
      lista.push(ecoponto);
    }
  } else {
    ecoponto.id = Date.now().toString();
    ecoponto.criadoEm = ecoponto.criadoEm || new Date().toISOString();
    lista.push(ecoponto);
  }
  await persistirLista(lista);
  return ecoponto;
}

export async function removerEcoponto(id) {
  const lista = await carregarLista();
  const nova = lista.filter((e) => e.id !== id);
  await persistirLista(nova);
}
