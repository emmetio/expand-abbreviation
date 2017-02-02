'use strict';

const assert = require('assert');
require('babel-register');
const _expand = require('../index').expand;

const expand = (abbr, options) => _expand(abbr, Object.assign({syntax: 'css'}, options));

describe('CSS expand', () => {
	it('basic', () => {
		assert.equal(expand('p10'), 'padding: 10px;');
		assert.equal(expand('c'), 'color: #000;');
		assert.equal(expand('fl-l'), 'float: left;');
		assert.equal(expand('fl-r'), 'float: right;');
		assert.equal(expand('@k'), '@keyframes identifier {\n\t\n}');
		assert.equal(expand('fll'), 'float: left;');
		assert.equal(expand('ovh'), 'overflow: hidden;');

		// insert TextMate-style fields/tabstops in output
		const field = (index, placeholder) => `\${${index}${placeholder ? ':' + placeholder : ''}}`;
		assert.equal(expand('bg-u', {field}), 'background: url(${1});');
		assert.equal(expand('c', {field}), 'color: #${2:000};');
	});

	it('linear-gradient', () => {
		assert.equal(expand('lg(to right, black, #f00.4)'), 'background-image: linear-gradient(to right, black, rgba(255, 0, 0, 0.4));');
	});

	it('chains', () => {
		assert.equal(expand('p.5+m-a'), 'padding: 0.5em;\nmargin: auto;');
	});
});
