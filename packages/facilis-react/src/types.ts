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
 * Describes the React-specific options reserved by `useFormat`.
 *
 * @since 0.1.0
 */
export type UseFormatHookOptions = {
    /**
     * The initial input value Facilis should format when the input mounts.
     */
    defaultValue?: string;

    /**
     * Runs with the raw input event before Facilis updates the display value.
     */
    onInput?: InputEventHandler<HTMLInputElement>;

    /**
     * Runs with the raw blur event before Facilis updates the display value.
     */
    onBlur?: FocusEventHandler<HTMLInputElement>;

    /**
     * Runs after Facilis resolves a new formatted value from input or blur.
     */
    onValueChange?: (value: string) => void;
};

/**
 * Combines format factory options with the React-specific options reserved by
 * `useFormat`.
 *
 * @since 0.1.0
 */
export type UseFormatOptions<FormatOptions extends object = object> =
    FormatOptions & UseFormatHookOptions;

/**
 * Describes the props returned by `useFormat` for a React-managed input.
 *
 * @since 0.1.0
 */
export type UseFormatInputProps = {
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
 * Describes the object returned by `useFormat`.
 *
 * @since 0.1.0
 */
export type UseFormatResult = {
    /**
     * The input element connected to the format runtime.
     */
    inputRef: RefObject<HTMLInputElement | null>;

    /**
     * Props to spread onto an `input` element.
     */
    inputProps: UseFormatInputProps;
};
