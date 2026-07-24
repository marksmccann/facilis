import type { Format } from 'facilis';
import type { FocusEventHandler, InputEventHandler, RefObject } from 'react';

/**
 * Creates one Facilis format instance for the React adapter.
 *
 * @since 0.1.0
 */
export type FormatFactory<FormatOptions extends object = object> = (
    options: FormatOptions
) => Format;

/**
 * Describes React event options shared by controlled and uncontrolled inputs.
 *
 * @since 0.1.0
 */
type UseFormattedInputCommonOptions = {
    /**
     * Runs with the raw input event before Facilis updates the display value.
     */
    onInput?: InputEventHandler<HTMLInputElement>;

    /**
     * Runs with the raw blur event before Facilis updates the display value.
     */
    onBlur?: FocusEventHandler<HTMLInputElement>;
};

/**
 * Describes options for an input whose value is owned by the caller.
 *
 * @since 0.1.0
 */
export type UseFormattedInputControlledOptions =
    UseFormattedInputCommonOptions & {
        /**
         * The current formatted display value.
         */
        value: string;

        /**
         * Runs when Facilis resolves a new formatted value.
         */
        onValueChange: (value: string) => void;

        /**
         * Controlled inputs cannot also provide an uncontrolled initial value.
         */
        defaultValue?: never;
    };

/**
 * Describes options for an input whose value is owned by the hook.
 *
 * @since 0.1.0
 */
export type UseFormattedInputUncontrolledOptions =
    UseFormattedInputCommonOptions & {
        /**
         * The initial input value Facilis should format when the input mounts.
         */
        defaultValue?: string;

        /**
         * Runs after Facilis resolves a new formatted value.
         */
        onValueChange?: (value: string) => void;

        /**
         * Uncontrolled inputs cannot also receive a caller-owned value.
         */
        value?: never;
    };

/**
 * Describes the React-specific options reserved by `useFormattedInput`.
 *
 * @since 0.1.0
 */
export type UseFormattedInputOptions =
    | UseFormattedInputControlledOptions
    | UseFormattedInputUncontrolledOptions;

/**
 * Describes the props returned by `useFormattedInput` for a React-managed
 * input.
 *
 * @since 0.1.0
 */
export type UseFormattedInputProps = {
    /**
     * Connects the input element to the format runtime.
     */
    ref: RefObject<HTMLInputElement | null>;

    /**
     * The current display value resolved by Facilis.
     */
    value: string;

    /**
     * Handles live input formatting.
     */
    onInput: InputEventHandler<HTMLInputElement>;

    /**
     * Handles blur-time formatting.
     */
    onBlur: FocusEventHandler<HTMLInputElement>;
};

/**
 * Describes the object returned by `useFormattedInput`.
 *
 * @since 0.1.0
 */
export type UseFormattedInputResult = {
    /**
     * The input element connected to the format runtime.
     */
    inputRef: RefObject<HTMLInputElement | null>;

    /**
     * Props to spread onto an `input` element.
     */
    inputProps: UseFormattedInputProps;
};
