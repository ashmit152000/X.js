const {lexer} = require('./lexer');
const {ast} = require('./ast');


let input = `a = 10
b = 20
sum = a + b
say sum
`

const tokens = lexer(input);
const astOutput = ast(tokens);



let compiler = function(input) {
    let finalVal = ``;
    if(input.type === 'PROGRAM') {
        let body = input.body;
        while(body.length) {
        let expression = "";
        if(body[0].type === 'DECLARATION') {
            let content = body.shift();
            expression +=  `${content.name} = ${content.value}\n`
        } else if(body[0].type === 'LOG' && body[0].name === 'say') {
            let content = body.shift();
            expression += `console.log(${content.value})\n`;
        }

        finalVal += expression;
        
    }
    }
    


    return finalVal;
}


eval(compiler(astOutput));


