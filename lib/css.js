'use strict';

import parseAbbreviation from '@emmetio/css-abbreviation';
import resolveSnippets from '@emmetio/css-snippets-resolver';
import format from '@emmetio/stylesheet-formatters';

/**
 * Expands given abbreviation into code
 * @param  {String|Node} abbr    Abbreviation to parse or already parsed abbreviation
 * @param  {Object} config
 * @return {String}
 */
export function expand(abbr, config) {
	config = config || {};

	if (typeof abbr === 'string') {
		abbr = parse(abbr, config);
	}

	return format(abbr, config.profile, config.syntax, config);
}

/**
 * Parses given Emmet abbreviation into a final abbreviation tree with all
 * required transformations applied
 * @param {String|Node} abbr Abbreviation to parse or already parsed abbreviation
 * @param  {Object} config
 * @return {Node}
 */
export function parse(abbr, config) {
	if (typeof abbr === 'string') {
		abbr = parseAbbreviation(abbr);
	}

	return abbr.use(resolveSnippets, config.snippets, config.options);
}
