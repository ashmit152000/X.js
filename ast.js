


// let tokens = lexer(input);
function ast(input) {
    const ast = {
        type: 'PROGRAM',
        body: [

        ]
    }


    while(input.length) {
        let token = input.shift();

        if(token.type === 'VARIABLE') {
            let declaration = {
                type: 'DECLARATION',
                name: token.value,
                value: null
            }
            if(input.length && input[0].type === 'OPERATOR' && input[0].value === '=') {
                    input.shift();
                    let expression = '';
                    while(input.length && input[0].type !== 'NEWLINE') {
                        
                        expression += input.shift().value;
                    }

                    declaration.value = expression;
                    ast.body.push(declaration);

                }
            
            
        } else if(token.type === 'KEYWORD') {
            let declaration = {
                type: 'LOG',
                name: 'say',
                value: null,
            }
            if(token.value === 'say') {
                let expression = '';
                while(input.length && input[0].type !== 'NEWLINE') {
                    expression += input.shift().value;
                }

                declaration.value = expression;

                ast.body.push(declaration);



            }
        }
    }


    return ast;


}

module.exports = { ast };