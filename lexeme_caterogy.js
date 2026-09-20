const TokenType = Object.freeze({

  // Literals
  identifier: "identifier",
  number: "number",
  string: "string",

  // Keywords
  and: "and",
  class: "class",
  const: "const",
  else: "else",
  false: "false",
  for: "for",
  fun: "fun",
  if: "if",
  nil: "nil",
  or: "or",
  return: "return",
  say: "say",
  super: "super",
  this: "this",
  true: "true",
  while: "while",

  // Operators
  plus: "plus",
  minus: "minus",
  multiply: "multiply",
  divide: "divide",
  equal: "equal",
  equalEqual: "equalEqual",
  not: "not",
  notEqual: "notEqual",
  greater: "greater",
  greaterEqual: "greaterEqual",
  less: "less",
  lessEqual: "lessEqual",

  // Punctuation
  leftParen: "leftParen",
  rightParen: "rightParen",
  leftBrace: "leftBrace",
  rightBrace: "rightBrace",
  comma: "comma",
  dot: "dot",

  // Statement termination
  newline: "newline",

  // End of file
  eof: "eof",
});


const scanTokenType = (token, line, cursor) => {
    switch (token) {
        case "+":
            return TokenType.plus;

        case "-":
            return TokenType.minus;

        case "*":
            return TokenType.multiply;

        case "/":
            return TokenType.divide;

        case "=":
            return TokenType.equal;

        case "==":
            return TokenType.equalEqual;

        case "!":
            return TokenType.not;

        case "!=":
            return TokenType.notEqual;

        case ">":
            return TokenType.greater;

        case ">=":
            return TokenType.greaterEqual;

        case "<":
            return TokenType.less;

        case "<=":
            return TokenType.lessEqual;

        case "(":
            return TokenType.leftParen;

        case ")":
            return TokenType.rightParen;

        case "{":
            return TokenType.leftBrace;

        case "}":
            return TokenType.rightBrace;

        case ",":
            return TokenType.comma;

        case ".":
            return TokenType.dot;

        case "\n":
            return TokenType.newline;

        case null:
            return TokenType.eof;

        default:
            return `Unexpected token at line ${line} and column ${cursor}: ${token}`;
            break;
    }
};

module.exports = { TokenType, scanTokenType };

