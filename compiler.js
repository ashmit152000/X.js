const { lexer } = require('./lexer');
const { ast } = require('./ast');

let input = `a = 10
b = 20
say a
name = "Ashmit"
say name
say a + b
`;

const tokens = lexer(input);

console.log(`Inputs: ${input}`);
console.log(`Tokens: `, tokens);

const astOutput = ast(tokens);

console.log(`AST: `, astOutput);


function compileValue(value) {

    if (value.type === 'NUMBER_LITERAL') {
        return value.value;
    }

    if (value.type === 'STRING_LITERAL') {
        return `"${value.value}"`;
    }

    if (value.type === 'IDENTIFIER') {
        return value.value;
    }
}


function compiler(input) {

    let finalVal = '';

    if (input.type === 'PROGRAM') {

        let body = input.body;

        while (body.length) {

            let content = body.shift();

            if (content.type === 'DECLARATION') {

                finalVal +=
                    `${content.name} = ${compileValue(content.value)}\n`;

            }

            else if (content.type === 'LOG' && content.name === 'say') {

                finalVal +=
                    `console.log(${compileValue(content.value)})\n`;
            }

            
        }
    }

    return finalVal;
}


console.log(`Output: `);

const output = compiler(astOutput);

console.log(output);

eval(output);