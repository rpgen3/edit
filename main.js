(async()=>{
    await import("https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ace.js");
    await Promise.all([
        "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0/ext-language_tools.js",
        "https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.10.0/beautify.js"
    ].map(v=>import(v)));
    const h = $('body').css({
        "text-align": "center",
        padding: "1em"
    });
    $('<div>').appendTo(h).prop('id','editor');
    const editor = ace.edit("editor",{
        theme: "ace/theme/monokai",
        mode: "ace/mode/javascript",
        minLines: 2
    });
    window.e = editor;
})();
