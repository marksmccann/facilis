/**
 * Determines whether a character is an ASCII digit.
 *
 * @private
 */
export default function isDigit(character: string) {
    return /\d/.test(character);
}
