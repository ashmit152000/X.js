const { scanTokenType, TokenType } = require("./lexeme_caterogy");
const { KEYWORDS } = require("./keywords");

const lexer = (input) => {
  const tokens = [];
  let cursor = 0;
  let line = 1;

  const push = (type, value) => {
    tokens.push({ type, value, line, column: cursor });
  };

  function isDigit(c) {
    return c >= "0" && c <= "9";
  }

  const isAtEnd = () => cursor >= input.length;

  const peek = () => {
    if (isAtEnd()) {
      return "\0";
    }
    return input[cursor];
  };

  const peekNext = () => {
    if (cursor + 1 >= input.length) {
      return "\0";
    }
    return input[cursor + 1];
  };

  const matchNext = (expected) => {
    if (input[cursor + 1] === expected) {
      cursor++;
      return true;
    }

    return false;
  };

  const identifyReservedWord = (word) => {
    if (KEYWORDS.has(word)) {
      return KEYWORDS.get(word);
    }
    return TokenType.identifier;
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

      push(identifyReservedWord(word), word);
      continue;
    }

    
    // Handle numbers (integers and floats)
    if (isDigit(char)) {
      let num = "";
      while (cursor < input.length && isDigit(input[cursor])) {
        num += input[cursor];
        cursor++;
      }

      if (input[cursor] === ".") {
        if (!isDigit(input[cursor + 1])) {
          throw new Error("Unexpected end of float");
        }

        num += input[cursor];
        cursor++;

        while (cursor < input.length && isDigit(input[cursor])) {
          num += input[cursor];
          cursor++;
        }
      }

      push(TokenType.number, parseFloat(num));
      continue;
    }

    if (char === "/" && matchNext("/")) {
      while (cursor < input.length && input[cursor] !== "\n") {
        cursor++;
      }
      continue;
    }

    if (char === "=") {
      const twoChar = matchNext("=");
      push(
        scanTokenType(twoChar ? "==" : "=", line, cursor),
        twoChar ? "==" : "=",
      );
      cursor++;
      continue;
    }

    if (char === "!") {
      const twoChar = matchNext("=");
      push(
        scanTokenType(twoChar ? "!=" : "!", line, cursor),
        twoChar ? "!=" : "!",
      );
      cursor++;
      continue;
    }

    if (char === ">") {
      const twoChar = matchNext("=");
      push(
        scanTokenType(twoChar ? ">=" : ">", line, cursor),
        twoChar ? ">=" : ">",
      );
      cursor++;
      continue;
    }

    if (char === "<") {
      const twoChar = matchNext("=");
      push(
        scanTokenType(twoChar ? "<=" : "<", line, cursor),
        twoChar ? "<=" : "<",
      );
      cursor++;
      continue;
    }

    // For String literals
    if (char === '"') {
      let strVal = "";
      cursor++; // Skip the opening quote
      while (!isAtEnd() && peek() !== '"') {
        strVal += peek();
        cursor++;
      }

      if (isAtEnd()) {
        throw new Error(
          `Unterminated string at line ${line}, column ${cursor}`,
        );
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
