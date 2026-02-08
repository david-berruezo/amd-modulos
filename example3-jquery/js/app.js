/**
 * EJEMPLO 3 - jQuery con AMD
 *
 * require.config() permite definir:
 * - paths: alias para librerías externas
 * - shim: para librerías que NO son AMD nativas
 *
 * jQuery SÍ es compatible con AMD de forma nativa,
 * así que no necesita shim.
 */
require.config({
    baseUrl: 'js',
    paths: {
        // jQuery desde CDN (sin el .js al final)
        'jquery': 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min'
    }
});

/**
 * Entry point: cargamos jQuery y nuestros módulos
 */
require(['jquery', 'modules/datatable', 'modules/modal'], function ($, dataTable, modal) {
    'use strict';

    // =============================================
    // SECCIÓN 1: Data Table
    // =============================================

    var sampleData = [
        { id: 1, name: 'Alice Johnson',   email: 'alice@example.com',   role: 'Admin',      status: 'Activo' },
        { id: 2, name: 'Bob Smith',        email: 'bob@example.com',     role: 'Profesor',   status: 'Activo' },
        { id: 3, name: 'Carlos García',    email: 'carlos@example.com',  role: 'Estudiante', status: 'Inactivo' },
        { id: 4, name: 'Diana López',      email: 'diana@example.com',   role: 'Profesor',   status: 'Activo' },
        { id: 5, name: 'Eva Martínez',     email: 'eva@example.com',     role: 'Estudiante', status: 'Activo' },
        { id: 6, name: 'Frank Wilson',     email: 'frank@example.com',   role: 'Admin',      status: 'Inactivo' },
        { id: 7, name: 'Grace Lee',        email: 'grace@example.com',   role: 'Estudiante', status: 'Activo' },
        { id: 8, name: 'Hugo Fernández',   email: 'hugo@example.com',    role: 'Profesor',   status: 'Activo' }
    ];

    var table = dataTable.create('#table-container', {
        columns: ['ID', 'Nombre', 'Email', 'Rol', 'Estado', 'Acciones'],
        data: sampleData,
        onRowClick: function (rowData) {
            modal.open(
                'Detalle de usuario',
                '<p><strong>Nombre:</strong> ' + rowData.name + '</p>' +
                '<p><strong>Email:</strong> ' + rowData.email + '</p>' +
                '<p><strong>Rol:</strong> ' + rowData.role + '</p>' +
                '<p><strong>Estado:</strong> ' + rowData.status + '</p>'
            );
        }
    });

    // =============================================
    // SECCIÓN 2: Filtros con jQuery
    // =============================================

    $('#filter-input').on('keyup', function () {
        var term = $(this).val().toLowerCase();
        table.filter(term);
    });

    $('#filter-role').on('change', function () {
        var role = $(this).val();
        table.filterByField('role', role);
    });

    $('#btn-reset').on('click', function () {
        $('#filter-input').val('');
        $('#filter-role').val('');
        table.reset();
    });

    // =============================================
    // SECCIÓN 3: Añadir usuario
    // =============================================

    $('#btn-add-user').on('click', function () {
        modal.open('Nuevo usuario', $('#add-user-template').html(), function ($content) {
            var name = $content.find('#new-name').val();
            var email = $content.find('#new-email').val();
            var role = $content.find('#new-role').val();

            if (name && email) {
                table.addRow({
                    id: sampleData.length + 1,
                    name: name,
                    email: email,
                    role: role || 'Estudiante',
                    status: 'Activo'
                });
                modal.close();
            }
        });
    });

    // =============================================
    // SECCIÓN 4: Efectos jQuery
    // =============================================

    $('#btn-highlight').on('click', function () {
        $('#table-container table tbody tr').each(function (i) {
            var $row = $(this);
            setTimeout(function () {
                $row.css('background-color', '#fff3e0');
                setTimeout(function () {
                    $row.css('background-color', '');
                }, 500);
            }, i * 100);
        });
    });

    $('#btn-toggle-stats').on('click', function () {
        $('#stats-panel').slideToggle(300);
        table.updateStats('#stats-panel');
    });
});
