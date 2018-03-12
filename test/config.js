'use strict';

const assert = require('assert');
const config = require('@emmetio/config');
const expand = require('../').expand;
const sampleConfig = require('./sample-config.json');

describe('Config support', () => {
	it.only('markup', () => {
		const conf = config(sampleConfig, { syntax: 'html' });

		console.log(expand('.test', conf));
	});
});
