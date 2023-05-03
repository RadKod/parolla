export default () => {
  /**
   * Turkish to english char converter
   * @param {string} value
   * @returns English variant of turkish characters
   */
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

  /**
   * Rating value formatter
   * @param {number} value
   * @returns e.g. 5, 4.33, 1
   */
  const formatRating = value => {
    const rating = Number(value)

    if (rating % 1 === 0) {
      return rating.toFixed(0) // remove decimal places if it's an integer
    } else {
      return rating.toFixed(1) // remove trailing zeros after the first decimal place
    }
  }

  return {
    encodeEnglish,
    formatRating
  }
}
