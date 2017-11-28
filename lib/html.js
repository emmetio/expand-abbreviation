'use strict';

import parseAbbreviation from '@emmetio/abbreviation';
import resolveSnippets from '@emmetio/html-snippets-resolver';
import transform from '@emmetio/html-transform';
import resolveVariables from '@emmetio/variable-resolver';
import format from '@emmetio/markup-formatters';

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {String}
 */
export function expand(abbr, options) {
	options = Object.assign({}, options);

	if (typeof abbr === 'string') {
		abbr = parse(abbr, options);
	}

	if (options.format) {
		// Interop for version < 0.6: `format` option was used for markup
		// formatter only, since 0.6 it also supports stylesheet formatting
		options.format = options.format.comment ? options.format : options.format.markup;
		// TODO provide per-syntax format, e.g. extract syntax-based options
		// from `options.format`
	}

	return format(abbr, options.profile, options.syntax, options);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String} Abbreviation to parse
 * @param  {Object} options
 * @return {Node}
 */
export function parse(abbr, options) {
	return parseAbbreviation(abbr)
	.use(resolveSnippets, options.snippets)
	.use(resolveVariables, options.variables)
	.use(transform, options.text, options.addons);
}
