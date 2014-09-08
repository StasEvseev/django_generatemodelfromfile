(function(window, $) {



    $(function(){
        var mainTableEl = $("#maintable");
        var listModelEl = $("#list-model");

        var listModelObject = new ListModelConstr(listModelEl, {records: [
            {title: 'Пользователи', id: 'users'},
            {title: 'Комнаты', id: 'rooms'}
        ]});

        var tableModelObject = new TableModelConstr(mainTableEl, {});

        listModelEl.on("click-item", function(event, type) {
            $.ajax({
                url: "/smyt/" + type + "/",
                success: function(data) {
                    tableModelObject.init({fields: data['meta']['fields'], records: data['records']});
                },
                failure: function() {

                }
            });
        });

    });

    function ListModelConstr(idel, initConfig) {
        this.ulList = idel;
        this.config = initConfig;
        this.listModel = initConfig['records'];

        this.initFunc = function() {
            this.render(this.listModel);
        };

        this.initLiItem = function(el) {
            el.css({cursor: 'pointer'});
        };

        this.selItem = function(el) {
            el.css({'font-weight': 'bold'});
        };

        this.unselItems = function() {
            this.ulList.find("li").css({'font-weight': ''});
        };

        this.render = function(models) {
            this.ulList.empty();
            var ul = $("<ul>");
            for(var i = 0; i < models.length; i++) {
                var name = models[i]['id'];
                var li = $('<li>').text(models[i]['title']);
                this.initLiItem(li);
                (function(name, el, ths) {
                    li.on('click', function(event) {
                        ths.unselItems();
                        ths.selItem(el);
                        ths.ulList.trigger("click-item", [name]);
                    });
                })(name, li, this);

                ul.append(li);
            }
            this.ulList.append(ul);
        };

        this.initFunc();
    }

    var TableModelConstr = function(ids, initConfig) {

        this.table = ids;
        this.config = initConfig;

        this.initTable = function(table) {
            table.addClass("table");
        };

        createTableFromStructure.call(this, ids, initConfig);

        this.init = function(initConfig) {
            createTableFromStructure.call(this, this.table, initConfig);
        };

        function createTableFromStructure(tableId, structure) {
            tableId.empty();
            var table = $('<table>');
            this.initTable(table);
            var fields = [];
            tableId.append(table);

            if (structure['fields']) {
                var tr = $('<tr>');
                table.append($('<thead>')
                    .append(tr));
                for(var i = 0; i < structure['fields'].length; i++) {
                    fields.push(structure['fields'][i]['id']);
                    tr.append($('<td>').append(
                        $('<div>').text(structure['fields'][i]['title'])));
                }

                tableId.append($('<div>').css({'border':'solid 2px black'}).append(initForm.call(this, $('<form>'), "Новая запись", structure['fields'])));

            }

            if (structure['records']) {
                var tbody = $('<tbody>');
                table.append(tbody);

                for(var i = 0; i < structure['records'].length; i++) {
                    tr = $('<tr>');
                    tbody.append(tr);
                    for(var c = 0; c < fields.length; c++) {
                        tr.append($('<td>').append($('<div>').text(
                            structure["records"][i][fields[c]]
                        )));
                    }
                }
            }
        }

        function initForm(form, title, fields) {
            form.addClass("form-horizontal");
            form.append($("<h4>").text(title));
            for(var i = 0; i < fields.length; i++) {
                form.append(createField(fields[i]['type'], fields[i]['title']));
            }

            form.append($("<button>").text("Сохранить").on("click", function(event) {
                event.preventDefault();
                console.log("BLA");
            }));

            function createField(type, title) {
                var div = $('<div>').addClass("form-group");
                var idfld = Math.floor(Math.random()*11);

                div.append($('<label>').attr("for", idfld).text(title).addClass("col-sm-2 control-label"));
                var input = $('<input>').attr("type", "text").attr("id", idfld).addClass("form-control");
                div.append($("<div>").addClass("col-sm-10").append(input));
                if (type == "date") {
                    input.datepicker();
                }
                return div;
            }

            return form;
        }


    };

})(window, jQuery);