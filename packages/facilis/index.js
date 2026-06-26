/**
 * Placeholder entry point for the initial Facilis package scaffold.
 * The real runtime API can grow here once core implementation work begins.
 */
export function defineFormat(config = {}) {
    return function createFormatInstance() {
        return {
            ...config,
        };
    };
}
