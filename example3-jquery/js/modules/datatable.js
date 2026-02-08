/**
 * EJEMPLO 3 - Módulo DataTable (depende de jQuery)
 * Crea una tabla dinámica con filtrado y ordenación.
 *
 * NOTA: 'jquery' en el array de dependencias funciona
 * porque lo definimos en require.config paths.
 */
define(['jquery'], function ($) {
    'use strict';

    return {
        /**
         * Crear una tabla dinámica
         * @param {string} container - Selector del contenedor
         * @param {object} config - Configuración
         * @returns {object} API de la tabla
         */
        create: function (container, config) {
            var $container = $(container);
            var allData = config.data.slice(); // copia
            var currentData = allData.slice();
            var sortDirection = {};

            // Construir tabla con jQuery
            var $table = $('<table>').addClass('data-table');

            // Cabecera
            var $thead = $('<thead>');
            var $headerRow = $('<tr>');
            config.columns.forEach(function (col, index) {
                var $th = $('<th>').text(col).css('cursor', 'pointer');
                $th.on('click', function () {
                    sortByColumn(index);
                });
                // Icono de orden
                $th.append($('<span>').addClass('sort-icon').text(' ↕'));
                $headerRow.append($th);
            });
            $thead.append($headerRow);
            $table.append($thead);

            // Body
            var $tbody = $('<tbody>');
            $table.append($tbody);

            $container.append($table);

            /**
             * Renderizar filas con los datos actuales
             */
            function render(data) {
                $tbody.empty();
                data = data || currentData;

                if (data.length === 0) {
                    var $empty = $('<tr>').append(
                        $('<td>').attr('colspan', config.columns.length)
                                 .text('No se encontraron resultados.')
                                 .css({ textAlign: 'center', padding: '20px', color: '#999' })
                    );
                    $tbody.append($empty);
                    return;
                }

                data.forEach(function (row) {
                    var $tr = $('<tr>');
                    // Añadir celdas
                    $tr.append($('<td>').text(row.id));
                    $tr.append($('<td>').text(row.name));
                    $tr.append($('<td>').text(row.email));
                    $tr.append($('<td>').append(
                        $('<span>').addClass('badge badge-' + row.role.toLowerCase()).text(row.role)
                    ));
                    $tr.append($('<td>').append(
                        $('<span>').addClass('status status-' + row.status.toLowerCase()).text(row.status)
                    ));

                    // Acciones
                    var $actions = $('<td>');
                    var $viewBtn = $('<button>').text('Ver').addClass('btn-sm btn-view');
                    $viewBtn.on('click', function (e) {
                        e.stopPropagation();
                        if (config.onRowClick) {
                            config.onRowClick(row);
                        }
                    });
                    var $deleteBtn = $('<button>').text('Eliminar').addClass('btn-sm btn-delete');
                    $deleteBtn.on('click', function (e) {
                        e.stopPropagation();
                        removeRow(row.id);
                    });
                    $actions.append($viewBtn).append($deleteBtn);
                    $tr.append($actions);

                    // Click en la fila
                    $tr.on('click', function () {
                        if (config.onRowClick) {
                            config.onRowClick(row);
                        }
                    });

                    // Hover
                    $tr.on('mouseenter', function () {
                        $(this).css('background-color', '#f5f5f5');
                    }).on('mouseleave', function () {
                        $(this).css('background-color', '');
                    });

                    $tbody.append($tr);
                });
            }

            /**
             * Filtrar por texto general
             */
            function filter(term) {
                currentData = allData.filter(function (row) {
                    return Object.values(row).some(function (val) {
                        return String(val).toLowerCase().indexOf(term) !== -1;
                    });
                });
                render();
            }

            /**
             * Filtrar por campo específico
             */
            function filterByField(field, value) {
                if (!value) {
                    currentData = allData.slice();
                } else {
                    currentData = allData.filter(function (row) {
                        return row[field] === value;
                    });
                }
                render();
            }

            /**
             * Ordenar por columna
             */
            function sortByColumn(index) {
                var fields = ['id', 'name', 'email', 'role', 'status'];
                var field = fields[index];
                if (!field) return;

                sortDirection[field] = !sortDirection[field];
                var dir = sortDirection[field] ? 1 : -1;

                currentData.sort(function (a, b) {
                    if (a[field] < b[field]) return -1 * dir;
                    if (a[field] > b[field]) return 1 * dir;
                    return 0;
                });
                render();
            }

            /**
             * Eliminar fila por ID
             */
            function removeRow(id) {
                allData = allData.filter(function (row) { return row.id !== id; });
                currentData = currentData.filter(function (row) { return row.id !== id; });
                render();
            }

            // Render inicial
            render();

            // API pública
            return {
                filter: filter,
                filterByField: filterByField,
                reset: function () {
                    currentData = allData.slice();
                    render();
                },
                addRow: function (row) {
                    allData.push(row);
                    currentData.push(row);
                    render();
                },
                getData: function () {
                    return currentData.slice();
                },
                updateStats: function (statsSelector) {
                    var $stats = $(statsSelector);
                    var roles = {};
                    var active = 0;
                    allData.forEach(function (r) {
                        roles[r.role] = (roles[r.role] || 0) + 1;
                        if (r.status === 'Activo') active++;
                    });

                    $stats.html(
                        '<p><strong>Total usuarios:</strong> ' + allData.length + '</p>' +
                        '<p><strong>Activos:</strong> ' + active + '</p>' +
                        '<p><strong>Por rol:</strong> ' +
                        Object.keys(roles).map(function (k) { return k + ': ' + roles[k]; }).join(', ') +
                        '</p>'
                    );
                }
            };
        }
    };
});
