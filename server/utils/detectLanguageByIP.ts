export async function detectLanguageByIP(ip: string): Promise<string> {
  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json`).then(res => res.json())
    const country = geo.country_name

    const countryToLang: Record<string, string> = {
      Nigeria: 'ha',
      France: 'fr',
      China: 'zh',
      Germany: 'de',
      Brazil: 'pt',
      India: 'hi',
      United States: 'en'
    }

    return countryToLang[country] || 'en'
  } catch (err) {
    return 'en'
  }
}
