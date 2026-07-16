import type { FormatDefinition } from './format';
import type { TextState } from './input';

/**
 * Describes the shared internal context passed to edit-hook runners.
 *
 * @private
 */
export type RunEditContext = {
    /**
     * The format definition that owns the edit hook being run.
     */
    definition: FormatDefinition;

    /**
     * The value and selection snapshot before the edit.
     */
    previous: TextState;

    /**
     * The value and selection snapshot after the raw edit attempt.
     */
    current: TextState;

    /**
     * The semantic value produced by normalizing the current text.
     */
    normalized: string;

    /**
     * The default formatted text produced from the normalized value.
     */
    formatted: string;

    /**
     * The default value and selection state resolved from the current edit.
     */
    resolved: TextState;
};
