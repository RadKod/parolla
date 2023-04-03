export default () => {
  const encodeEnglish = value => {
    return value
      .replace(/ /g, '-')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 's')
      .replace(/İ/g, 'i')
      .replace(/I/g, 'i')
      .replace(/Ç/g, 'c')
      .replace(/Ğ/g, 'g')
      .replace(/Ö/g, 'o')
      .replace(/Ü/g, 'u')
      .replace(/-{2,}/g, '-')
  }

  return {
    encodeEnglish
  }
}
