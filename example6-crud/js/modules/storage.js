/**
 * EJEMPLO 6 - Módulo Storage (sin dependencias)
 * Wrapper sobre localStorage con fallback a memoria.
 * En Moodle esto sería equivalente a core/ajax + web services.
 */
define(function () {
    'use strict';

    var memoryStore = {};
    var useLocalStorage = (function () {
        try {
            localStorage.setItem('__test__', '1');
            localStorage.removeItem('__test__');
            return true;
        } catch (e) {
            return false;
        }
    })();

    return {
        /**
         * Guardar datos
         */
        set: function (key, value) {
            var json = JSON.stringify(value);
            if (useLocalStorage) {
                localStorage.setItem(key, json);
            } else {
                memoryStore[key] = json;
            }
        },

        /**
         * Obtener datos
         */
        get: function (key, defaultValue) {
            var json;
            if (useLocalStorage) {
                json = localStorage.getItem(key);
            } else {
                json = memoryStore[key];
            }

            if (json === null || json === undefined) {
                return defaultValue !== undefined ? defaultValue : null;
            }

            try {
                return JSON.parse(json);
            } catch (e) {
                return defaultValue || null;
            }
        },

        /**
         * Eliminar datos
         */
        remove: function (key) {
            if (useLocalStorage) {
                localStorage.removeItem(key);
            } else {
                delete memoryStore[key];
            }
        },

        /**
         * Limpiar todo
         */
        clear: function () {
            if (useLocalStorage) {
                localStorage.clear();
            } else {
                memoryStore = {};
            }
        }
    };
});
