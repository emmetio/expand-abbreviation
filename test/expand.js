'use strict';

const assert = require('assert');
require('babel-register');
const expand = require('../html').default;

describe('HTML expand', () => {
    it('basic', () => {
		console.log(expand('ul>.item$*2'));
    });
});
