(async()=>{
    await Promise.all([
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-language_tools.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.0/beautify.js"
    ].map(v=>import(v)));
    const h = $('body');
    $('<div>').appendTo(h).prop('id','editor').css({
        height: 600
    });
    var editor = ace.edit("editor");
    editor.$blockScrolling = Infinity;
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    window.e = editor;
})();
