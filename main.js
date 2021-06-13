(async()=>{
    const isMobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
    const rpgen3 = await Promise.all([
        'input'
    ].map(v=>import(`https://rpgen3.github.io/mylib/export/${v}.mjs`))).then(v=>Object.assign({},...v));
    await Promise.all([
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.0/beautify.js"
    ].map(v=>import(v)));
    const getScript = url => new Promise((resolve, reject)=>$.getScript(url).done(resolve).fail(reject));
    await getScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js");
    await getScript("https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-language_tools.js");
    const body = 'body';
    $('<div>').appendTo(body).prop('id','editor');
    const editor = ace.edit('editor');
    editor.$blockScrolling = Infinity;
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
    $('textarea').on('input', e => {
        if(!isShape()) return;
        if(!/^[a-zA-Z0-9]{1}$/.test(e.originalEvent.data)) return;
        const obj = beautify({
            indent_with_tabs: true,
            max_preserve_newlines: 2
        });
        input(obj);
        log.add(obj);
    });
    const beautify = option => {
        const sign = '\0\0\0';
        editor.session.insert(editor.getCursorPosition(), sign);
        const rst = js_beautify(editor.session.getValue(), option),
              str = rst.replace(sign,''),
              ar = rst.slice(0, rst.indexOf(sign)).split('\n'),
              pos = {
                  row: ar.length - 1,
                  column: ar.pop().length
              };
        return {str, pos};
    };
    $('textarea').on('keydown', e => {
        if(!e.ctrlKey) return;
        switch(e.key){
            case 'z': undo(); break;
            case 'Z': redo(); break;
            default: return;
        }
        return false;
    });
    const input = arg => {
        if(!arg) return;
        const {str, pos} = arg;
        editor.session.setValue(str);
        editor.moveCursorToPosition(pos);
    };
    const log = new class {
        constructor() {
            this.now = null;
            this.add(null);
        }
        add(data) {
            this.now = {
                data, prev: this.now
            };
            if(this.now.prev) this.now.prev.next = this.now;
        }
        undo() {
            return this.now.prev ? (this.now = this.now.prev).data : null;
        }
        redo() {
            return this.now.next ? (this.now = this.now.next).data : null;
        }
    }
    const undo = () => input(log.undo()),
          redo = () => input(log.redo());
    const hUI = $('<div>').prependTo(body);
    const addBtn = (ttl, func) => $('<button>').appendTo(hUI).text(ttl).on('click', func);
    addBtn('undo', undo);
    addBtn('redo', redo);
    const isShape = rpgen3.addInputBool(hUI,{
        label: '自動整形',
        save: true,
        value: true
    });
    $('#editor').css({
        height: Math.floor(100 - 100 * hUI.height() / $(window).height()) + 'vh'
    });
})();
