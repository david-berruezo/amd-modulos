/**
 * EJEMPLO 6 - Entry Point
 * CRUD completo de estudiantes.
 * storage.js → studentmodel.js → studentview.js → app.js
 *
 * Cadena de 3 niveles de dependencias.
 */
require(['modules/studentview'], function (studentView) {
    'use strict';
    studentView.init();
});
