/**
 * EJEMPLO 6 - Módulo StudentModel (depende de storage)
 * Patrón MVC: Este es el MODEL.
 * Gestiona los datos de estudiantes (CRUD).
 */
define(['modules/storage'], function (storage) {
    'use strict';

    var STORAGE_KEY = 'amd_students';

    // Datos iniciales (seed)
    var defaultStudents = [
        { id: 1, name: 'Ana García',     email: 'ana@uni.es',     grade: 8.5, course: 'Matemáticas',   enrolled: '2024-09-01' },
        { id: 2, name: 'Carlos López',   email: 'carlos@uni.es',  grade: 7.2, course: 'Programación',  enrolled: '2024-09-01' },
        { id: 3, name: 'Diana Ruiz',     email: 'diana@uni.es',   grade: 9.1, course: 'Matemáticas',   enrolled: '2024-09-15' },
        { id: 4, name: 'Eduardo Martín', email: 'eduardo@uni.es', grade: 6.8, course: 'Historia',      enrolled: '2024-10-01' },
        { id: 5, name: 'Fátima Sánchez', email: 'fatima@uni.es',  grade: 9.5, course: 'Programación',  enrolled: '2024-09-01' }
    ];

    /**
     * Obtener lista del storage (o usar defaults)
     */
    function getAll() {
        return storage.get(STORAGE_KEY, defaultStudents);
    }

    /**
     * Guardar lista completa
     */
    function saveAll(students) {
        storage.set(STORAGE_KEY, students);
    }

    /**
     * Obtener siguiente ID
     */
    function nextId(students) {
        if (students.length === 0) return 1;
        return Math.max.apply(null, students.map(function (s) { return s.id; })) + 1;
    }

    return {
        /**
         * Obtener todos los estudiantes
         */
        findAll: function (filters) {
            var students = getAll();

            if (filters) {
                if (filters.search) {
                    var term = filters.search.toLowerCase();
                    students = students.filter(function (s) {
                        return s.name.toLowerCase().indexOf(term) !== -1 ||
                               s.email.toLowerCase().indexOf(term) !== -1;
                    });
                }
                if (filters.course) {
                    students = students.filter(function (s) {
                        return s.course === filters.course;
                    });
                }
                if (filters.sortBy) {
                    var field = filters.sortBy;
                    var dir = filters.sortDir === 'desc' ? -1 : 1;
                    students.sort(function (a, b) {
                        if (a[field] < b[field]) return -1 * dir;
                        if (a[field] > b[field]) return 1 * dir;
                        return 0;
                    });
                }
            }

            return students;
        },

        /**
         * Obtener uno por ID
         */
        findById: function (id) {
            var students = getAll();
            return students.find(function (s) { return s.id === id; }) || null;
        },

        /**
         * Crear estudiante
         */
        create: function (data) {
            var students = getAll();
            var student = {
                id: nextId(students),
                name: data.name,
                email: data.email,
                grade: parseFloat(data.grade) || 0,
                course: data.course,
                enrolled: data.enrolled || new Date().toISOString().split('T')[0]
            };
            students.push(student);
            saveAll(students);
            return student;
        },

        /**
         * Actualizar estudiante
         */
        update: function (id, data) {
            var students = getAll();
            var index = students.findIndex(function (s) { return s.id === id; });
            if (index === -1) return null;

            Object.keys(data).forEach(function (key) {
                if (key !== 'id') {
                    students[index][key] = data[key];
                }
            });
            if (data.grade !== undefined) {
                students[index].grade = parseFloat(data.grade);
            }

            saveAll(students);
            return students[index];
        },

        /**
         * Eliminar estudiante
         */
        remove: function (id) {
            var students = getAll();
            var filtered = students.filter(function (s) { return s.id !== id; });
            saveAll(filtered);
            return filtered.length < students.length;
        },

        /**
         * Obtener estadísticas
         */
        getStats: function () {
            var students = getAll();
            var totalGrades = students.reduce(function (sum, s) { return sum + s.grade; }, 0);
            var courses = {};
            students.forEach(function (s) {
                courses[s.course] = (courses[s.course] || 0) + 1;
            });

            return {
                total: students.length,
                averageGrade: students.length > 0 ? (totalGrades / students.length).toFixed(2) : 0,
                courses: courses,
                topStudent: students.reduce(function (top, s) {
                    return (!top || s.grade > top.grade) ? s : top;
                }, null)
            };
        },

        /**
         * Obtener lista de cursos únicos
         */
        getCourses: function () {
            var students = getAll();
            var courses = {};
            students.forEach(function (s) { courses[s.course] = true; });
            return Object.keys(courses).sort();
        },

        /**
         * Resetear a datos por defecto
         */
        reset: function () {
            saveAll(defaultStudents);
        }
    };
});
