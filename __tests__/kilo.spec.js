"use strict";
const Kilo = require("../src/kilo");

describe("Kilo", () => {
    const variables = {};

    it(" constructor() : can create new instance", () => {
        expect(variables.k).not.toBeNull();
        expect(variables.k).toBeInstanceOf(Kilo);
        expect(variables.k.E.cx).toEqual(0);
        expect(variables.k.E.cy).toEqual(0);
        expect(variables.k.E.erow).toEqual([]);
        expect(variables.k.E.rowoff).toEqual(0);
        expect(variables.k.E.erow.length).toEqual(0);
        expect(variables.k.E.screenrows).not.toEqual(0);
        expect(variables.k.E.screencols).not.toEqual(0);
    });
    it(" editorOpen() : can read all strings from file", () => {
        expect(variables.k.editorOpen).toBeInstanceOf(Function);
        variables.k.editorOpen();
        expect(variables.k.E.erow.length).toEqual(21);

        // no such file or directory
        expect(() => {
            const qi = new Kilo(["__tests__/testData.csv"]);

            qi.editorOpen();
        }).toThrow(/no such file or directory/u);
    });
    it(" editorSave() : can save properly", () => {
        expect(variables.k.editorSave).toBeInstanceOf(Function);
        variables.k.editorOpen();
        variables.k.editorSave();
        expect(variables.k.E.statusmsg).toEqual("1083 bytes written to disk");

        variables.k = new Kilo(["__test__/testData.csv"]);
        variables.k.editorSave();
        expect(variables.k.E.statusmsg).toEqual("Error:ENOENT: no such file or directory, open '__test__/testData.csv'");
    });
    it(" enableRawMode() : can set tty from normal to raw mode", () => {
        expect(Kilo.enableRawMode).toBeInstanceOf(Function);
        Kilo.enableRawMode();
    });
    it(" disableRawMode() : can set tty from raw to normal mode", () => {
        expect(Kilo.disableRawMode).toBeInstanceOf(Function);
        Kilo.disableRawMode();
    });
    it(" editorScroll() : can culculate scroll", () => {
        expect(variables.k.editorScroll).toBeInstanceOf(Function);
    });
    it(" editorReadKey(str,key) : can switch regarding each input", () => {
        variables.k.E.screenrows = 10;
        variables.k.E.screencols = 10;
        variables.k.editorOpen();
        variables.k.editorRefreshScreen = () => {};
        expect(variables.k.editorReadKey).toBeInstanceOf(Function);

        // vertical cursor move
        variables.k.editorReadKey("", { name: "down" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(1);

        variables.k.editorReadKey("", { name: "pagedown" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(19);
        expect(variables.k.E.rowoff).toEqual(10);

        variables.k.editorReadKey("", { name: "down" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(20);
        expect(variables.k.E.rowoff).toEqual(11);

        variables.k.editorReadKey("", { name: "pagedown" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(21);
        expect(variables.k.E.rowoff).toEqual(12);

        variables.k.editorReadKey("", { name: "up" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(20);
        expect(variables.k.E.rowoff).toEqual(12);

        variables.k.editorReadKey("", { name: "pageup" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(2);
        expect(variables.k.E.rowoff).toEqual(2);

        variables.k.editorReadKey("", { name: "pageup" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(0);
        expect(variables.k.E.rowoff).toEqual(0);

        // horizontal cursor move
        variables.k.editorReadKey("", { name: "right" });
        variables.k.editorScroll();
        expect(variables.k.E.cx).toEqual(1);
        expect(variables.k.E.coloff).toEqual(0);

        variables.k.editorReadKey("", { name: "end" });
        variables.k.editorScroll();
        expect(variables.k.E.cx).toEqual(11);
        expect(variables.k.E.coloff).toEqual(2);

        variables.k.editorReadKey("", { name: "left" });
        variables.k.editorScroll();
        expect(variables.k.E.cx).toEqual(10);
        expect(variables.k.E.coloff).toEqual(2);

        variables.k.editorReadKey("", { name: "right" });
        variables.k.editorScroll();
        expect(variables.k.E.cx).toEqual(11);
        expect(variables.k.E.coloff).toEqual(2);

        variables.k.editorReadKey("", { name: "right" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(1);
        expect(variables.k.E.cx).toEqual(0);
        expect(variables.k.E.coloff).toEqual(0);

        variables.k.editorReadKey("", { name: "left" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(0);
        expect(variables.k.E.cx).toEqual(11);
        expect(variables.k.E.coloff).toEqual(2);

        variables.k.editorReadKey("", { name: "home" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(0);
        expect(variables.k.E.cx).toEqual(0);
        expect(variables.k.E.coloff).toEqual(0);

        variables.k.editorReadKey("", { name: "down" });
        variables.k.editorScroll();
        variables.k.editorReadKey("", { name: "down" });
        variables.k.editorScroll();
        variables.k.editorReadKey("", { name: "end" });
        variables.k.editorScroll();
        variables.k.editorReadKey("", { name: "up" });
        variables.k.editorScroll();
        expect(variables.k.E.cy).toEqual(1);
        expect(variables.k.E.cx).toEqual(0);
        expect(variables.k.E.coloff).toEqual(0);
    });
    it(" editorRefreshScreen() : can refresh the screen", () => {
        expect(variables.k.editorRefreshScreen).toBeInstanceOf(Function);
        variables.k.editorRefreshScreen();
    });
    it(" editorDrawStatusBar() : can draw lines", () => {
        expect(variables.k.editorDrawStatusBar).toBeInstanceOf(Function);
        expect(variables.k.abuf.length).toBe(0);
        variables.k.editorDrawStatusBar();
        expect(variables.k.abuf.length).not.toBe(0);
    });
    it(" editorDrawMessageBar() : can draw lines", () => {
        expect(variables.k.editorDrawMessageBar).toBeInstanceOf(Function);
        expect(variables.k.abuf.length).toBe(0);
        variables.k.editorDrawMessageBar();
        expect(variables.k.abuf.length).not.toBe(0);
    });
    it(" editorDrawRows() : can draw lines", () => {
        variables.k.E.screenrows = 100;
        variables.k.E.screencols = 100;
        expect(variables.k.editorDrawRows).toBeInstanceOf(Function);
        expect(variables.k.abuf.length).toBe(0);
        variables.k.editorDrawRows();
        expect(variables.k.abuf.length).not.toBe(0);

        variables.k = new Kilo(["LICENSE"]);
        variables.k.E.screenrows = 10;
        variables.k.E.screencols = 10;
        expect(variables.k.abuf.length).toBe(0);
        variables.k.editorDrawRows();
        expect(variables.k.abuf.length).not.toBe(0);

        variables.k = new Kilo([]);
        variables.k.E.screenrows = 100;
        variables.k.E.screencols = 100;
        expect(variables.k.abuf.length).toBe(0);
        variables.k.editorDrawRows();
        expect(variables.k.abuf.length).not.toBe(0);
    });
    it(" editorRowCxToRx() : can convert cx -> rx", () => {
        expect(Kilo.editorRowCxToRx).toBeInstanceOf(Function);
        expect(Kilo.editorRowCxToRx("", 0)).toEqual(0);
    });
    it(" editorUpdateSyntax() : can markup and colored properly", () => {
        expect(Kilo.editorUpdateSyntax).toBeInstanceOf(Function);
        expect(Kilo.editorUpdateSyntax("test")).toEqual("test");
    });
    it(" editorMoveCursor() : can calculate proper cursor position", () => {
        variables.k.editorMoveCursor("up");

        expect(variables.k.editorMoveCursor).toBeInstanceOf(Function);
    });
    it(" die() : can exit with proper status code", () => {
        expect(variables.k.die).toBeInstanceOf(Function);
        variables.k.die();

    });
    it(" editorDelChar() : can delete char", () => {
        expect(variables.k.editorDelChar).toBeInstanceOf(Function);
        variables.k.editorDelChar();

    });
    it(" editorInsertRow(insert) : can insert row", () => {
        expect(variables.k.editorInsertRow).toBeInstanceOf(Function);
        variables.k.editorInsertRow();

    });
    it(" editorInsertChar(c) : can insert c", () => {
        expect(variables.k.editorInsertChar).toBeInstanceOf(Function);
        variables.k.editorInsertChar("");

    });
    it(" editorRowDelChar(at) : can delete char at 'at'", () => {
        expect(variables.k.editorRowDelChar).toBeInstanceOf(Function);
        variables.k.editorRowDelChar(0);

    });
    it(" editorRowInsertChar(at,c) : can insert char at 'at'", () => {
        expect(variables.k.editorRowInsertChar).toBeInstanceOf(Function);
        variables.k.editorRowInsertChar(0, "");

    });
    it(" main : can run properly", () => {
        expect(variables.k.main).toBeInstanceOf(Function);
        variables.k.main();
    });
    beforeEach(() => {
        variables.k = new Kilo(["LICENSE"]);
    });
    afterEach(() => {
        delete variables.k;
    });
    beforeAll(() => {
        variables.error = console.error;
        variables.exit = process.exit;
        variables.cursorTo = process.stdout.cursorTo;
        variables.clearScreenDown = process.stdout.clearScreenDown;
        variables.isTTY = process.stdin.isTTY;
        variables.setRawMode = process.stdin.setRawMode;
        variables.resume = process.stdin.resume;
        variables.write = process.stdout.write;
        variables.outon = process.stdout.on;
        variables.inon = process.stdin.on;

        console.error = str => {};
        process.exit = status => {};
        process.stdout.cursorTo = (x, y) => {};
        process.stdout.clearScreenDown = () => {};
        process.stdin.isTTY = true;
        process.stdin.setRawMode = b => {};
        process.stdin.resume = () => {};
        process.stdout.write = (buf, len) => {};
        process.stdout.on = func => {};
        process.stdin.on = func => {};
    });
    afterAll(() => {
        console.error = variables.error;
        process.exit = variables.exit;
        process.stdout.cursorTo = variables.cursorTo;
        process.stdout.clearScreenDown = variables.clearScreenDown;
        process.stdin.isTTY = variables.isTTY;
        process.stdin.setRawMode = variables.setRawMode;
        process.stdin.resume = variables.resume;
        process.stdout.write = variables.write;
        process.stdout.on = variables.outon;
        process.stdin.on = variables.inon;
    });
});
