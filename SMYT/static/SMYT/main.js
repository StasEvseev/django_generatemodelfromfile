(function(window, $) {

    $(function(){
        var mainTableEl = $("#maintable");
        var listModelEl = $("#list-model");

        $.get('/scheme_all/').done(function(data) {
            var config = {records: [
            ]};

            for(var i in data['meta']) {

                if (!data.hasOwnProperty(data['meta'][i])) {
                    config['records'].push({title: data['meta'][i]['title'], id: i});
                }
            }

            var listModelObject = new ListModelConstr(listModelEl, config);

            var tableModelObject = new TableModelConstr(mainTableEl, {});

            listModelObject.on("click-item", function(event, type) {
                tableModelObject.fetch("/" + type + "/");
            });

            tableModelObject.on('add-record', function(event, url) {
                tableModelObject.fetch(url);
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

        this.on = function(event, func) {
            this.ulList.on(event, func);
        };

        this.initFunc();
    }

    function TableModelConstr(ids, initConfig) {

        this.table = ids;
        this.tableEl = undefined;
        this.url = undefined;

        this.initTable = function(table) {
            table.addClass("table");
        };

        this.init = function(initConfig) {
            this.url = initConfig['url'];
            this.createTableFromStructure(this.table, initConfig);
        };

        this.getEl = function() {
            return this.table;
        };

        this.getTableEl = function() {
            return this.tableEl;
        };

        this.fetch = function(url) {
            var url = url ? url : this.url;
            var ths = this;
            $.ajax({
                url: url,
                success: function(data) {
                    ths.init({fields: data['meta']['fields'], records: data['records'], url: url});
                },
                failure: function() {

                }
            });
        };

        this.on = function(event, func) {
            this.getEl().on(event, func);
        };

        this.cellClick = function(record, column, cell) {
            var ths = this;
            cell.on('click', function() {
                ths.getEl().trigger('column-record-click', [record, column]);
                if (!ths.editableCell) {
                    var fld = new CreateField(column['type'], '');
                    fld.getInput().val(cell.text());
                    cell.text("");
                    cell.append(fld.getEl());
                    fld.getInput().select();

                    ths.editableCell = {
                        record: record,
                        column: column,
                        cell: cell
                    };

                    ths.blurCell(fld);
                }
            });
        };

        this.blurCell = function(cell) {
            var ths = this;

            var func = function() {
                var record = ths.editableCell['record'];
                record[ths.editableCell['column']['id']] = cell.getInput().val();
                ths.updateRecord(record, function() {
                    ths.fetch();
                    ths.editableCell = undefined;
                    cell.getEl().remove();
                }, function() {
                    console.log("FAILURE");
                });
            };

            if(ths.editableCell['column']['type'] == 'date') {
                cell.getInput().change(func);
            } else {
                cell.getInput().blur(func);
            }
        };

        this.updateRecord = function(record, funcSuccess, funcFailure) {
            $.post(this.url + record['id'], record).done(funcSuccess);
        };

        this.createTableFromStructure = function(tableId, structure) {
            var ths = this;
            tableId.empty();
            var table = $('<table>');
            this.initTable(table);
            this.tableEl = table;

            this.editableCell = undefined;

            var fields = [];
            tableId.append(table);

            if (structure['fields']) {
                var tr = $('<tr>'),
                    columns = structure['fields'];

                table.append($('<thead>')
                    .append(tr));

                for(var i = 0; i < columns.length; i++) {
                    var column = columns[i];

                    fields.push({
                        id: column['id'],
                        type: column['type']
                    });

                    tr.append(
                        $('<td>').append(
                            $('<div>').text(
                                column['title'])));
                }

                var FORM = new CreateForm(
                    "Новая запись",
                    columns,
                    structure['url']
                );

                //lite hack... ^(
                FORM.on('add-record', function(event, url) {
                    ths.getEl().trigger('add-record', [url]);
                });

                tableId.append($('<div>').css({'border':'solid 2px black'}).append(
                    FORM));

            }

            if (structure['records']) {
                var tbody = $('<tbody>');
                table.append(tbody);

                var records = structure['records'];

                for(var i = 0; i < records.length; i++) {
                    tr = $('<tr>');
                    tbody.append(tr);
                    for(var c = 0; c < fields.length; c++) {
                        var record = records[i],
                            column = fields[c],
                            index = column['id'],
                            columnRecord = $('<div>').text(record[index]);

                        ths.cellClick(record, column, columnRecord);

                        tr.append(
                            $('<td>').append(
                                columnRecord));
                    }
                }
            }
        };

        function CreateForm(title, fields, url) {
                var form = $('<form>');
                var ths = this;
                form.addClass("form-horizontal");
                form.append($("<h4>").text(title));
                var fldForm = [];
                for(var i = 0; i < fields.length; i++) {
                    var typeFld = fields[i]['type'],
                        idFld = fields[i]['id'],
                        titleFld = fields[i]['title'];
                    var fld = new CreateField(typeFld, idFld, titleFld);
                    fldForm.push(fld);
                    form.append(fld.getEl());
                }

                form.append($("<button>").text("Сохранить").on("click", function(event) {
                    event.preventDefault();
                    $.post(url, getDatas(fldForm)).done(function() {
                        form.trigger("add-record", [url]);
                    });
                }));

                function getDatas(flds) {
                    var data = {};
                    for(var i = 0; i < flds.length; i++) {
                        var dt = flds[i].getData();
                        data[dt[0]] = dt[1];
                    }
                    return data;
                }

                return form;
            }

        function CreateField(type, name, title) {
                this.el = $('<div>').addClass("form-group");
                var idfld = Math.floor(Math.random()*11);

                if (title) {
                    this.el.append(
                    $('<label>').attr(
                        "for", idfld).text(
                            title).addClass(
                                "col-sm-2 control-label"));
                }

                this.input = $('<input>').attr(
                    "type", "text").attr(
                        "id", idfld).attr(
                            "name", name).addClass(
                                "form-control");

                this.el.append(
                    $("<div>").addClass(
                        "col-sm-10").append(
                            this.input));

                if (type == "date") {
                    this.input.datepicker({ dateFormat: 'yy-mm-dd' });
                }
                this.getInput = function() {
                    return this.input;
                };

                this.getEl = function() {
                    return this.el;
                };

                this.getData = function() {
                    return [this.input.attr("name"), this.input.val()]
                };
            }

        this.createTableFromStructure(ids, initConfig);
    }

})(window, jQuery);