"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const change_case_1 = require("change-case");
const generateEnumKeys = (assetKeys) => assetKeys
    .map(name => {
    const enumName = (0, change_case_1.pascalCase)(name);
    const prefix = enumName.match(/^\d/) ? 'i' : '';
    return {
        [name]: `${prefix}${enumName}`
    };
})
    .reduce((prev, curr) => Object.assign(prev, curr), {});
const generateEnums = (enumName, enumKeys, quote = '"') => [
    `export enum ${enumName} {`,
    ...Object.entries(enumKeys).map(([enumValue, enumKey]) => `  ${enumKey} = ${quote}${enumValue}${quote},`),
    '}\n'
].join('\n');
const generateConstant = ({ codepointsName, enumName, literalIdName, literalKeyName, enumKeys, codepoints, quote = '"', kind = {} }) => {
    let varType = ': Record<string, string>';
    if (kind.enum) {
        varType = `: { [key in ${enumName}]: string }`;
    }
    else if (kind.literalId) {
        varType = `: { [key in ${literalIdName}]: string }`;
    }
    else if (kind.literalKey) {
        varType = `: { [key in ${literalKeyName}]: string }`;
    }
    return [
        `export const ${codepointsName}${varType} = {`,
        Object.entries(enumKeys)
            .map(([enumValue, enumKey]) => {
            const key = kind.enum
                ? `[${enumName}.${enumKey}]`
                : `${quote}${enumValue}${quote}`;
            return `  ${key}: ${quote}${codepoints[enumValue]}${quote},`;
        })
            .join('\n'),
        '};\n'
    ].join('\n');
};
const generateStringLiterals = (typeName, literals, quote = '"') => [
    `export type ${typeName} =`,
    `${literals.map(key => `  | ${quote}${key}${quote}`).join('\n')};\n`
].join('\n');
const generator = {
    generate: ({ name, codepoints, assets, formatOptions: { ts } = {} }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const quote = Boolean(ts === null || ts === void 0 ? void 0 : ts.singleQuotes) ? "'" : '"';
        const generateKind = (Boolean((_a = ts === null || ts === void 0 ? void 0 : ts.types) === null || _a === void 0 ? void 0 : _a.length)
            ? ts.types
            : ['enum', 'constant', 'literalId', 'literalKey'])
            .map(kind => ({ [kind]: true }))
            .reduce((prev, curr) => Object.assign(prev, curr), {});
        const enumName = (0, change_case_1.pascalCase)(name);
        const codepointsName = `${(0, change_case_1.constantCase)(name)}_CODEPOINTS`;
        const literalIdName = `${(0, change_case_1.pascalCase)(name)}Id`;
        const literalKeyName = `${(0, change_case_1.pascalCase)(name)}Key`;
        const names = { enumName, codepointsName, literalIdName, literalKeyName };
        const enumKeys = generateEnumKeys(Object.keys(assets));
        const stringLiteralId = generateKind.literalId
            ? generateStringLiterals(literalIdName, Object.keys(enumKeys), quote)
            : null;
        const stringLiteralKey = generateKind.literalKey
            ? generateStringLiterals(literalKeyName, Object.values(enumKeys), quote)
            : null;
        const enums = generateKind.enum
            ? generateEnums(enumName, enumKeys, quote)
            : null;
        const constant = generateKind.constant
            ? generateConstant(Object.assign(Object.assign({}, names), { enumKeys,
                codepoints,
                quote, kind: generateKind }))
            : null;
        return [stringLiteralId, stringLiteralKey, enums, constant]
            .filter(Boolean)
            .join('\n');
    })
};
exports.default = generator;
//# sourceMappingURL=ts.js.map