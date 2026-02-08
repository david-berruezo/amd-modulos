/**
 * EJEMPLO 4 - Módulo CourseUI (depende de api + loading)
 * Renderiza la interfaz de cursos y conecta con la API.
 */
define(['modules/api', 'modules/loading'], function (api, loading) {
    'use strict';

    var containerSelector;
    var listSelector;

    /**
     * Renderizar la lista de cursos
     */
    function renderCourses(courses, container) {
        container = container || document.querySelector(listSelector);
        container.innerHTML = '';

        if (courses.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No hay cursos.</p>';
            return;
        }

        courses.forEach(function (course) {
            var card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML =
                '<div class="course-header">' +
                    '<h3>' + course.name + '</h3>' +
                    '<span class="category-badge cat-' + course.category.toLowerCase().replace(/\s/g, '') + '">' +
                        course.category +
                    '</span>' +
                '</div>' +
                '<p class="course-teacher">👨‍🏫 ' + course.teacher + '</p>' +
                '<p class="course-students">👥 ' + course.students + ' estudiantes</p>' +
                '<div class="course-actions">' +
                    '<button class="btn-view-course" data-id="' + course.id + '">Ver detalle</button>' +
                    '<button class="btn-delete-course" data-id="' + course.id + '">Eliminar</button>' +
                '</div>';
            container.appendChild(card);
        });

        // Eventos de los botones
        container.querySelectorAll('.btn-delete-course').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = parseInt(this.dataset.id);
                deleteCourse(id);
            });
        });

        container.querySelectorAll('.btn-view-course').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = parseInt(this.dataset.id);
                viewCourse(id);
            });
        });
    }

    /**
     * Cargar cursos desde la API
     */
    function loadCourses(filters) {
        loading.show(listSelector, 'Cargando cursos...');

        api.getCourses(filters)
            .then(function (courses) {
                loading.hide(listSelector);
                renderCourses(courses);
            })
            .catch(function (err) {
                var retryBtn = loading.showError(listSelector, err.message);
                if (retryBtn) {
                    retryBtn.addEventListener('click', function () {
                        loadCourses(filters);
                    });
                }
            });
    }

    /**
     * Ver detalle de un curso
     */
    function viewCourse(id) {
        var detail = document.querySelector('#course-detail');
        loading.show('#course-detail', 'Cargando detalle...');

        api.getCourse(id)
            .then(function (course) {
                detail.innerHTML =
                    '<div class="detail-card">' +
                        '<h3>' + course.name + '</h3>' +
                        '<p><strong>Profesor:</strong> ' + course.teacher + '</p>' +
                        '<p><strong>Estudiantes:</strong> ' + course.students + '</p>' +
                        '<p><strong>Categoría:</strong> ' + course.category + '</p>' +
                        '<p><strong>ID:</strong> ' + course.id + '</p>' +
                    '</div>';
            })
            .catch(function (err) {
                detail.innerHTML = '<p style="color:#f44336;">' + err.message + '</p>';
            });
    }

    /**
     * Eliminar curso
     */
    function deleteCourse(id) {
        if (!confirm('¿Eliminar este curso?')) return;

        api.deleteCourse(id)
            .then(function () {
                loadCourses();
                loadStats();
            })
            .catch(function (err) {
                alert('Error: ' + err.message);
            });
    }

    /**
     * Cargar estadísticas
     */
    function loadStats() {
        var statsEl = document.querySelector('#stats-container');
        if (!statsEl) return;

        api.getStats().then(function (stats) {
            var catHtml = Object.keys(stats.byCategory).map(function (cat) {
                return '<span class="stat-badge">' + cat + ': ' + stats.byCategory[cat] + '</span>';
            }).join(' ');

            statsEl.innerHTML =
                '<div class="stats-row">' +
                    '<div class="stat-item"><strong>' + stats.total + '</strong><br>Cursos</div>' +
                    '<div class="stat-item"><strong>' + stats.totalStudents + '</strong><br>Estudiantes</div>' +
                '</div>' +
                '<div style="margin-top:10px;">' + catHtml + '</div>';
        });
    }

    return {
        /**
         * Inicializar la UI de cursos
         */
        init: function (containerSel, listSel) {
            containerSelector = containerSel;
            listSelector = listSel;

            loadCourses();
            loadStats();
        },

        /**
         * Recargar la lista
         */
        reload: loadCourses,

        /**
         * Crear un curso nuevo
         */
        createCourse: function (data, button) {
            loading.buttonLoading(button, true);

            return api.createCourse(data)
                .then(function (newCourse) {
                    loading.buttonLoading(button, false);
                    loadCourses();
                    loadStats();
                    return newCourse;
                })
                .catch(function (err) {
                    loading.buttonLoading(button, false);
                    throw err;
                });
        },

        /**
         * Filtrar cursos
         */
        filter: function (filters) {
            loadCourses(filters);
        }
    };
});
