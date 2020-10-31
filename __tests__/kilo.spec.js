const Kilo = require('../src/kilo');

describe('Kilo', () => {
  it(' constructor() : can create new instance', () => {
    const k = new Kilo();
    expect(k).not.toBeNull();
    expect(k).toBeInstanceOf(Kilo);
    expect(k.E.cx).toEqual(0);
    expect(k.E.cy).toEqual(0);
    expect(k.E.erow).toEqual([]);
    expect(k.E.rowoff).toEqual(0);
    expect(k.E.erow.length).toEqual(0);
    expect(k.E.screenrows).not.toEqual(0);
    expect(k.E.screencols).not.toEqual(0);
  });
  it(' editorOpen() : can read all strings from file', () => {
    const k = new Kilo(['LICENSE']);
    expect(k.editorOpen).toBeInstanceOf(Function);
    k.editorOpen();
    expect(k.E.erow.length).toEqual(21);
    // no such file or directory
    const t = () => {
      let qi = new Kilo('__tests__/testData.csv');
      qi.editorOpen();
    };
    expect(t).toThrow(/no such file or directory/);
  });
  it(' enableRawMode() : can set tty from normal to raw mode', () => {
    const k = new Kilo();
    expect(k.enableRawMode).toBeInstanceOf(Function);
  });
  it(' disableRawMode() : can set tty from raw to normal mode', () => {
    const k = new Kilo();
    expect(k.disableRawMode).toBeInstanceOf(Function);
  });
  it(' editorScroll() : can culculate scroll', () => {
    const k = new Kilo();
    expect(k.editorScroll).toBeInstanceOf(Function);
  });
  it(' editorReadKey(str,key) : can switch regarding each input', () => {
    const k = new Kilo(['LICENSE']);
    k.E.screenrows = 10;
    k.E.screencols = 10;
    k.editorOpen();
    k.editorRefreshScreen = () => {};
    expect(k.editorReadKey).toBeInstanceOf(Function);
    // vertical cursor move
    k.editorReadKey('',{name:'down'});
    k.editorScroll();
    expect(k.E.cy).toEqual(1);

    k.editorReadKey('',{name:'pagedown'});
    k.editorScroll();
    expect(k.E.cy).toEqual(19);
    expect(k.E.rowoff).toEqual(10);

    k.editorReadKey('',{name:'down'});
    k.editorScroll();
    expect(k.E.cy).toEqual(20);
    expect(k.E.rowoff).toEqual(11);

    k.editorReadKey('',{name:'pagedown'});
    k.editorScroll();
    expect(k.E.cy).toEqual(21);
    expect(k.E.rowoff).toEqual(12);

    k.editorReadKey('',{name:'up'});
    k.editorScroll();
    expect(k.E.cy).toEqual(20);
    expect(k.E.rowoff).toEqual(12);

    k.editorReadKey('',{name:'pageup'});
    k.editorScroll();
    expect(k.E.cy).toEqual(2);
    expect(k.E.rowoff).toEqual(2);

    k.editorReadKey('',{name:'pageup'});
    k.editorScroll();
    expect(k.E.cy).toEqual(0);
    expect(k.E.rowoff).toEqual(0);

    // horizontal cursor move
    k.editorReadKey('',{name:'right'});
    k.editorScroll();
    expect(k.E.cx).toEqual(1);
    expect(k.E.coloff).toEqual(0);

    k.editorReadKey('',{name:'end'});
    k.editorScroll();
    expect(k.E.cx).toEqual(11);
    expect(k.E.coloff).toEqual(2);

    k.editorReadKey('',{name:'left'});
    k.editorScroll();
    expect(k.E.cx).toEqual(10);
    expect(k.E.coloff).toEqual(2);

    k.editorReadKey('',{name:'right'});
    k.editorScroll();
    expect(k.E.cx).toEqual(11);
    expect(k.E.coloff).toEqual(2);

    k.editorReadKey('',{name:'right'});
    k.editorScroll();
    expect(k.E.cy).toEqual(1);
    expect(k.E.cx).toEqual(0);
    expect(k.E.coloff).toEqual(0);

    k.editorReadKey('',{name:'left'});
    k.editorScroll();
    expect(k.E.cy).toEqual(0);
    expect(k.E.cx).toEqual(11);
    expect(k.E.coloff).toEqual(2);

    k.editorReadKey('',{name:'home'});
    k.editorScroll();
    expect(k.E.cy).toEqual(0);
    expect(k.E.cx).toEqual(0);
    expect(k.E.coloff).toEqual(0);

    k.editorReadKey('',{name:'down'});
    k.editorScroll();
    k.editorReadKey('',{name:'down'});
    k.editorScroll();
    k.editorReadKey('',{name:'end'});
    k.editorScroll();
    k.editorReadKey('',{name:'up'});
    k.editorScroll();
    expect(k.E.cy).toEqual(1);
    expect(k.E.cx).toEqual(0);
    expect(k.E.coloff).toEqual(0);
  });
  it(' editorRefreshScreen() : can refresh the screen', () => {
    const k = new Kilo();
    expect(k.editorRefreshScreen).toBeInstanceOf(Function);
  });
  it(' editorDrawStatusBar() : can draw lines', () => {
    const k = new Kilo(['LICENSE']);
    expect(k.editorDrawStatusBar).toBeInstanceOf(Function);
    expect(k.abuf.length).toBe(0);
    k.editorDrawStatusBar();
    expect(k.abuf.length).not.toBe(0);
  });
  it(' editorDrawMessageBar() : can draw lines', () => {
    const k = new Kilo(['LICENSE']);
    expect(k.editorDrawMessageBar).toBeInstanceOf(Function);
    expect(k.abuf.length).toBe(0);
    k.editorDrawMessageBar();
    expect(k.abuf.length).not.toBe(0);
  });
  it(' editorDrawRows() : can draw lines', () => {
    let k = new Kilo(['LICENSE']);
    k.E.screenrows = 100;
    k.E.screencols = 100;
    expect(k.editorDrawRows).toBeInstanceOf(Function);
    expect(k.abuf.length).toBe(0);
    k.editorDrawRows();
    expect(k.abuf.length).not.toBe(0);

    k = new Kilo(['LICENSE']);
    k.E.screenrows = 10;
    k.E.screencols = 10;
    expect(k.abuf.length).toBe(0);
    k.editorDrawRows();
    expect(k.abuf.length).not.toBe(0);

    k = new Kilo([]);
    k.E.screenrows = 100;
    k.E.screencols = 100;
    expect(k.abuf.length).toBe(0);
    k.editorDrawRows();
    expect(k.abuf.length).not.toBe(0);
  });
  it(' editorRowCxToRx() : can convert cx -> rx', () => {
    const k = new Kilo(['LICENSE']);
    expect(k.editorRowCxToRx).toBeInstanceOf(Function);
  });
  it(' editorMoveCursor() : can calculate proper cursor position', () => {
    const k = new Kilo(['LICENSE']);
    expect(k.editorMoveCursor).toBeInstanceOf(Function);
  });
});
