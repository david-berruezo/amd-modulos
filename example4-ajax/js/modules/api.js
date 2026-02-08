/**
 * EJEMPLO 4 - Módulo API (sin dependencias)
 * Simula llamadas AJAX con datos fake.
 * En un caso real usarías fetch() o $.ajax().
 *
 * Este patrón es EXACTO al que usarás en Moodle con
 * core/ajax para llamar a web services.
 */
define(function () {
    'use strict';

    // Base de datos simulada
    var db = {
        courses: [
            { id: 1, name: 'Matemáticas I',   teacher: 'Prof. García',   students: 32, category: 'Ciencias' },
            { id: 2, name: 'Historia del Arte', teacher: 'Prof. López',   students: 28, category: 'Humanidades' },
            { id: 3, name: 'Programación Web',  teacher: 'Prof. Martín',  students: 45, category: 'Tecnología' },
            { id: 4, name: 'Física II',          teacher: 'Prof. Ruiz',    students: 25, category: 'Ciencias' },
            { id: 5, name: 'Inglés Avanzado',    teacher: 'Prof. Johnson', students: 35, category: 'Idiomas' },
            { id: 6, name: 'Base de Datos',       teacher: 'Prof. Martín',  students: 40, category: 'Tecnología' }
        ],
        nextId: 7
    };

    /**
     * Simular latencia de red
     */
    function simulateDelay(data, delay) {
        delay = delay || 500;
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(JSON.parse(JSON.stringify(data)));
            }, delay);
        });
    }

    /**
     * Simular error aleatorio (10% de probabilidad)
     */
    function maybeError(reject) {
        if (Math.random() < 0.1) {
            reject({ error: true, message: 'Error de servidor simulado (500)' });
            return true;
        }
        return false;
    }

    return {
        /**
         * GET - Obtener todos los cursos
         */
        getCourses: function (filters) {
            return new Promise(function (resolve, reject) {
                if (maybeError(reject)) return;

                var results = db.courses.slice();

                if (filters) {
                    if (filters.category) {
                        results = results.filter(function (c) {
                            return c.category === filters.category;
                        });
                    }
                    if (filters.search) {
                        var term = filters.search.toLowerCase();
                        results = results.filter(function (c) {
                            return c.name.toLowerCase().indexOf(term) !== -1 ||
                                   c.teacher.toLowerCase().indexOf(term) !== -1;
                        });
                    }
                }

                simulateDelay(results, 300 + Math.random() * 500).then(resolve);
            });
        },

        /**
         * GET - Obtener un curso por ID
         */
        getCourse: function (id) {
            return new Promise(function (resolve, reject) {
                if (maybeError(reject)) return;

                var course = db.courses.find(function (c) { return c.id === id; });
                if (course) {
                    simulateDelay(course).then(resolve);
                } else {
                    reject({ error: true, message: 'Curso no encontrado (404)' });
                }
            });
        },

        /**
         * POST - Crear un nuevo curso
         */
        createCourse: function (data) {
            return new Promise(function (resolve, reject) {
                if (maybeError(reject)) return;

                if (!data.name || !data.teacher) {
                    reject({ error: true, message: 'Nombre y profesor son obligatorios.' });
                    return;
                }

                var newCourse = {
                    id: db.nextId++,
                    name: data.name,
                    teacher: data.teacher,
                    students: data.students || 0,
                    category: data.category || 'Sin categoría'
                };
                db.courses.push(newCourse);

                simulateDelay(newCourse).then(resolve);
            });
        },

        /**
         * DELETE - Eliminar curso
         */
        deleteCourse: function (id) {
            return new Promise(function (resolve, reject) {
                if (maybeError(reject)) return;

                var index = db.courses.findIndex(function (c) { return c.id === id; });
                if (index !== -1) {
                    db.courses.splice(index, 1);
                    simulateDelay({ success: true, deletedId: id }).then(resolve);
                } else {
                    reject({ error: true, message: 'Curso no encontrado (404)' });
                }
            });
        },

        /**
         * GET - Obtener estadísticas
         */
        getStats: function () {
            return new Promise(function (resolve) {
                var stats = {
                    total: db.courses.length,
                    totalStudents: db.courses.reduce(function (sum, c) { return sum + c.students; }, 0),
                    byCategory: {}
                };
                db.courses.forEach(function (c) {
                    if (!stats.byCategory[c.category]) {
                        stats.byCategory[c.category] = 0;
                    }
                    stats.byCategory[c.category]++;
                });

                simulateDelay(stats, 200).then(resolve);
            });
        }
    };
});
