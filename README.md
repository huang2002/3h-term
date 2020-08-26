# term-js

> A terminal simulator in browser.

## Links

- [API Reference](https://github.com/huang2002/term-js/wiki)
- [License (MIT)](./LICENSE)

## Example

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>term-js example</title>
</head>

<body>
    <script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/super-x@1.0.0/dist/super-x.umd.min.js" defer="defer"></script>
    <script type="text/javascript" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/term-js@0.1.0/dist/term-js@0.1.0.umd.min.js" defer="defer"></script>
    <script>

        const handlers = new Map([
            ['echo', input => {
                terminal.writeln(`"${input}"`);
            }],
            ['clear', () => {
                terminal.clear();
            }],
        ]);

        const terminal = new T.Terminal(
            {
                margin: '1em auto',
                width: '480px',
                height: '320px',
                fontSize: '16px',
                borderRadius: '5px',
            },
            T.createProgram(handlers, input => {
                terminal.writeln(`Unknown operation: ${input}`);
            })
        );

        document.body.appendChild(terminal.container);

        terminal.write('This is an example of ')
            .write('term-js', {
                color: '#FFF',
                fontWeight: 'bold',
            })
            .write('.')
            .writeln();

    </script>
</body>

</html>
```