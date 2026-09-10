const lexer = (input) => {
    const tokens = [];
    let cursor = 0;

    while(cursor < input.length) {
        let char = input[cursor];
        if(/[^\S\n]/.test(char)) {
            cursor++;
            continue;
        }

        if(/\n/.test(char)) {
            tokens.push({
                type: 'NEWLINE',
                value: 'newline'
            })

            char = input[++cursor];
            continue;
        }

        if(/[a-zA-Z]/.test(char)) {
            let word = '';
            while(cursor < input.length && /[a-zA-Z]/.test(char)) {
                word += char;
                char = input[++cursor];
            }

            if(word === 'const') {
                tokens.push({
                    type: 'KEYWORD', value: word
                })
            } else if(word !== 'say') {
                tokens.push({type: 'VARIABLE', value: word})
            } else {
                tokens.push({type: 'KEYWORD', value: word})
            }

            continue;
            
        }


        if(/[0-9]/.test(char)) {
            let num = '';
            while(cursor < input.length && /[0-9]/.test(char)) {
                num += char;
                char = input[++cursor];
            }

            tokens.push({
                type: 'NUMBER', value: parseInt(num)
            });

            continue;
        }


        if(/[\+\-\*/=]/.test(char)) {
            tokens.push({
                type: 'OPERATOR', value: char
            });
            cursor++;
            continue;
        }
        
    }


    return tokens;
}

module.exports = { lexer };









