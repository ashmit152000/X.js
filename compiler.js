const { lexer } = require('./lexer');
const { ast } = require('./ast');

let input = `a = 10.25
b = 20.5
c = 34
d = a + b + c
say a
say d
name = "Ashmit"
say name
say a + b + c
`;

const tokens = lexer(input);

console.log(`Inputs: ${input}`);
console.log(`Tokens: `, tokens);

const astOutput = ast(tokens);

console.log(`AST: `, astOutput);

function compileExpression(value) {
    if (value.type === 'NUMBER_LITERAL') {
        return value.value;
    }

    if (value.type === 'STRING_LITERAL') {
        return `"${value.value}"`;
    }

    if (value.type === 'IDENTIFIER') {
        return value.value;
    }

    if(value.type === 'BINARY_EXPRESSION') {
        let left = compileExpression(value.left);
        let operator = value.operator;
        let right = compileExpression(value.right);
        return `${left} ${operator} ${right}`;
    }


    throw new Error(`Unknown expression type: ${value.type}`);
}


function compiler(input) {

    let finalVal = '';

    if (input.type === 'PROGRAM') {

        let body = input.body;

        while (body.length) {

            let content = body.shift();

            if (content.type === 'DECLARATION') {
                console.log(`Content Value`, content.value);
                finalVal +=
                    `${content.name} = ${compileExpression(content.value)}\n`;

            }

            else if (content.type === 'LOG' && content.name === 'say') {
                console.log(`Content Value`, content.value);
                finalVal +=
                    `console.log(${compileExpression(content.value)})\n`;
            }

            
        }
    }

    return finalVal;
}


console.log(`Output: `);

const output = compiler(astOutput);

console.log(output);

eval(output);