/**
 * EJEMPLO 5 - Módulo EventBus (sin dependencias)
 * Patrón Publisher/Subscriber para comunicar módulos
 * sin que se conozcan entre sí.
 *
 * Este patrón es MUY usado en Moodle para que los
 * componentes se comuniquen de forma desacoplada.
 */
define(function () {
    'use strict';

    var events = {};

    return {
        /**
         * Suscribirse a un evento
         * @param {string} event - Nombre del evento
         * @param {function} callback - Función a ejecutar
         * @returns {object} Objeto con método off() para desuscribirse
         */
        on: function (event, callback) {
            if (!events[event]) {
                events[event] = [];
            }
            events[event].push(callback);

            // Devuelve un objeto para poder desuscribirse
            return {
                off: function () {
                    events[event] = events[event].filter(function (cb) {
                        return cb !== callback;
                    });
                }
            };
        },

        /**
         * Emitir un evento
         * @param {string} event - Nombre del evento
         * @param {*} data - Datos a pasar a los listeners
         */
        emit: function (event, data) {
            if (events[event]) {
                events[event].forEach(function (callback) {
                    try {
                        callback(data);
                    } catch (e) {
                        console.error('Error in event handler for "' + event + '":', e);
                    }
                });
            }
        },

        /**
         * Suscribirse a un evento solo una vez
         */
        once: function (event, callback) {
            var self = this;
            var wrapper = function (data) {
                callback(data);
                self.off(event, wrapper);
            };
            this.on(event, wrapper);
        },

        /**
         * Desuscribirse
         */
        off: function (event, callback) {
            if (events[event]) {
                if (callback) {
                    events[event] = events[event].filter(function (cb) {
                        return cb !== callback;
                    });
                } else {
                    delete events[event];
                }
            }
        },

        /**
         * Debug: listar eventos registrados
         */
        debug: function () {
            var info = {};
            Object.keys(events).forEach(function (event) {
                info[event] = events[event].length + ' listeners';
            });
            return info;
        }
    };
});
