'use strict';

import defaultSnippets from '@emmetio/snippets';
import lorem from '@emmetio/lorem';
import SnippetsRegistry from '@emmetio/snippets-registry';

const reLorem = /^lorem([a-z]*)(\d*)$/;

/**
 * Constructs a snippets registry, filled with snippets, for given options
 * @param  {String} syntax  Abbreviation syntax
 * @param  {Object|Object[]} snippets Additional snippets
 * @return {SnippetsRegistry}
 */
export default function(syntax, snippets) {
	const registrySnippets = [defaultSnippets[syntax] || defaultSnippets.html];

	if (Array.isArray(snippets)) {
		snippets.forEach(item => {
			// if array item is a string, treat it as a reference to globally
			// defined snippets
			registrySnippets.push(typeof item === 'string' ? defaultSnippets[item] : item)
		});
	} else if (typeof snippets === 'object') {
		registrySnippets.push(snippets);
	}

	const registry = new SnippetsRegistry(registrySnippets.filter(Boolean));

	// for non-stylesheet syntaxes add Lorem Ipsum generator
	if (syntax !== 'css') {
		registry.get(0).set(reLorem, loremGenerator);
	}

	return registry;
}

function loremGenerator(node) {
	const options = {};
	const m = node.name.match(reLorem);
	if (m[1]) {
		options.lang = m[1];
	}

	if (m[2]) {
		options.wordCount = +m[2];
	}

	return lorem(node, options);
}
