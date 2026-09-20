const { TokenType } = require("./lexeme_caterogy");

function parseValue(token) {
  if (token.type === TokenType.string) {
    return {
      type: "STRING_LITERAL",
      value: token.value,
    };
  }

  if (token.type === TokenType.number) {
    return {
      type: "NUMBER_LITERAL",
      value: token.value,
    };
  }

  if (token.type === TokenType.identifier) {
    return {
      type: "IDENTIFIER",
      value: token.value,
    };
  }

  return null;
}

function isOperator(token) {
  return (
    token.type === TokenType.plus ||
    token.type === TokenType.minus ||
    token.type === TokenType.multiply ||
    token.type === TokenType.divide
  );
}

function parseExpression(input) {
  let left = parseValue(input.shift());

  if (input.length && input[0].type !== TokenType.newline) {
    if (isOperator(input[0])) {
      let operator = input.shift().value;
      let right = parseExpression(input);

      return {
        type: "BINARY_EXPRESSION",
        left,
        operator,
        right,
      };
    }
  }

  return left;
}

function ast(input) {
  const ast = {
    type: "PROGRAM",
    body: [],
  };

  while (input.length) {
    let token = input.shift();

    // Declaration
    if (token.type === TokenType.identifier) {
      let declaration = {
        type: "DECLARATION",
        name: token.value,
        value: null,
      };

      // =
      if (input.length && input[0].type === TokenType.equal) {
        input.shift();
        declaration.value = parseExpression(input);
        ast.body.push(declaration);
      }
    }

    // say
    else if (token.type === TokenType.say) {
      let value = parseExpression(input);

      ast.body.push({
        type: "LOG",
        name: "say",
        value,
      });
    }
  }

  return ast;
}

module.exports = { ast };
