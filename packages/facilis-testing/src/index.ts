type FormatResult = {
    formattedValue: string;
    selectionStart: number | null;
    selectionEnd: number | null;
};

type FormatInput = {
    value: string;
    selectionStart: number | null;
    selectionEnd: number | null;
};

type FormatInstance = {
    onInput(options: FormatInput): FormatResult;
    onBlur(options: FormatInput): FormatResult;
};

type InputOptions = {
    value: string;
    selectionStart?: number | null;
    selectionEnd?: number | null;
};

function resolveSelection(value: string, selection?: number | null) {
    return selection ?? value.length;
}

export function applyInput(format: FormatInstance, options: InputOptions) {
    return format.onInput({
        value: options.value,
        selectionStart: resolveSelection(options.value, options.selectionStart),
        selectionEnd: resolveSelection(options.value, options.selectionEnd),
    });
}

export function applyBlur(format: FormatInstance, options: InputOptions) {
    return format.onBlur({
        value: options.value,
        selectionStart: resolveSelection(options.value, options.selectionStart),
        selectionEnd: resolveSelection(options.value, options.selectionEnd),
    });
}

export function typeCharacters(format: FormatInstance, characters: string) {
    let formattedValue = '';
    let selectionStart = 0;
    let selectionEnd = 0;

    return characters.split('').map((character) => {
        const rawValue =
            formattedValue.slice(0, selectionStart) +
            character +
            formattedValue.slice(selectionEnd);
        const rawSelection = selectionStart + character.length;
        const result = applyInput(format, {
            value: rawValue,
            selectionStart: rawSelection,
            selectionEnd: rawSelection,
        });

        formattedValue = result.formattedValue;
        selectionStart = result.selectionStart ?? formattedValue.length;
        selectionEnd = result.selectionEnd ?? selectionStart;

        return result;
    });
}
