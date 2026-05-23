import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "NGO OR humanitarian OR disaster relief OR charity";
  
  const newsApiKey = process.env.NEWS_API_KEY;
  const mediaStackApiKey = process.env.MEDIASTACK_API_KEY;

  try {
    let combinedArticles: any[] = [];

    // Fetch from NewsAPI
    if (newsApiKey) {
      try {
        const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${newsApiKey}`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          if (newsData.articles) {
            combinedArticles = [...combinedArticles, ...newsData.articles.map((a: any) => ({
              title: a.title,
              url: a.url,
              source: { name: a.source.name },
              publishedAt: a.publishedAt
            }))];
          }
        }
      } catch (e) {
        console.warn("NewsAPI Fetch Failed", e);
      }
    }

    // Fetch from MediaStack
    if (mediaStackApiKey) {
      try {
        const mediaRes = await fetch(`http://api.mediastack.com/v1/news?access_key=${mediaStackApiKey}&keywords=${encodeURIComponent(query)}&languages=en&limit=6`);
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          if (mediaData.data) {
            combinedArticles = [...combinedArticles, ...mediaData.data.map((a: any) => ({
              title: a.title,
              url: a.url,
              source: { name: a.source || "MediaStack" },
              publishedAt: a.published_at
            }))];
          }
        }
      } catch (e) {
        console.warn("MediaStack Fetch Failed", e);
      }
    }

    // Sort combined articles by date
    combinedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    return NextResponse.json({ articles: combinedArticles });
  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ articles: [] });
  }
}
