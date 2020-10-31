const readline = require('readline');
const pkg = require('../package');
const fs = require('fs');
const os = require('os');

class Kilo {
  constructor(argv){
    readline.emitKeypressEvents(process.stdin);
    if(argv && argv.length>0){
      this.file = argv[0];
    }
    this.E = {
      cx : 0,
      cy : 0,
      erow : [],
      rowoff : 0,
      coloff : 0,
      screenrows : process.stdout.rows,
      screencols : process.stdout.columns
    };
    this.abuf = '';
  }
  enableRawMode() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
  }

  disableRawMode() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.resume();
    }
  }

  editorOpen() {
    this.E.erow = fs.readFileSync(this.file, 'utf8').trim().split(os.EOL);
  }

  editorScroll() {
    if (this.E.cy < this.E.rowoff) {
      this.E.rowoff = this.E.cy;
    }
    if (this.E.cy >= this.E.rowoff + this.E.screenrows) {
      this.E.rowoff = this.E.cy - this.E.screenrows + 1;
    }
    if (this.E.cx < this.E.coloff) {
      this.E.coloff = this.E.cx;
    }
    if (this.E.cx >= this.E.coloff + this.E.screencols) {
      this.E.coloff = this.E.cx - this.E.screencols + 1;
    }
  }

  editorRefreshScreen() {
    this.editorScroll();
    this.abuf += "\x1b[?25l";
    this.abuf += "\x1b[H";
    this.editorDrawRows();
    this.abuf += `\x1b[${(this.E.cy - this.E.rowoff) + 1};${(this.E.cx - this.E.coloff) + 1}H`; //cursor
    this.abuf += "\x1b[?25h";
    process.stdout.write(this.abuf, this.abuf.length);
    this.abuf = '';
  }

  editorReadKey(str, key) {
    switch (key.name) {
      case 'q':
        if (key.ctrl) {
          this.abuf = '';
          process.stdout.write("\x1b[2J", 4);
          process.stdout.write("\x1b[H", 3);
          this.disableRawMode();
          process.exit();
        }
        break;
      case 'home':
        this.E.cx = 0;
        break;
      case 'end':
        {
          let times = (this.E.cy >= this.E.erow.length) ? this.E.screencols : this.E.erow[this.E.cy].length;
          while (times--) this.editorMoveCursor('right');
        }
        break;
      case 'pageup':
      case 'pagedown':
        {
          let times = this.E.screenrows;
          while (times--) this.editorMoveCursor(key.name == 'pageup' ? 'up' : 'down');
        }
        break;
      case 'h':
      case 'left':
      case 'l':
      case 'right':
      case 'k':
      case 'up':
      case 'j':
      case 'down':
        this.editorMoveCursor(key.name);
    }
    this.editorRefreshScreen();
  }

  editorMoveCursor(key) {
    let row = (this.E.cy >= this.E.erow.length) ? undefined : this.E.erow[this.E.cy];
    switch (key) {
      case 'h':
      case 'left':
        if (this.E.cx > 0) this.E.cx--;
        break;
      case 'l':
      case 'right':
        if(row && this.E.cx < row.length)this.E.cx++;
        break;
      case 'k':
      case 'up':
        if (this.E.cy > 0) this.E.cy--;
        break;
      case 'j':
      case 'down':
        if (this.E.cy < this.E.erow.length) this.E.cy++;
        break;
    }
    row = (this.E.cy >= this.E.erow.length) ? undefined : this.E.erow[this.E.cy];
    const rowlen = row ? row.length : 0;
    if (this.E.cx > rowlen) {
      this.E.cx = rowlen;
    }
  }

  editorDrawRows() {
    for (let y = 0; y < this.E.screenrows; y++) {
      let filerow = y + this.E.rowoff;
      if (filerow >= this.E.erow.length) {
        if (this.E.erow.length == 0 && y == parseInt(this.E.screenrows / 3)) {
          const welcome = `Kilo editor -- version ${pkg.version}`;
          let welcomlen = welcome.length;
          if (welcomlen > this.E.screencols) welcomlen = this.E.screencols;
          let padding = parseInt((this.E.screencols - welcomlen) / 2);
          if (padding > 0) {
            this.abuf += "~";
            padding--;
          }
          while (padding-- > 0) this.abuf += " ";
          this.abuf += welcome;
        } else {
          this.abuf += "~";
        }
      } else {
        let len = this.E.erow[filerow].length - this.E.coloff;
        if(len < 0) len = 0;
        if (len > this.E.screencols) len = this.E.screencols;
        this.abuf += this.E.erow[filerow].substring(this.E.coloff,this.E.coloff+len);
      }
      this.abuf += "\x1b[K";
      if (y < this.E.screenrows - 1) {
        this.abuf += os.EOL;
      }
    }
  }

  main() {
    this.enableRawMode();
    if (this.file !== undefined) {
      this.editorOpen();
    }
    this.editorRefreshScreen();
    process.stdin.on('keypress', this.editorReadKey.bind(this));
  }
}
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
  module.exports = Kilo;
} else {
  window.Kilo = Kilo;
}
