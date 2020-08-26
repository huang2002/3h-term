/// <reference types="super-x" />
import { TerminalHistory } from './TerminalHistory';

let _inputCount = 0;
/**
 * Type of terminal input handlers
 */
export type TerminalHandler = (input: string) => void | Promise<void>;
/** dts2md break */
export class Terminal {
    /** dts2md break */
    /**
     * Class name of terminal containers
     */
    static CONTAINER_CLASS = X.createClass({
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        margin: '0',
        padding: '0',
        fontFamily: 'monospace',
        fontSize: '1em',
        lineHeight: '1.6em',
        whiteSpace: 'pre-wrap',
    }, {
        ' *::selection': {
            backgroundColor: 'rgba(255,255,255,.2)',
        },
    });
    /** dts2md break */
    /**
     * Class of terminal screens
     */
    static SCREEN_CLASS = X.createClass({
        flex: '1',
        margin: '0',
        padding: '.5em .8em 1em',
        fontSize: '1em',
        overflow: 'auto',
    });
    /** dts2md break */
    /**
     * Class of terminal lines
     */
    static LINE_CLASS = X.createClass({
        margin: '0',
        padding: '0',
        fontSize: '1em',
    });
    /** dts2md break */
    /**
     * Class of terminal input containers
     */
    static INPUT_CONTAINER_CLASS = X.createClass({
        display: 'flex',
        margin: '0',
        padding: '.2em .8em',
        fontSize: '1em',
    });
    /** dts2md break */
    /**
     * Class of terminal input prompt strings
     */
    static PROMPT_CLASS = X.createClass({
        display: 'inline-block',
        margin: '0',
        padding: '0',
        fontSize: '1em',
        outline: 'none',
    });
    /** dts2md break */
    /**
     * Class of terminal inputs
     */
    static INPUT_CLASS = X.createClass({
        display: 'inline-block',
        flex: '1',
        margin: '0',
        padding: '0',
        color: 'inherit',
        fontFamily: 'inherit',
        fontSize: '1em',
        lineHeight: 'inherit',
        background: 'none',
        border: 'none',
        outline: 'none',
    });
    /** dts2md break */
    /**
     * Terminal constructor
     */
    constructor(
        containerStyle?: X.StyleProperties | null,
        handler?: TerminalHandler | null
    ) {

        if (handler) {
            this.handler = handler;
        }

        const style = {
            backgroundColor: this.$background,
            color: this.$foreground,
        };

        if (containerStyle) {
            Object.assign(style, containerStyle);
        }

        this.container = X.createElement('div', {
            class: Terminal.CONTAINER_CLASS,
            style,
        },
            this.screen,
            X.createElement('form', {
                action: 'javascript:;',
                class: Terminal.INPUT_CONTAINER_CLASS,
                style: {
                    borderTop: this.$split,
                },
            },
                X.createElement('label', {
                    for: this.input.id,
                    class: Terminal.PROMPT_CLASS,
                },
                    this.$prompt,
                ),
                this.input,
            )
        );

    }
    /** dts2md break */
    /**
     * The color of terminal background
     */
    readonly $background = X.toReactive('#334');
    /** dts2md break */
    /**
     * The color of terminal foreground
     */
    readonly $foreground = X.toReactive('#EEE');
    /** dts2md break */
    /**
     * The color of input prompt
     */
    readonly $prompt = X.toReactive('> ');
    /** dts2md break */
    /**
     * The style of terminal split (between screen and input)
     */
    readonly $split = X.toReactive('solid 1px #445');
    /** dts2md break */
    /**
     * Input history
     */
    history = new TerminalHistory();
    /** dts2md break */
    /**
     * Input handler
     */
    handler?: TerminalHandler | null = null;
    /** dts2md break */
    /**
     * Whether to echo inputs
     * @default true
     */
    echo = true;
    /** dts2md break */
    /**
     * Whether to ignore empty inputs
     * @default true
     */
    ignoreEmptyInput = true;
    /** dts2md break */
    /**
     * Internal hook
     */
    onInputKeydown = this._onInputKeydown.bind(this);
    /** dts2md break */
    /**
     * The element reference of the last line in screen
     */
    protected _lastLine = X.createElement('p', {
        class: Terminal.LINE_CLASS,
    });
    /** dts2md break */
    /**
     * Internal pending flag
     */
    protected _pending = false;
    /** dts2md break */
    /**
     * Whether the terminal is waiting for some handler to finish
     * (input submission is rejected when a terminal is in pending status)
     */
    get pending() {
        return this._pending;
    }
    /** dts2md break */
    /**
     * Screen element
     */
    readonly screen = X.createElement('div', {
        class: Terminal.SCREEN_CLASS,
    },
        this._lastLine,
    );
    /** dts2md break */
    /**
     * Input element
     */
    readonly input = X.createElement('input', {
        id: `term-input-${_inputCount++}`,
        class: Terminal.INPUT_CLASS,
        listeners: {
            keydown: this.onInputKeydown,
        },
    }) as HTMLInputElement;
    /** dts2md break */
    /**
     * Container element
     */
    readonly container: HTMLElement;
    /** dts2md break */
    private _onInputKeydown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter': {
                event.preventDefault();
                if (!this._pending) {
                    this.onInputSubmit();
                }
                break;
            }
            case 'Escape': {
                event.preventDefault();
                this.input.value = '';
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const lastCommand = this.history.getPrevious();
                if (lastCommand !== undefined) {
                    this.input.value = lastCommand;
                }
                break;
            }
            case 'ArrowDown': {
                event.preventDefault();
                const lastCommand = this.history.getNext();
                this.input.value = (
                    lastCommand === undefined
                        ? ''
                        : lastCommand
                );
                break;
            }
        }
    }
    /** dts2md break */
    /**
     * Internal hook
     */
    onInputSubmit() {

        const { input } = this;
        const { value } = input;

        if (!value && this.ignoreEmptyInput) {
            return;
        }

        if (this.echo) {
            this.writeln()
                .writeln(this.$prompt.current + value);
        }

        const { handler } = this;
        if (handler) {
            this._pending = true;
            const returnValue = handler(value);
            if (returnValue) {
                returnValue.then(() => {
                    this._pending = false;
                });
            } else {
                this._pending = false;
            }
        }

        const { history } = this;
        history.push(value);
        history.resetCursor();

        input.value = '';

    }
    /** dts2md break */
    /**
     * Write(Append) some data to the last line
     */
    write(data: unknown, style?: X.StyleProperties) {
        const props = style ? { style } : null;
        this._lastLine.appendChild(
            X.createElement('span', props, data)
        );
        this._lastLine.scrollIntoView();
        return this;
    }
    /** dts2md break */
    /**
     * Similar to `write()`, but begins a new line AFTER writting
     */
    writeln(data?: unknown, style?: X.StyleProperties) {
        const { _lastLine } = this;
        if (
            (data === undefined || data === '')
            && !_lastLine.childNodes.length
        ) {
            this.screen.insertBefore(X.createElement('br'), _lastLine);
        } else {
            if (data !== undefined) {
                this.write(data, style);
            }
            const newLine = X.createElement('p', {
                class: Terminal.LINE_CLASS,
            });
            this.screen.appendChild(newLine);
            this._lastLine = newLine;
        }
        this._lastLine.scrollIntoView();
        return this;
    }
    /** dts2md break */
    /**
     * Withdraw one or some writing operations
     * (only works in the last line)
     */
    withdraw(count = 1) {
        const { _lastLine } = this;
        const { childNodes: spans } = _lastLine;
        for (let i = 0; i < count; i++) {
            if (!spans.length) {
                break;
            }
            _lastLine.removeChild(spans[spans.length - 1]);
        }
        return this;
    }
    /** dts2md break */
    /**
     * Withdraw one or more lines
     */
    withdrawLine(count = 1) {
        const { screen } = this;
        const { childNodes: lines } = screen;
        for (let i = 0; i < count; i++) {
            if (lines.length < 2) {
                break;
            }
            screen.removeChild(lines[lines.length - 2]);
        }
        return this;
    }
    /** dts2md break */
    /**
     * Clear the screen
     */
    clear() {
        this.screen.innerHTML = '';
        const newLine = X.createElement('p', {
            class: Terminal.LINE_CLASS,
        });
        this.screen.appendChild(newLine);
        this._lastLine = newLine;
        return this;
    }
}
