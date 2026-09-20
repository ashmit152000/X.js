# X.js

A tiny toy programming language that compiles to JavaScript.

X.js is a learning project that walks through the classic stages of a compiler:
source text → **tokens** → **AST** → **generated JavaScript** → execution. It's
small on purpose — the goal is to understand how languages work, not to ship a
production runtime.

## Example

```
a = 10
b = 2.5
name = "X.js"
say name
say -a * b + 1
```

Output:

```
X.js
-24
```

## How it works

The pipeline lives in four files:

| Stage | File | Responsibility |
| --- | --- | --- |
| Lexer | [lexer.js](lexer.js) | Scans raw source and produces a flat list of tokens (identifiers, keywords, numbers, strings, operators, punctuation, newlines). |
| Parser | [ast.js](ast.js) | Consumes tokens and builds an Abstract Syntax Tree (`PROGRAM` with `DECLARATION` and `LOG` nodes). |
| Expression parser | [precedenceHandler.js](precedenceHandler.js) | Recursive-descent expression parsing that respects operator precedence. |
| Compiler | [compiler.js](compiler.js) | Walks the AST, emits equivalent JavaScript, and runs it with `eval`. |

Supporting files: [lexeme_caterogy.js](lexeme_caterogy.js) defines the token
types and maps characters to them, and [keywords.js](keywords.js) lists reserved
words.

### 1. Lexing

`lexer(input)` returns tokens carrying a `type`, `value`, `line` and `column`:

```js
[
  { type: 'identifier', value: 'a', line: 1, column: 1 },
  { type: 'equal',      value: '=', line: 1, column: 3 },
  { type: 'number',     value: 10,  line: 1, column: 6 },
  { type: 'newline',    value: '\n', line: 1, column: 6 },
  // ...
]
```

- Whitespace is skipped; newlines are emitted as tokens.
- Numbers may be integers or floats (`10`, `2.5`). A trailing dot such as `2.`
  is an error.
- Strings are double-quoted (`"hello"`). An unterminated string is an error.
- `// ...` starts a line comment.
- Two-character operators (`==`, `!=`, `>=`, `<=`) are recognized.
- Reserved words (see [keywords.js](keywords.js)) get their own token types;
  only `say` is currently wired up in the parser.
- Any unrecognized character throws an `Unexpected token` error.

### 2. Parsing and operator precedence

`ast(tokens)` builds the statement-level tree. Each right-hand side / `say`
argument is parsed by `parseTerm` from
[precedenceHandler.js](precedenceHandler.js), which uses one function per
precedence level (lowest binds loosest, highest binds tightest):

| Function | Handles | Notes |
| --- | --- | --- |
| `parseTerm` | `+`, `-` (binary) | Left-associative. |
| `parseFactor` | `*`, `/` | Left-associative; operands come from `parseUnary`. |
| `parseUnary` | `-`, `!` (prefix) | Right-recursive, so `--x` works. |
| `parsePrimary` | `( ... )`, literals, identifiers | Parentheses restart parsing at `parseTerm`. A missing `)` throws `Closing parenthesis required`. |

So `1 + 2 * 3` parses as `1 + (2 * 3)`, and `-10 * (5 + 2)` parses as:

```js
{
  type: 'LOG',
  name: 'say',
  value: {
    type: 'BINARY_EXPRESSION',
    operator: '*',
    left:  { type: 'UNARY_EXPRESSION', operator: '-',
             operand: { type: 'NUMBER_LITERAL', value: 10 } },
    right: { type: 'BINARY_EXPRESSION', operator: '+',
             left:  { type: 'NUMBER_LITERAL', value: 5 },
             right: { type: 'NUMBER_LITERAL', value: 2 } }
  }
}
```

Expression node types: `NUMBER_LITERAL`, `STRING_LITERAL`, `IDENTIFIER`,
`BINARY_EXPRESSION`, `UNARY_EXPRESSION`.

Statement node types: `DECLARATION` (`name`, `value`) and `LOG` (`say`).

### 3. Compiling

The compiler turns each node into JavaScript:

- `DECLARATION` → `name = <expr>`
- `LOG` → `console.log(<expr>)`
- Literals, identifiers, binary and unary expressions are emitted recursively.
  Strings are emitted double-quoted.

The generated source is then executed with `eval`.

## Language reference

| Feature | Syntax | Notes |
| --- | --- | --- |
| Assignment | `x = <expr>` | One statement per line. |
| Numbers | `10`, `2.5` | Integers and floats. |
| Strings | `"hello"` | Double-quoted, no escape sequences. |
| Arithmetic | `+`, `-`, `*`, `/` | Standard precedence: `*` `/` before `+` `-`. |
| Unary | `-x`, `!x` | Binds tighter than `*` and `/`. |
| Grouping | `( <expr> )` | Overrides precedence. |
| Print | `say <expr>` | Compiles to `console.log`. |
| Comments | `// comment` | To end of line. |

Statements are separated by newlines. Identifiers are letters only (no digits or
underscores).

## Running it

Requires [Node.js](https://nodejs.org/).

```sh
node compiler.js
```

The program to run is currently the `input` string near the top of
[compiler.js](compiler.js) — edit it to try your own X.js code. The script also
prints the tokens, the AST and the generated JavaScript before running it.

## Project status

Early and intentionally minimal. Known limitations:

- The compiler does not emit parentheses, so grouping is lost in the generated
  JavaScript: `say -10 * (5 + 2)` compiles to `-10 * 5 + 2`. The parser builds
  the correct tree; the fix belongs in `compileExpression`.
- Comparison operators (`==`, `!=`, `<`, `>`, `<=`, `>=`) are lexed but not yet
  parsed.
- Keywords such as `const`, `if`, `while` and `fun` are reserved but have no
  parser support yet. There are no booleans, conditionals, loops, or functions.
- Identifiers are letters only.
- Output is executed with `eval`.

### Roadmap ideas

- Preserve grouping when compiling expressions
- Comparison and logical operators (`and`, `or`) in the expression parser
- Boolean literals
- `if` / `else` and loops
- Functions
- A CLI that takes a `.x` source file instead of a hardcoded string

## License

MIT
