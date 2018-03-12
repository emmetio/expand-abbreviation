'use strict';

import parseAbbreviation from '@emmetio/abbreviation';
import resolveSnippets from '@emmetio/html-snippets-resolver';
import transform from '@emmetio/html-transform';
import resolveVariables from '@emmetio/variable-resolver';
import format from '@emmetio/markup-formatters';

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} config
 * @return {String}
 */
export function expand(abbr, config) {
	config = Object.assign({}, config);

	if (typeof abbr === 'string') {
		abbr = parse(abbr, config);
	}

	return format(abbr, config.profile, config.syntax, config);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String} Abbreviation to parse
 * @param  {Object} config
 * @return {Node}
 */
export function parse(abbr, config) {
	return parseAbbreviation(abbr)
		.use(resolveSnippets, config.snippets)
		.use(resolveVariables, config.variables)
		.use(transform, config.text, config.options);
}
