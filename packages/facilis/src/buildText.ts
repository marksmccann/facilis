/**
 * The context available while building text from a sequence of items.
 *
 * @since 0.0.1
 */
export type BuildTextContext = {
    /**
     * The current item position in the source sequence.
     */
    index: number;
    /**
     * The text that has already been built.
     */
    builtText: string;
};

/**
 * The callback that maps one item to the text it should contribute.
 *
 * @since 0.0.1
 */
export type BuildTextCallback<Item> = (
    item: Item,
    context: BuildTextContext
) => string;

/**
 * Builds one text value by concatenating the text returned for each item.
 *
 * @since 0.0.1
 */
export function buildText<Item>(
    items: readonly Item[],
    build: BuildTextCallback<Item>
) {
    let builtText = '';

    for (let index = 0; index < items.length; index += 1) {
        builtText += build(items[index], {
            index,
            builtText,
        });
    }

    return builtText;
}
