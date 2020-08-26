/// <reference types=".." />

const PROGRESS_COUNT = 10;
const PROGRESS_GAP = 250;
const SHINE_COLORS = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple'];
const SHINE_INTERVAL = 1000;

const HIGHLIGHT_STYLE = {
    color: '#FFF',
    fontWeight: 'bold',
};

/**
 * @param {number} milliseconds
 */
const sleep = milliseconds => new Promise(
    resolve => setTimeout(resolve, milliseconds)
);

/**
 * @type {Map<string, T.TerminalHandler>}
 */
const handlers = new Map([
    ['echo', input => {
        terminal.writeln(`"${input}"`);
    }],
    ['clear', () => {
        terminal.clear();
    }],
    ['prompt', value => {
        terminal.$prompt.setSync(value);
        terminal.writeln(`Prompt string set to "${value}"`);
    }],
    ['progress', async () => {
        for (let i = 0; i < PROGRESS_COUNT; i++) {
            if (i) {
                await sleep(PROGRESS_GAP);
                terminal.withdrawLine();
            }
            const progressBar = '#'.repeat(i + 1).padEnd(PROGRESS_COUNT, '-');
            terminal.writeln(
                `Progress Bar Test: [${progressBar}] ${i + 1}/${PROGRESS_COUNT}`
            );
        }
        terminal.writeln('Finished.');
    }],
    ['help', () => {
        terminal.write('Known commands: ');
        handlers.forEach((_, command) => {
            terminal.write(command);
            terminal.write(', ');
        });
        terminal.withdraw(); // delete last semi-colon and space
        terminal.writeln();
    }],
]);

const terminal = new T.Terminal(
    {
        margin: '1em auto',
        width: '80vw',
        height: '70vh',
        maxWidth: '800px',
        maxHeight: '600px',
        fontSize: '16px',
        borderRadius: '5px',
    },
    T.createProgram(handlers, input => {
        terminal.writeln(`Unknown operation: ${input}`);
    })
);

document.body.appendChild(terminal.container);

let shineColorIndex = 0;

const $shineColor = X.toReactive(SHINE_COLORS[shineColorIndex]);

setInterval(() => {
    shineColorIndex = (shineColorIndex + 1) % SHINE_COLORS.length;
    $shineColor.setSync(SHINE_COLORS[shineColorIndex]);
}, SHINE_INTERVAL);

terminal.write('This is a simple demo of ')
    .write('3h-term', {
        color: $shineColor,
        textShadow: '0 1px 0 #001',
    })
    .write('!')
    .writeln();

sleep(1000)
    .then(() => {
        terminal.write('Type ')
            .write('help', HIGHLIGHT_STYLE)
            .write(' and press ')
            .write('Enter', HIGHLIGHT_STYLE)
            .write(' to get help info.')
            .writeln();
    });
