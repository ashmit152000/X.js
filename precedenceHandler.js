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

function parsePrimary(input) {
    // Parses precedence for ()
    if(input.length && input[0].value === "(") {
        input.shift();
        if(input.length && input[0].value !== ")") { 
            let expression = parseTerm(input);
            if(input[0].value !== ")") throw new Error("Closing parenthesis required");
            input.shift();
            return expression;
        }
    }

    return parseValue(input.shift());
}

function parseFactor(input) {
    // Parses precedence for * and /
  let left = parseUnary(input);
  
  while(input.length && isOperator(input[0]) && (input[0].type === TokenType.divide || input[0].type === TokenType.multiply)) {
    let operator = input.shift().value;
    let right = parseUnary(input);
    left = {
      type: "BINARY_EXPRESSION",
      left,
      operator,
      right,
    };
  }

  return left;
}

function isUnaryOperator(value) {
  return ["!", "-"].includes(value);
}

function parseUnary(input) {
    // Parses precedence for ! and -
  let isLeftOperator = isUnaryOperator(input[0].value);
  if(!isLeftOperator) return parsePrimary(input);
  let operator = input.shift().value;
  if(input.length) {
    let operand = parseUnary(input);
    return {
      type: "UNARY_EXPRESSION",
      operator,
      operand,
    };
  }
}



function parseTerm(input) {
    // Parses the precedence for + and -
  let left = parseFactor(input);
  
  while(input.length && isOperator(input[0]) && (input[0].type === TokenType.plus || input[0].type === TokenType.minus)) {
    let operator = input.shift().value;
    let right = parseFactor(input); // If the next operation is a * or a / the precendence changes and hence we need to parse the factor

    left = {
      type: "BINARY_EXPRESSION",
      left,
      operator,
      right,
    };
  }

  return left;
}

module.exports = { parseTerm };
