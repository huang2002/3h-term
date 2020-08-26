const AUTO_INDEX = -1;

export class TerminalHistory {
    /** dts2md break */
    private _history = new Array<string>();
    /** dts2md break */
    private _cursor = AUTO_INDEX;
    /** dts2md break */
    /**
     * Push an input record to the history
     */
    push(record: string) {
        this._history.push(record);
    }
    /** dts2md break */
    /**
     * Reset the history cursor position
     */
    resetCursor() {
        this._cursor = AUTO_INDEX;
    }
    /** dts2md break */
    /**
     * Get previous input (undefined if it doesn't exist)
     */
    getPrevious() {
        const { _history } = this;
        const { length: historySize } = _history;
        if (!historySize) {
            return;
        }
        const { _cursor } = this;
        if (_cursor === AUTO_INDEX) {
            this._cursor = historySize - 1;
            return _history[historySize - 1];
        } else if (_cursor > 0) {
            this._cursor--;
            return _history[_cursor - 1];
        }
    }
    /** dts2md break */
    /**
     * Get next input (undefined if it doesn't exist)
     */
    getNext() {
        const { _history } = this;
        const { length: historySize } = _history;
        const { _cursor } = this;
        if (!historySize || _cursor === AUTO_INDEX) {
            return;
        }
        if (_cursor < historySize) {
            this._cursor++;
            return _history[_cursor + 1];
        } else {
            this._cursor = AUTO_INDEX;
        }
    }

}
