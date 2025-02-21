import { useContext } from '@nuxtjs/composition-api'

export default () => {
  const context = useContext()

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

  /**
   * Formats a number into a string representation with appropriate suffixes.
   * @param {number} value - The number to format.
   * @returns {string} The formatted number with 'B' for thousands, 'M' for millions, or the number itself if less than 1000.
   */
  const formatMillions = value => {
    const decimal = Number(value)

    if (decimal >= 1000000) {
      return (decimal / 1000000).toFixed(0) + 'M' // For millions
    } else if (decimal >= 1000) {
      return (decimal / 1000).toFixed(0) + (context.i18n.locale === 'tr' ? 'B' : 'K') // For thousands
    } else {
      return decimal.toFixed(0) // For values less than 1000
    }
  }

  return {
    encodeEnglish,
    formatRating,
    formatMillions
  }
}
