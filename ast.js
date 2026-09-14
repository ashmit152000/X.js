const { TokenType } = require('./lexeme_caterogy');

function parseValue(token) {
    if (token.type === TokenType.string) {
        return {
            type: 'STRING_LITERAL',
            value: token.value
        };
    }

    if (token.type === TokenType.number) {
        return {
            type: 'NUMBER_LITERAL',
            value: token.value
        };
    }

    if (token.type === TokenType.identifier) {
        return {
            type: 'IDENTIFIER',
            value: token.value
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

function ast(input) {
    const ast = {
        type: 'PROGRAM',
        body: []
    };

    while (input.length) {
        let token = input.shift();

        // Declaration
        if (token.type === TokenType.identifier) {
            let declaration = {
                type: 'DECLARATION',
                name: token.value,
                value: null
            };

            // =
            if (
                input.length &&
                input[0].type === TokenType.equal
            ) {
                input.shift();

                // Get left/value
                let valueToken = input.shift();

                let left = parseValue(valueToken);

                // Check for binary operator
                if (
                    input.length &&
                    input[0].type !== TokenType.newline &&
                    isOperator(input[0])
                ) {
                    let operatorToken = input.shift();

                    // Get right value
                    let rightValueToken = input.shift();

                    let right = parseValue(rightValueToken);

                    declaration.value = {
                        type: 'BINARY_EXPRESSION',
                        left: left,
                        operator: operatorToken.value,
                        right: right
                    };
                }

                else {
                    declaration.value = left;
                }

                ast.body.push(declaration);
            }
        }

        // say
        else if (token.type === TokenType.keyword) {

            if (token.value === 'say') {

                let valueToken = input.shift();
                let left = parseValue(valueToken);

                if(input.length && isOperator(input[0])) {
                    let operatorToken = input.shift();

                    let rightValueToken = input.shift();
                    let right = parseValue(rightValueToken);

                    valueToken = {
                        type: 'BINARY_EXPRESSION',
                        left: left,
                        operator: operatorToken.value,
                        right: right
                    };
                }

                let declaration = {
                    type: 'LOG',
                    name: 'say',
                    value: null
                };

                declaration.value = valueToken;

                ast.body.push(declaration);
            }
        }
    }

    return ast;
}

module.exports = { ast };