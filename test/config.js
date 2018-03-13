'use strict';

const assert = require('assert');
const config = require('@emmetio/config');
const expand = require('../').expand;
const sampleConfig = require('./sample-config.json');

describe('Config support', () => {
	describe('Markup', () => {
		it('globals', () => {
			const conf = config(sampleConfig, { syntax: 'html' });

			assert.equal(
				expand('.test', conf),
				'<DIV CLASS="test"></DIV>\n<!-- /.test -->',
				'Use markup format and profile options'
			);

			assert.equal(
				expand('.foo>.-bar', conf),
				'<DIV CLASS="foo">\n\t<DIV CLASS="foo_elbar"></DIV>\n\t<!-- /.foo_elbar -->\n</DIV>\n<!-- /.foo -->',
				'Use markup BEM options'
			);

			assert.equal(
				expand('[lang="${lang}" foo=${bar}]', conf),
				'<DIV LANG="ru" FOO="bar"></DIV>',
				'Use markup variables'
			);

			assert.equal(
				expand('sw>a>img', conf),
				'<SW><A HREF="" TITLE=""><IMG SRC="" ALT=""></A></SW>',
				'Use markup & default snippets'
			);
		});

		it('syntax', () => {
			const conf = config(sampleConfig, { syntax: 'angular' });

			assert.equal(
				expand('.test', conf),
				'<div CLASSNAME="test"></div>',
				'Use markup format and profile options, override with syntax format & options'
			);

			assert.equal(
				expand('sw>a>img', conf),
				'<div NGSWITCH=""><a HREF="" TITLE=""><img SRC="" ALT=""></a></div>',
				'Use markup snippets, override with syntax snippets'
			);
		});

		it('project', () => {
			const conf = config(sampleConfig, {
				syntax: 'angular',
				project: 'proj1'
			});

			// NB even if `tagCase` is set to "upper", syntax-specific config
			// takes precedence over type-specific, defined in project
			assert.equal(
				expand('.foo>.-bar', conf),
				'<div CLASSNAME="foo"><div CLASSNAME="foo_elbar"></div></div>',
				'Use markup format & syntax config, disable formatting in project'
			);

			assert.equal(
				expand('p1s>sw>a>img', conf),
				'<div CLASSNAME="proj1-snippet"><div NGSWITCH=""><a HREF="" TITLE=""><img SRC="" ALT=""></a></div></div>',
				'Use markup & syntax snippets, add from project globals'
			);
		});
	});

	describe('Stylesheet', () => {
		it('globals', () => {
			const conf = config(sampleConfig, { type: 'stylesheet' });

			assert.equal(
				expand('c', conf),
				'COLOR:#000;',
				'Use stylesheet format and profile options'
			);

			assert.equal(
				expand('c+bg#fc0', conf),
				'COLOR:#000;BACKGROUND:#ffcc00;',
				'Use stylesheet format and profile options'
			);

			assert.equal(
				expand('p10+gd', conf),
				'PADDING:10px;GRID:;',
				'Use stylesheet & default snippets'
			);
		});

		it('syntax', () => {
			const conf = config(sampleConfig, { syntax: 'sugarss' });

			assert.equal(
				expand('c', conf),
				'COLOR #000',
				'Use stylesheet format and profile options, override with syntax'
			);

			assert.equal(
				expand('c+bg#fc0', conf),
				'COLOR #000BACKGROUND #ffcc00',
				'Use stylesheet format and profile options, override with syntax'
			);

			assert.equal(
				expand('p10+gd+foo', conf),
				'PADDING 10pxGRID BAR ',
				'Use stylesheet & default snippets, override with syntax'
			);
		});

		it('project', () => {
			const conf = config(sampleConfig, {
				syntax: 'sugarss',
				project: 'proj1'
			});

			assert.equal(
				expand('c', conf),
				'COLOR #000;;',
				'Use global & syntax format and profile options, override with project'
			);

			assert.equal(
				expand('c+bg#fc0', conf),
				'COLOR #000;;BACKGROUND #ffcc00;;',
				'Use global & syntax format and profile options, override with project'
			);

			assert.equal(
				expand('gd+foo', conf),
				'BAZ ;;BAR ;;',
				'Use global & syntax snippets, override with project'
			);

			assert.equal(
				expand('p10+m5a', conf),
				'PADDING 10cm;;MARGIN 5bbbb;;',
				'Override options with project'
			);
		});
	});
});
