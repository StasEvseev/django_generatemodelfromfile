(function(window, $) {



    $(function(){
        var maintable = $("#maintable");

        var listModelObject = new listModelConstr($("#list-model"), {records: [
            {title: 'Пользователи', id: 'users'},
            {title: 'Комнаты', id: 'rooms'}
        ]});

        var tableModelObject = new tableModelConstr(maintable, {fields: [
            {type: 'int', id: "aaaaa", title: 'Имя'},
            {type: 'char', id: "bbbbb", title: 'Зарплата'},
            {type: 'date', id: "ccccc", title: 'Дата поступления на работу'}

        ]});

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

    function listModelConstr(idel, initConfig) {
        this.ulList = idel;
        this.config = initConfig;
        this.listModel = initConfig['records'];

        this.initFunc = function() {
            this.render(this.listModel);
        };

        this.render = function(models) {
            this.ulList.empty();
            var ul = $("<ul>");
            for(var i = 0; i < models.length; i++) {
                var name = models[i]['id'];
                var li = $('<li>').text(models[i]['title']);
                (function(name) {
                    li.on('click', function(event) {
                        console.log(name);
                    });
                })(name);

                ul.append(li);
            }
            this.ulList.append(ul);
        };

        this.initFunc();

        return {

        }
    }

    var tableModelConstr = function(ids, initConfig) {
        this.table = ids;
        this.config = initConfig;

        

        this.create_table_from_structure = function(table, structure) {
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
    };

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