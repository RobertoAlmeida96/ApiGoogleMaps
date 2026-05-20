// Geocodifica um endereço em coordenadas usando a API pública do Nominatim
// (OpenStreetMap). Funciona em web e nativo via fetch, sem chave de API.
// Retorna { latitude, longitude } ou null se não encontrar.
export async function geocodificarEndereco(endereco) {
  const url =
    "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: endereco,
      format: "json",
      limit: "1",
      addressdetails: "0",
      countrycodes: "br",
    }).toString();

  const resposta = await fetch(url, {
    headers: {
      "Accept-Language": "pt-BR",
      // Política do Nominatim pede identificação do app.
      "User-Agent": "EcopontosApp/1.0 (expo)",
    },
  });

  if (!resposta.ok) {
    throw new Error(`Geocoding falhou: HTTP ${resposta.status}`);
  }

  const dados = await resposta.json();
  if (!Array.isArray(dados) || dados.length === 0) {
    return null;
  }

  const lat = parseFloat(dados[0].lat);
  const lon = parseFloat(dados[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return null;
  }

  return { latitude: lat, longitude: lon };
}
