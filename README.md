# Ecopontos

App React Native + Expo para cadastrar e visualizar **ecopontos** (pontos de coleta seletiva) em um mapa do Google Maps. Os dados ficam salvos localmente no dispositivo via AsyncStorage.

## Funcionalidades

- Listar ecopontos cadastrados, ordenados do mais recente.
- Cadastrar novo ecoponto via formulário (nome, descrição, endereço completo, foto opcional). O endereço é convertido em coordenadas automaticamente via API do OpenStreetMap (Nominatim) — sem necessidade de chave de API para o geocoding.
- Visualizar detalhes do ecoponto em um mapa interativo com marcador.
- Abrir a localização no app externo Google Maps (deep link nativo no iOS/Android, URL web como fallback).
- Excluir ecoponto com confirmação.

## Stack

- Expo SDK 54, React Native 0.81
- Expo Router (navegação file-based)
- `react-native-maps` com `PROVIDER_GOOGLE`
- `@react-native-async-storage/async-storage`
- Nominatim / OpenStreetMap (geocoding, sem chave de API)
- `expo-image-picker`

---

## Estrutura do projeto

```
app/
  _layout.js              Configuração global de navegação (Stack + cabeçalho)
  index.js                Lista de ecopontos + botão flutuante "+"
  novo.js                 Formulário de cadastro
  ecoponto/[id].js        Detalhes com mapa, foto e opções

src/
  components/
    EcopontoCard.js       Card clicável exibido na lista
    MapaEcoponto.js       Mapa interativo (mobile — react-native-maps)
    MapaEcoponto.web.js   Fallback para web (exibe coordenadas + link)
  storage/
    ecopontos.js          CRUD completo em AsyncStorage
  services/
    geocode.js            Converte endereço em coordenadas (Nominatim)
```

---

## Explicação de cada parte

### `app/_layout.js`
Configuração global de navegação. Define o cabeçalho verde (`#2e7d32`) para todas as telas e registra as três rotas: lista, novo ecoponto e detalhes.

### `app/index.js`
Tela principal. Lista todos os ecopontos salvos usando um `FlatList`. Usa `useFocusEffect` para recarregar os dados toda vez que o usuário volta para essa tela. Exibe estado vazio quando não há nada cadastrado, e um botão flutuante `+` no canto inferior direito.

### `app/novo.js`
Formulário de cadastro. Coleta nome, descrição, endereço completo (rua, número, bairro, cidade, CEP) e foto opcional. Ao salvar, monta o endereço em uma string e chama o serviço de geocodificação para obter latitude/longitude antes de persistir o dado.

### `app/ecoponto/[id].js`
Tela de detalhes. Recebe o `id` pela URL, busca o ecoponto no storage e exibe: mapa com marcador, foto, endereço formatado e coordenadas. Tem botão para abrir no Google Maps e botão de exclusão com confirmação via `Alert`.

### `src/components/EcopontoCard.js`
Card clicável usado na lista. Mostra miniatura da foto (ou ícone ♻️ como placeholder), nome e localização (bairro/cidade).

### `src/components/MapaEcoponto.js`
Versão **mobile** do mapa. Usa `react-native-maps` com o provider do Google Maps para exibir um mapa interativo com marcador na coordenada do ecoponto.

### `src/components/MapaEcoponto.web.js`
Versão **web** do mesmo componente. O Expo resolve automaticamente qual usar pelo sufixo `.web.js`. Como `react-native-maps` não funciona no browser, exibe as coordenadas em texto e um botão para abrir no Google Maps.

### `src/storage/ecopontos.js`
Camada de persistência local usando AsyncStorage (armazenamento chave-valor no dispositivo). Funções exportadas:

| Função | O que faz |
|---|---|
| `listarEcopontos()` | Retorna todos os ecopontos ordenados do mais recente |
| `obterEcoponto(id)` | Busca um ecoponto pelo ID |
| `salvarEcoponto(dados)` | Cria (gera ID por timestamp) ou atualiza se já tiver ID |
| `removerEcoponto(id)` | Exclui pelo ID |

### `src/services/geocode.js`
Converte endereço em coordenadas usando a **API Nominatim do OpenStreetMap** — gratuita e sem chave de API. Faz uma busca restrita ao Brasil (`countrycodes: br`) e retorna `{ latitude, longitude }` ou `null` se não encontrar.

---

## Fluxo completo

1. Usuário abre o app → vê a lista de ecopontos
2. Toca em `+` → preenche o formulário → app chama o Nominatim para geocodificar o endereço → salva no AsyncStorage
3. Toca em um card → vê o mapa com marcador, foto e detalhes → pode abrir no Google Maps ou excluir

---

## Pré-requisitos

- Node.js 18+ e npm
- Expo CLI: usado via `npx` (não precisa instalar global)
- Para Android: Android Studio + emulador **ou** app Expo Go no celular
- Para iOS: Xcode + simulador (macOS) **ou** Expo Go no celular

## Instalação

```bash
cd C:\Projetos\ApiGoogleMaps
npm install
```

## Configurar a chave do Google Maps (obrigatório no Android)

Sem chave, o mapa fica em branco/cinza no Android.

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione um existente
3. Em **APIs & Services → Library**, habilite:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** (se for usar iOS)
4. Em **APIs & Services → Credentials → Create credentials → API key**, copie a chave gerada
5. Abra `app.json` e substitua a chave em `ios.config.googleMapsApiKey` e `android.config.googleMaps.apiKey`

> Em produção, restrinja a chave por nome de pacote / bundle ID.

## Rodando o app

```bash
npx expo start
```

Depois pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS (macOS)
- Escaneie o QR code com o **Expo Go** no celular

### Expo Go vs Development Build

`react-native-maps` com `PROVIDER_GOOGLE` pode não funcionar 100% no Expo Go padrão no Android. Se o mapa não carregar, compile um build nativo:

```bash
npx expo run:android
```

---

## Como usar

1. Toque no botão **+** na tela inicial
2. Preencha os campos. Obrigatórios: **nome**, **rua** e **cidade** (CEP e bairro ajudam o geocoding a encontrar a localização correta)
3. (Opcional) Anexe uma foto da galeria
4. Toque em **Salvar ecoponto**. O endereço é convertido em coordenadas e o ecoponto aparece na lista
5. Toque no card para ver o mapa e os detalhes; use **Abrir no Google Maps** para navegar até o local

## Solução de problemas

- **Mapa em branco no Android:** chave do Google Maps não configurada ou Maps SDK for Android não habilitado no Cloud Console.
- **"Endereço não localizado" ao salvar:** o geocoding não encontrou coordenadas. Tente um endereço mais completo (com cidade e CEP) ou um nome de ponto público conhecido.
- **Erro de native module no Expo Go:** rode com `npx expo run:android` (development build).
