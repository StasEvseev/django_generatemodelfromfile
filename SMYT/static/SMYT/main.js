(function(window, $) {
    var maintable = $("#maintable");

    var create_table_from_structure = function(table, structure) {
        table.empty();
        var columns = [];
        for(var i = 0; i < structure['fields'].length; i++) {
            columns.push("<td>"+structure['fields'][i]+"<\td>");
            //table.eq(i).after('<tr><\tr>');
        //$('#myTable tr:last').after('<tr>...</tr><tr>...</tr>');
        }
        table.eq(0).after("<tr>"+ columns.join("") +"<\tr>");
    };

    create_table_from_structure(maintable, {'fields': ["a", "b", "c"]});

    console.log(maintable);
})(window, jQuery);