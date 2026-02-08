/**
 * EJEMPLO 6 - Módulo StudentView (depende de studentmodel)
 * Patrón MVC: Este es el VIEW + CONTROLLER.
 * Renderiza la UI y maneja la interacción.
 */
define(['modules/studentmodel'], function (model) {
    'use strict';

    var currentFilters = {};
    var editingId = null;

    /**
     * Renderizar tabla de estudiantes
     */
    function renderTable() {
        var students = model.findAll(currentFilters);
        var tbody = document.getElementById('student-tbody');
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#999;padding:20px;">No hay estudiantes.</td></tr>';
            return;
        }

        students.forEach(function (s) {
            var gradeClass = s.grade >= 9 ? 'grade-high' : (s.grade >= 7 ? 'grade-mid' : (s.grade >= 5 ? 'grade-low' : 'grade-fail'));
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + s.id + '</td>' +
                '<td><strong>' + s.name + '</strong></td>' +
                '<td>' + s.email + '</td>' +
                '<td><span class="grade-badge ' + gradeClass + '">' + s.grade.toFixed(1) + '</span></td>' +
                '<td>' + s.course + '</td>' +
                '<td>' + s.enrolled + '</td>' +
                '<td class="actions-cell">' +
                    '<button class="btn-edit" data-id="' + s.id + '">✏️</button>' +
                    '<button class="btn-del" data-id="' + s.id + '">🗑️</button>' +
                '</td>';
            tbody.appendChild(tr);
        });

        // Eventos
        tbody.querySelectorAll('.btn-edit').forEach(function (btn) {
            btn.addEventListener('click', function () {
                editStudent(parseInt(this.dataset.id));
            });
        });
        tbody.querySelectorAll('.btn-del').forEach(function (btn) {
            btn.addEventListener('click', function () {
                if (confirm('¿Eliminar este estudiante?')) {
                    model.remove(parseInt(this.dataset.id));
                    renderTable();
                    renderStats();
                    updateCourseFilter();
                }
            });
        });
    }

    /**
     * Renderizar estadísticas
     */
    function renderStats() {
        var stats = model.getStats();
        var container = document.getElementById('stats-area');

        var courseHtml = Object.keys(stats.courses).map(function (c) {
            return '<span class="stat-badge">' + c + ': ' + stats.courses[c] + '</span>';
        }).join(' ');

        container.innerHTML =
            '<div class="stat-cards">' +
                '<div class="stat-card"><span class="stat-num">' + stats.total + '</span><span class="stat-lbl">Total</span></div>' +
                '<div class="stat-card"><span class="stat-num">' + stats.averageGrade + '</span><span class="stat-lbl">Nota media</span></div>' +
                '<div class="stat-card"><span class="stat-num">' + (stats.topStudent ? stats.topStudent.name.split(' ')[0] : '-') + '</span><span class="stat-lbl">Mejor nota (' + (stats.topStudent ? stats.topStudent.grade : '-') + ')</span></div>' +
            '</div>' +
            '<div style="margin-top:8px;">' + courseHtml + '</div>';
    }

    /**
     * Actualizar dropdown de cursos
     */
    function updateCourseFilter() {
        var select = document.getElementById('filter-course');
        var current = select.value;
        var courses = model.getCourses();

        select.innerHTML = '<option value="">Todos los cursos</option>';
        courses.forEach(function (c) {
            var opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            if (c === current) opt.selected = true;
            select.appendChild(opt);
        });
    }

    /**
     * Cargar datos de un estudiante en el formulario para editar
     */
    function editStudent(id) {
        var student = model.findById(id);
        if (!student) return;

        editingId = id;
        document.getElementById('f-name').value = student.name;
        document.getElementById('f-email').value = student.email;
        document.getElementById('f-grade').value = student.grade;
        document.getElementById('f-course').value = student.course;
        document.getElementById('f-enrolled').value = student.enrolled;

        document.getElementById('form-title').textContent = 'Editar estudiante (ID: ' + id + ')';
        document.getElementById('btn-submit').textContent = 'Actualizar';
        document.getElementById('btn-cancel').style.display = 'inline-block';

        // Scroll al form
        document.getElementById('student-form').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Resetear formulario
     */
    function resetForm() {
        editingId = null;
        document.getElementById('student-form').reset();
        document.getElementById('form-title').textContent = 'Nuevo estudiante';
        document.getElementById('btn-submit').textContent = 'Crear';
        document.getElementById('btn-cancel').style.display = 'none';
        document.getElementById('form-feedback').innerHTML = '';
    }

    return {
        /**
         * Inicializar toda la vista
         */
        init: function () {
            renderTable();
            renderStats();
            updateCourseFilter();

            // ====== Filtros ======
            document.getElementById('search-input').addEventListener('keyup', function () {
                currentFilters.search = this.value;
                renderTable();
            });

            document.getElementById('filter-course').addEventListener('change', function () {
                currentFilters.course = this.value || undefined;
                renderTable();
            });

            document.getElementById('sort-select').addEventListener('change', function () {
                var parts = this.value.split('-');
                if (parts.length === 2) {
                    currentFilters.sortBy = parts[0];
                    currentFilters.sortDir = parts[1];
                } else {
                    delete currentFilters.sortBy;
                    delete currentFilters.sortDir;
                }
                renderTable();
            });

            // ====== Formulario CREATE / UPDATE ======
            document.getElementById('student-form').addEventListener('submit', function (e) {
                e.preventDefault();

                var data = {
                    name: document.getElementById('f-name').value.trim(),
                    email: document.getElementById('f-email').value.trim(),
                    grade: document.getElementById('f-grade').value,
                    course: document.getElementById('f-course').value.trim(),
                    enrolled: document.getElementById('f-enrolled').value
                };

                if (!data.name || !data.email) {
                    document.getElementById('form-feedback').innerHTML =
                        '<p style="color:#f44336;">Nombre y email son obligatorios.</p>';
                    return;
                }

                var feedback = document.getElementById('form-feedback');

                if (editingId) {
                    // UPDATE
                    var updated = model.update(editingId, data);
                    if (updated) {
                        feedback.innerHTML = '<p style="color:#4caf50;">✅ Estudiante actualizado.</p>';
                    }
                } else {
                    // CREATE
                    var created = model.create(data);
                    feedback.innerHTML = '<p style="color:#4caf50;">✅ Estudiante creado (ID: ' + created.id + ').</p>';
                }

                resetForm();
                renderTable();
                renderStats();
                updateCourseFilter();
            });

            // Cancelar edición
            document.getElementById('btn-cancel').addEventListener('click', function () {
                resetForm();
            });

            // Reset datos
            document.getElementById('btn-reset-data').addEventListener('click', function () {
                if (confirm('¿Resetear todos los datos a los valores originales?')) {
                    model.reset();
                    resetForm();
                    renderTable();
                    renderStats();
                    updateCourseFilter();
                }
            });
        }
    };
});
