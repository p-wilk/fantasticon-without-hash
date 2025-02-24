"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSrcAttribute = void 0;
const misc_1 = require("../types/misc");
const renderSrcOptions = {
    [misc_1.FontAssetType.EOT]: {
        formatValue: 'embedded-opentype',
        getSuffix: () => '#iefix'
    },
    [misc_1.FontAssetType.WOFF2]: { formatValue: 'woff2' },
    [misc_1.FontAssetType.WOFF]: { formatValue: 'woff' },
    [misc_1.FontAssetType.TTF]: { formatValue: 'truetype' },
    [misc_1.FontAssetType.SVG]: { formatValue: 'svg', getSuffix: name => `#${name}` }
};
const renderSrcAttribute = ({ name, fontTypes, fontsUrl }, font) => fontTypes
    .map(fontType => {
    const { formatValue } = renderSrcOptions[fontType];
    return `url("${fontsUrl || '.'}/${name}.${fontType}") format("${formatValue}")`;
})
    .join(',\n');
exports.renderSrcAttribute = renderSrcAttribute;
//# sourceMappingURL=css.js.map