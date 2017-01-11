'use strict';

import snippets from '@emmetio/snippets';
import SnippetsRegistry from '@emmetio/snippets-registry';
import Profile from '@emmetio/output-profile';

/**
 * Creates snippets registry and fills it with data
 * @param  {Object} options
 * @return {SnippetsRegistry}
 */
export function createSnippetsRegistry(options) {
    if (options.snippets instanceof SnippetsRegistry) {
        return options.snippets;
    }

    const registrySnippets = [snippets[options.syntax] || snippets.html];

    if (Array.isArray(options.snippets)) {
        options.snippets.forEach(item => {
            // if array item is a string, treat it as a reference to globally
            // defined snippets
            registrySnippets.push(typeof item === 'string' ? snippets[item] : item)
        });
    } else if (typeof options.snippets === 'object') {
        registrySnippets.push(options.snippets);
    }

    return new SnippetsRegistry(registrySnippets.filter(Boolean));
}

/**
 * Creates output profile from given options
 * @param  {Object} options
 * @return {Profile}
 */
export function createProfile(options) {
    return options.profile instanceof Profile
        ? options.profile
        : new Profile(options.profile);
}
