const { scanTokenType, TokenType } = require("./lexeme_caterogy");

const KEYWORDS = new Set(["const", "say"]);

const lexer = (input) => {
  const tokens = [];
  let cursor = 0;
  let line = 1;

  const push = (type, value) => {
    tokens.push({ type, value, line, column: cursor });
  };

  const isAtEnd = () => cursor >= input.length;

  const peek = () => {
    if (isAtEnd()) {
      return "\0";
    }
    return input[cursor];
  }

  const matchNext = (expected) => {
    if (input[cursor + 1] === expected) {
      cursor++;
      return true;
    }

    return false;
  };

  while (cursor < input.length) {
    const char = input[cursor];

    if (/[\t\r ]/.test(char)) {
      cursor++;
      continue;
    }

    if (char === "\n") {
      push(TokenType.newline, "\n");
      line++;
      cursor++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let word = "";
      while (cursor < input.length && /[a-zA-Z]/.test(input[cursor])) {
        word += input[cursor];
        cursor++;
      }

      push(KEYWORDS.has(word) ? TokenType.keyword : TokenType.identifier, word);
      continue;
    }

    if (/[0-9]/.test(char)) {
      let num = "";
      while (cursor < input.length && /[0-9]/.test(input[cursor])) {
        num += input[cursor];
        cursor++;
      }

      push(TokenType.number, parseInt(num, 10));
      continue;
    }

    if (char === "/" && matchNext("/")) {
      while (cursor < input.length && input[cursor] !== "\n") {
        cursor++;
      }
      line++;
      continue;
    }

    if (char === "=") {
      const twoChar = matchNext("=");
      push(scanTokenType(twoChar ? "==" : "=", line, cursor), twoChar ? "==" : "=");
      cursor++;
      continue;
    }

    if (char === "!") {
      const twoChar = matchNext("=");
      push(scanTokenType(twoChar ? "!=" : "!", line, cursor), twoChar ? "!=" : "!");
      cursor++;
      continue;
    }

    if (char === ">") {
      const twoChar = matchNext("=");
      push(scanTokenType(twoChar ? ">=" : ">", line, cursor), twoChar ? ">=" : ">");
      cursor++;
      continue;
    }

    if (char === "<") {
      const twoChar = matchNext("=");
      push(scanTokenType(twoChar ? "<=" : "<", line, cursor), twoChar ? "<=" : "<");
      cursor++;
      continue;
    }

    // For String literals
    if(char === '"') {
      let strVal = "";
      cursor++; // Skip the opening quote
      while(!isAtEnd() && peek() !== '"') {
        strVal += peek();
        cursor++;
      }

      if(isAtEnd()) {
        throw new Error(`Unterminated string at line ${line}, column ${cursor}`);
      }

      cursor++; // Skip the closing quote
      push(TokenType.string, strVal);
      continue;
    }

    const type = scanTokenType(char, line, cursor);
    if (typeof type === "string" && type.startsWith("Unexpected token")) {
      throw new Error(type);
    }

    push(type, char);
    cursor++;
  }

  return tokens;
};

module.exports = { lexer };
