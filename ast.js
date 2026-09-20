const { TokenType } = require("./lexeme_caterogy");
const { parseTerm } = require("./precedenceHandler");

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
        declaration.value = parseTerm(input);
        ast.body.push(declaration);
      }
    }

    // say
    else if (token.type === TokenType.say) {
      let value = parseTerm(input);

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
