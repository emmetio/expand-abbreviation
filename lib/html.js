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
	options = options || {};

	if (typeof abbr === 'string') {
		abbr = parse(abbr, options);
	}

	return format(abbr, options.profile, options.syntax, options.format);
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
