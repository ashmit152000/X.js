# X.js

A tiny toy programming language that compiles to JavaScript.

X.js is a learning project that walks through the classic stages of a compiler:
source text → **tokens** → **AST** → **generated JavaScript** → execution. It's
small on purpose — the goal is to understand how languages work, not to ship a
production runtime.

## Example

```
a = 10
b = 20
sum = a + b
say sum
```

Output:

```
30
```

## How it works

The pipeline lives in three files:

| Stage | File | Responsibility |
| --- | --- | --- |
| Lexer | [lexer.js](lexer.js) | Scans raw source and produces a flat list of tokens (`KEYWORD`, `VARIABLE`, `NUMBER`, `OPERATOR`, `NEWLINE`). |
| Parser | [ast.js](ast.js) | Consumes tokens and builds an Abstract Syntax Tree (`PROGRAM` with `DECLARATION` and `LOG` nodes). |
| Compiler | [compiler.js](compiler.js) | Walks the AST, emits equivalent JavaScript, and runs it with `eval`. |

### 1. Lexing

`lexer(input)` returns tokens such as:

```js
[
  { type: 'VARIABLE', value: 'a' },
  { type: 'OPERATOR', value: '=' },
  { type: 'NUMBER',   value: 10 },
  { type: 'NEWLINE',  value: 'newline' },
  // ...
]
```

Whitespace is skipped, newlines are preserved (they terminate statements), and
`const` / `say` are recognized as keywords.

### 2. Parsing

`ast(tokens)` produces a tree:

```js
{
  type: 'PROGRAM',
  body: [
    { type: 'DECLARATION', name: 'a',   value: '10' },
    { type: 'DECLARATION', name: 'b',   value: '20' },
    { type: 'DECLARATION', name: 'sum', value: 'a+b' },
    { type: 'LOG',         name: 'say', value: 'sum' }
  ]
}
```

### 3. Compiling

The compiler turns each node into JavaScript:

- `DECLARATION` → `name = value`
- `LOG` → `console.log(value)`

The generated source for the example above is:

```js
a = 10
b = 20
sum = a+b
console.log(sum)
```

which is then executed.

## Language reference

| Feature | Syntax | Notes |
| --- | --- | --- |
| Assignment | `x = <expr>` | One statement per line. |
| Arithmetic | `+`, `-`, `*`, `/` | Expressions are passed through to JavaScript. |
| Print | `say <expr>` | Compiles to `console.log`. |

Statements are separated by newlines. Identifiers are letters only; numbers are
integers.

## Running it

Requires [Node.js](https://nodejs.org/).

```sh
node compiler.js
```

The program to run is currently the `input` string near the top of
[compiler.js](compiler.js) — edit it to try your own X.js code.

## Project status

Early and intentionally minimal. Known limitations:

- Only integer numbers and letter-only identifiers.
- No strings, booleans, conditionals, loops, or functions yet.
- Expressions are concatenated token-by-token rather than parsed into an
  expression tree.
- Output is executed with `eval`.

### Roadmap ideas

- String and boolean literals
- Proper expression parsing with operator precedence
- `if` / `else` and loops
- Functions
- A CLI that takes a `.x` source file instead of a hardcoded string

## License

MIT
