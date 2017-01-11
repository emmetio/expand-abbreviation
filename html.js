'use strict';

import parseAbbreviation from '@emmetio/abbreviation';
import snippets from '@emmetio/snippets';
import SnippetsRegistry from '@emmetio/snippets-registry';
import resolveSnippets from '@emmetio/html-snippets-resolver';
import Profile from '@emmetio/output-profile';
import transform from '@emmetio/html-transform';
import resolveVariables from '@emmetio/variable-resolver';
import format from '@emmetio/markup-formatters';

const defaultOptions = {
    /**
     * Abbreviation output syntax
     * @type {String}
     */
    syntax: 'html',

    /**
     * Field/tabstop generator for editor. Most editors support TextMate-style
     * fields: ${0} or ${1:item}. So for TextMate-style fields this function
     * will look like this:
     * @example
     * (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`
     *
     * @param  {Number} index         Placeholder index. Fields with the same indices
     * should be linked
     * @param  {String} [placeholder] Field placeholder
     * @return {String}
     */
    field: (index, placeholder) => placeholder || '',

    /**
     * Insert given text string(s) into expanded abbreviation
     * If array of strings is given, the implicitly repeated element (e.g. `li*`)
     * will be repeated by the amount of items in array
     * @type {String|String[]}
     */
    text: null,

    /**
     * Either predefined output profile or options for output profile. Used for
     * abbreviation output
     * @type {Profile|Object}
     */
    profile: null,

    /**
     * Custom variables for variable resolver
     * @see @emmetio/variable-resolver
     * @type {Object}
     */
    variables: {},

    /**
     * Custom predefined snippets for abbreviation. The expanded abbreviation
     * will try to match given snippets that may contain custom elements,
     * predefined attributes etc.
     * May also contain array of items: either snippets (Object) or references
     * to default syntax snippets (String; the key in default snippets hash)
     * @see @emmetio/snippets
     * @type {Object|SnippetsRegistry}
     */
    snippets: {},

    /**
     * Hash of additional transformations that should be applied to expanded
     * abbreviation, like BEM or JSX. Since these transformations introduce
     * side-effect, they are disabled by default and should be enabled by
     * providing a transform name as a key and transform options as value:
     * @example
     * {
     *     bem: {element: '--'},
     *     jsx: true // no options, just enable transform
     * }
     * @see @emmetio/html-transform/lib/addons
     * @type {Object}
     */
    addons: null,

    /**
     * Additional options for syntax formatter
     * @see @emmetio/markup-formatters
     * @type {Object}
     */
    format: null
};

const defaultVariables = {
    lang: 'en',
    locale: 'en-US',
    charset: 'UTF-8'
};

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {String}
 */
export function expand(abbr, options) {
	options = Object.assign({}, defaultOptions, options);
	const formatOptions = Object.assign({field: options.field}, options.format);

	if (typeof abbr === 'string') {
		abbr = parse(abbr, options);
	}

    return format(abbr, createProfile(options), options.syntax, formatOptions);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String|Node} Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {Node}
 */
export function parse(abbr, options) {
	options = Object.assign({}, defaultOptions, options);

	if (typeof abbr === 'string') {
		abbr = parseAbbreviation(abbr);
	}

    return abbr
    .use(transform, options.text, options.addons)
    .use(resolveSnippets, createSnippetsRegistry(options))
    .use(resolveVariables, Object.assign({}, defaultVariables, options.variables));
}

/**
 * Creates snippets registry and fills it with data
 * @param  {Object} options
 * @return {SnippetsRegistry}
 */
function createSnippetsRegistry(options) {
    if (options.snippets instanceof SnippetsRegistry) {
        return options.snippets;
    }

    const registrySnippets = [snippets[options.syntax]];

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
function createProfile(options) {
    return options.profile instanceof Profile
        ? options.profile
        : new Profile(options.profile);
}
