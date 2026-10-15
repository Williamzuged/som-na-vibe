
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { artist, genre } = req.query;
  const key = process.env.YOUTUBE_API_KEY;

  if (!key) {
    return res.status(500).json({
      error: "A chave da API não está configurada no Vercel."
    });
  }

  if (!artist || !genre) {
    return res.status(400).json({
      error: "Informe o artista e o gênero."
    });
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: `${artist} ${genre} música oficial`,
      type: "video",
      videoEmbeddable: "true",
      videoSyndicated: "true",
      maxResults: "10",
      regionCode: "BR",
      relevanceLanguage: "pt",
      safeSearch: "strict",
      key
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "Não foi possível pesquisar no YouTube."
      });
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      error: "Erro ao pesquisar músicas."
    });
  }
}
