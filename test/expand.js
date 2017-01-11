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
    });

	it('syntax', () => {
		assert.equal(expand('ul>.item$*2', {syntax: 'html'}), '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');
		assert.equal(expand('ul>.item$*2', {syntax: 'slim'}), 'ul\n\tli.item1\n\tli.item2');
		assert.equal(expand('xsl:variable[name=a select=b]>div', {addons: {xsl: true}}), '<xsl:variable name="a">\n\t<div></div>\n</xsl:variable>');
	});

    it('custom profile', () => {
        const profile = {selfClosingStyle: 'xhtml'};

        assert.equal(expand('img'), '<img src="" alt="">');
        assert.equal(expand('img', {profile}), '<img src="" alt="" />');
    });

    it('custom variables', () => {
        const variables = {charset: 'ru-RU'};

        assert.equal(expand('[charset=${charset}]{${charset}}'), '<div charset="UTF-8">UTF-8</div>');
        assert.equal(expand('[charset=${charset}]{${charset}}', {variables}), '<div charset="ru-RU">ru-RU</div>');
    });

    it('custom snippets', () => {
        const snippets = {link: 'link[foo=bar href]/'};

        // `link:css` depends on `link` snippet so changing it will result in
        // altered `link:css` result
        assert.equal(expand('link:css'), '<link rel="stylesheet" href="style.css">');
        assert.equal(expand('link:css', {snippets}), '<link foo="bar" href="style.css">');
    });

    it('formatter options', () => {
		const format = {comment: {enabled: true}};

		assert.equal(expand('ul>.item$*2'), '<ul>\n\t<li class="item1"></li>\n\t<li class="item2"></li>\n</ul>');
		assert.equal(expand('ul>.item$*2', {format}), '<ul>\n\t<li class="item1"></li>\n\t<!-- /.item1 -->\n\t<li class="item2"></li>\n\t<!-- /.item2 -->\n</ul>');
    });
});
