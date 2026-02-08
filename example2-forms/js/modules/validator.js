/**
 * EJEMPLO 2 - Módulo Validator (sin dependencias)
 * Reglas de validación reutilizables.
 */
define(function () {
    'use strict';

    return {
        /**
         * Campo obligatorio
         */
        required: function (value) {
            if (typeof value === 'string' && value.trim() === '') {
                return 'Este campo es obligatorio.';
            }
            return null;
        },

        /**
         * Longitud mínima
         */
        minLength: function (min) {
            return function (value) {
                if (value.length < min) {
                    return 'Mínimo ' + min + ' caracteres.';
                }
                return null;
            };
        },

        /**
         * Longitud máxima
         */
        maxLength: function (max) {
            return function (value) {
                if (value.length > max) {
                    return 'Máximo ' + max + ' caracteres.';
                }
                return null;
            };
        },

        /**
         * Email válido
         */
        email: function (value) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !regex.test(value)) {
                return 'Email no válido.';
            }
            return null;
        },

        /**
         * Solo números
         */
        numeric: function (value) {
            if (value && isNaN(Number(value))) {
                return 'Solo se permiten números.';
            }
            return null;
        },

        /**
         * Rango numérico
         */
        range: function (min, max) {
            return function (value) {
                var num = Number(value);
                if (isNaN(num) || num < min || num > max) {
                    return 'El valor debe estar entre ' + min + ' y ' + max + '.';
                }
                return null;
            };
        },

        /**
         * Patrón regex personalizado
         */
        pattern: function (regex, message) {
            return function (value) {
                if (value && !regex.test(value)) {
                    return message || 'Formato no válido.';
                }
                return null;
            };
        },

        /**
         * Ejecutar varias validaciones sobre un valor.
         * Devuelve el primer error o null.
         */
        validate: function (value, rules) {
            for (var i = 0; i < rules.length; i++) {
                var error = rules[i](value);
                if (error) {
                    return error;
                }
            }
            return null;
        }
    };
});
