//called with every property and it's value
function process(key,value) {
    const items = [];
    if (typeof(value !== 'object')) {
     debugger;
     items.push( "<li id='" + key + "'>" + value + "</li>" );
    }
      $( "<ul/>", {
        "class": "data-list",
        html: items.join( "" )
      }).appendTo( ".container" );
}

function traverse(o,func) {
    for (let i in o) {
        func.apply(this,[i,o[i]]);
        if (o[i] !== null && typeof(o[i])=="object") {
            //going on step down in the object tree!!
            traverse(o[i],func);
        }
    }
}

$.getJSON( "facebook.json", function( data ) {
  traverse(data, process);
});
