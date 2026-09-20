const {TokenType} = require("./lexeme_caterogy");

const KEYWORDS = new Map([
  ["and", TokenType.and],
  ["class", TokenType.class],
  ["const", TokenType.const],
  ["else", TokenType.else],
  ["false", TokenType.false],
  ["for", TokenType.for],
  ["fun", TokenType.fun],
  ["if", TokenType.if],
  ["nil", TokenType.nil],
  ["or", TokenType.or],
  ["return", TokenType.return],
  ["say", TokenType.say],
  ["super", TokenType.super],
  ["this", TokenType.this],
  ["true", TokenType.true],
  ["var", TokenType.var],
  ["while", TokenType.while],
]);


module.exports = {
  KEYWORDS,
};