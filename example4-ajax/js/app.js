/**
 * EJEMPLO 4 - Entry Point
 * Gestión de cursos con API simulada.
 * Patrón muy similar a lo que harás en Moodle con core/ajax.
 */
require(['modules/courseui'], function (courseUI) {
    'use strict';

    // Inicializar la UI
    courseUI.init('#app-container', '#course-list');

    // =============================================
    // Filtros
    // =============================================

    document.getElementById('search-input').addEventListener('keyup', function () {
        var search = this.value;
        var category = document.getElementById('filter-category').value;
        courseUI.filter({ search: search, category: category || undefined });
    });

    document.getElementById('filter-category').addEventListener('change', function () {
        var category = this.value;
        var search = document.getElementById('search-input').value;
        courseUI.filter({ search: search || undefined, category: category || undefined });
    });

    // =============================================
    // Crear curso
    // =============================================

    document.getElementById('create-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var data = {
            name: document.getElementById('course-name').value,
            teacher: document.getElementById('course-teacher').value,
            students: parseInt(document.getElementById('course-students').value) || 0,
            category: document.getElementById('course-category').value
        };

        var button = this.querySelector('button[type="submit"]');

        courseUI.createCourse(data, button)
            .then(function (course) {
                document.getElementById('create-form').reset();
                document.getElementById('create-result').innerHTML =
                    '<p style="color:#4caf50;">✅ Curso "' + course.name + '" creado (ID: ' + course.id + ')</p>';
            })
            .catch(function (err) {
                document.getElementById('create-result').innerHTML =
                    '<p style="color:#f44336;">❌ ' + err.message + '</p>';
            });
    });

    // =============================================
    // Recargar
    // =============================================

    document.getElementById('btn-reload').addEventListener('click', function () {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-category').value = '';
        courseUI.reload();
    });
});
