/**
 * The context available while deciding whether a character should be kept.
 *
 * @since 0.0.1
 */
export type FilterCharactersContext = {
    /**
     * The current character position in the source value.
     */
    index: number;
    /**
     * The number of characters that have already been kept.
     */
    keptCount: number;
};

/**
 * The command returned for one character during filtering.
 *
 * @since 0.0.1
 */
export type FilterCharactersCommand = 'keep' | 'discard' | 'stop';

/**
 * The predicate that determines how one character should be handled.
 *
 * @since 0.0.1
 */
export type FilterCharactersPredicate = (
    character: string,
    context: FilterCharactersContext
) => FilterCharactersCommand;

/**
 * Produces a new string containing only the characters preserved by the
 * provided predicate.
 *
 * @since 0.0.1
 */
export function filterCharacters(
    value: string,
    predicate: FilterCharactersPredicate
) {
    let filteredValue = '';
    let keptCount = 0;

    for (let index = 0; index < value.length; index += 1) {
        const character = value[index];
        const command = predicate(character, { index, keptCount });

        if (command === 'stop') {
            break;
        }

        if (command === 'discard') {
            continue;
        }

        filteredValue += character;
        keptCount += 1;
    }

    return filteredValue;
}
