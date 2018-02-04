'use strict';

import parseAbbreviation from '@emmetio/css-abbreviation';
import resolveSnippets from '@emmetio/css-snippets-resolver';
import format from '@emmetio/stylesheet-formatters';

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
 * @param {String|Node} abbr Abbreviation to parse or already parsed abbreviation
 * @param  {Object} options
 * @return {Node}
 */
export function parse(abbr, options) {
	if (typeof abbr === 'string') {
		abbr = parseAbbreviation(abbr);
	}

	return abbr.use(resolveSnippets, options.snippets, options.format ? options.format.stylesheet : {});
}
