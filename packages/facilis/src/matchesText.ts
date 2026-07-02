/**
 * Returns whether the provided text satisfies the expression.
 *
 * Resets the expression state first so global and sticky expressions do not
 * leak a stale `lastIndex` into repeated tests.
 *
 * @since 0.0.1
 */
export function matchesText(value: string, expression: RegExp) {
    expression.lastIndex = 0;
    return expression.test(value);
}
