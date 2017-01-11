'use strict';

import { expand as htmlExpand, parse as htmlParse } from './lib/html';

// XXX will add CSS support later

export function expand(abbr, options) {
    return htmlExpand(abbr, options);
}

export function parse(abbr, options) {
    return htmlParse(abbr, options);
}
