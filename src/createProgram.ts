import { TerminalHandler } from './Terminal';

/**
 * Create a simple program that handles multiple commands
 * with corresponding handlers
 * @param handlers A map of command-handler pairs
 * @param defaultHandler Unknown command handler
 * @example
 * ```js
 * const handlers = new Map([
 *     ['help', showHelpInfo],
 *     ['exit', exitProgram],
 * ]);
 *
 * const defaultHandler = input => {
 *     terminal.writeln(`Unknown operation: "${input}"`);
 * };
 *
 * const program = T.createProgram(handlers, defaultHandler);
 *
 * const terminal = new T.Terminal(null, program);
 * ```
 */
export const createProgram = (
    handlers: Map<string, TerminalHandler>,
    defaultHandler?: TerminalHandler,
) => (
    input => new Promise((resolve, reject) => {

        const spaceIndex = input.indexOf(' ');
        const command = ~spaceIndex ? input.slice(0, spaceIndex) : input;
        const handler = handlers.get(command);

        let returnValue;

        if (handler) {
            returnValue = handler(input.slice(command.length + 1));
        } else if (defaultHandler) {
            returnValue = defaultHandler(input);
        } else {
            throw 'unhandled input!';
        }

        if (returnValue) {
            returnValue.then(resolve, reject);
        } else {
            resolve();
        }

    })
) as TerminalHandler;
