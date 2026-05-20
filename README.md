# Ecopontos

App React Native + Expo para cadastrar e visualizar **ecopontos** (pontos de coleta seletiva) em um mapa do Google Maps. Os dados ficam salvos localmente no dispositivo (AsyncStorage).

## Funcionalidades

- Listar ecopontos cadastrados.
- Cadastrar novo ecoponto via formulário (nome, descrição, endereço completo, foto opcional). O endereço é convertido em coordenadas automaticamente via `expo-location.geocodeAsync`.
- Visualizar detalhes do ecoponto em um mapa do Google com marcador.
- Abrir a localização no app externo Google Maps.
- Excluir ecoponto.

## Stack

- Expo SDK 54, React Native 0.81
- Expo Router (navegação file-based)
- `react-native-maps` com `PROVIDER_GOOGLE`
- `@react-native-async-storage/async-storage`
- `expo-location` (geocoding) e `expo-image-picker`

## Pré-requisitos

- Node.js 18+ e npm
- Expo CLI: usado via `npx` (não precisa instalar global)
- Para Android: Android Studio + um emulador OU app Expo Go no celular
- Para iOS: Xcode + simulador (macOS) OU Expo Go no celular

## Instalação

```bash
cd C:\Projetos\ApiGoogleMaps
npm install
```

## Configurar a chave do Google Maps (obrigatório no Android)

Sem chave, o mapa fica em branco/cinza no Android.

1. Acesse https://console.cloud.google.com/
2. Crie um projeto (ou selecione um existente).
3. Vá em **APIs & Services → Library** e habilite:
   - **Maps SDK for Android**
   - **Maps SDK for iOS** (se for usar iOS)
4. Vá em **APIs & Services → Credentials → Create credentials → API key**.
5. Copie a chave gerada.
6. Abra `app.json` e substitua `COLOQUE_SUA_CHAVE_AQUI` (em dois lugares: `ios.config.googleMapsApiKey` e `android.config.googleMaps.apiKey`) pela sua chave.

> Em produção, restrinja a chave por nome de pacote/bundle id.

## Rodando o app

```bash
npx expo start
```

Depois pressione:
- `a` para abrir no emulador Android
- `i` para abrir no simulador iOS (macOS)
- Escaneie o QR code com o **Expo Go** no celular

### Atenção: Expo Go vs Development Build

Em alguns casos `react-native-maps` com `PROVIDER_GOOGLE` exige um **development build** (não funciona 100% no Expo Go padrão, especialmente no Android). Se o mapa não carregar:

```bash
npx expo run:android
```

Isso compila um build nativo com a chave do Google Maps embutida.

## Estrutura

```
app/
  _layout.js            Stack raiz do Expo Router
  index.js              Lista de ecopontos + botão flutuante "+"
  novo.js               Formulário de cadastro
  ecoponto/[id].js      Detalhes com MapView e marcador
src/
  storage/ecopontos.js  CRUD em AsyncStorage
  components/EcopontoCard.js
```

## Como usar

1. Toque no botão **+** na tela inicial.
2. Preencha os campos. Os obrigatórios são **nome**, **rua** e **cidade** (CEP e bairro ajudam o geocoding a achar a localização correta).
3. (Opcional) Anexe uma foto da galeria.
4. Toque em **Salvar ecoponto**. O endereço é convertido em coordenadas e o ecoponto aparece na lista.
5. Toque no card para ver o mapa e os detalhes; use **Abrir no Google Maps** para navegar até o local.

## Solução de problemas

- **Mapa em branco no Android:** chave do Google Maps não configurada ou Maps SDK for Android não habilitado no Cloud Console.
- **"Endereço não localizado" ao salvar:** o geocoding não encontrou coordenadas. Tente um endereço mais completo (com cidade e CEP) ou um nome de ponto público conhecido.
- **Erro de native module no Expo Go:** rode com `npx expo run:android` (development build).
