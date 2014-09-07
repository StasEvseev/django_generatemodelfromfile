(function(window, $) {



    $(function(){
        var maintable = $("#maintable");

        var listModelObject = new listModelConstr($("#list-model"), [
            {title: 'Пользователи', id: 'users'},
            {title: 'Комнаты', id: 'rooms'}
        ]);


        create_table_from_structure(maintable, {
            fields: [
                {type: 'int', id: "aaaaa", title: 'Имя'},
                {type: 'char', id: "bbbbb", title: 'Зарплата'},
                {type: 'date', id: "ccccc", title: 'Дата поступления на работу'}
            ],
            records: [
                {aaaaa: "1", bbbbb: "2", ccccc: "3"},
                {aaaaa: "4", bbbbb: "5", ccccc: "6"},
                {aaaaa: "7", bbbbb: "8", ccccc: "9"}
            ]
        });
    });

    function listModelConstr(idel, listModels) {
        var ulList = idel;
        var models = listModels;
        var currentItm = listModels[0];
        render(models);

        var render = function(models) {
            var ul = $("<ul>");
            for(var i = 0; i < models.length; i++) {
                ul.append($('<li>').text(models[i]['title']));
            }
            ulList.append(ul);
        }
    }

    var create_table_from_structure = function(table, structure) {
        table.empty();

        var fields = [];
        var tr = $('<tr>');
        table.append($('<thead>')
            .append(tr));
        for(var i = 0; i < structure['fields'].length; i++) {
            fields.push(structure['fields'][i]['id']);
            tr.append($('<td>').append(
                $('<div>').text(structure['fields'][i]['title'])));
        }

        for(var i = 0; i < structure['records'].length; i++) {
            tr = $('<tr>');
            table.append($('<tbody>').append(tr));
            for(var c = 0; c < fields.length; c++) {
                tr.append($('<td>').append($('<div>').text(
                    structure["records"][i][fields[c]]
                )));
            }

        }
    };
})(window, jQuery);