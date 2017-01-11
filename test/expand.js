'use strict';

const assert = require('assert');
require('babel-register');
const expand = require('../html').expand;

describe('HTML expand', () => {
    it('basic', () => {
		assert.equal(expand('ul>.item$*2'), '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');

		// insert text into abbreviation
		assert.equal(expand('ul>.item$*', {text: ['foo', 'bar']}), '<ul>\n\t<li class="item1">foo</li>\n\t<li class="item2">bar</li>\n</ul>');

		// insert TextMate-style fields/tabstops in output
		const field = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;
		assert.equal(expand('ul>.item$*2', {field}), '<ul>\n\t<li class="item1">${1}</li>\n\t<li class="item2">${2}</li>\n</ul>');

		// comment HTML nodes (add formatting options)
		const format = {comment: {enabled: true}};
		assert.equal(expand('ul>.item$*2', {format}), '<ul>\n\t<li class="item1"></li>\n\t<!-- /.item1 -->\n\t<li class="item2"></li>\n\t<!-- /.item2 -->\n</ul>');
    });

	it('syntax', () => {
		assert.equal(expand('ul>.item$*2', {syntax: 'html'}), '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');
		assert.equal(expand('ul>.item$*2', {syntax: 'slim'}), 'ul\n\tli.item1\n\tli.item2');
		assert.equal(expand('xsl:variable[name=a select=b]>div', {addons: {xsl: true}}), '<xsl:variable name="a">\n\t<div></div>\n</xsl:variable>');
	});
});
