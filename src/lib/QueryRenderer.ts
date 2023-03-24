import type { IQuery } from '../IQuery';
import { getGlobalQuery, getSettings } from '../Config/Settings';

/**
 * Explains a query rendered by {@link QueryRenderer}
 *
 * Specifically, returns a formatted string:
 *     * Explains whether a global filter is in use
 *     * Explains whether the global query if it's in use
 *     * Explains the {@link query}
 *
 * @note This really should be {@link QueryRenderer.explainResults},
 *       but several entities in that file/imported files extend from
 *       classes from the {@link obsidian} package which errors during testing
 * @param {IQuery} query The query to explain
 * @returns {string}
 */
export function explainResults(query: IQuery): string {
    let result = '';

    const { globalFilter } = getSettings();
    if (globalFilter !== '') {
        result += `Only tasks containing the global filter '${globalFilter}'.\n\n`;
    }

    const globalQuery: IQuery = getGlobalQuery();

    if (globalQuery.source !== '') {
        result += `Explanation of the global query:\n\n${globalQuery.explainQuery()}\n`;
    }

    result += `Explanation of this Tasks code block query:\n\n${query.explainQuery()}`;

    return result;
}
