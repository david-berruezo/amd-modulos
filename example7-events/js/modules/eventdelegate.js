/**
 * EJEMPLO 7 - Módulo EventDelegate (sin dependencias)
 * Patrón Event Delegation: en vez de poner un listener
 * en cada botón, ponemos UNO en el contenedor padre.
 *
 * Esto es EXACTAMENTE lo que hace Moodle para gestionar
 * eventos en contenido dinámico (que se carga por AJAX).
 */
define(function () {
    'use strict';

    var registeredDelegates = [];

    return {
        /**
         * Delegar un evento
         * @param {string|Element} container - Contenedor padre
         * @param {string} eventType - Tipo de evento ('click', 'change', etc.)
         * @param {string} selector - Selector CSS del elemento hijo
         * @param {function} handler - Función a ejecutar
         * @returns {object} Objeto con off() para desregistrar
         */
        on: function (container, eventType, selector, handler) {
            var el = (typeof container === 'string')
                ? document.querySelector(container)
                : container;

            if (!el) {
                console.warn('EventDelegate: container not found:', container);
                return { off: function () {} };
            }

            var delegateHandler = function (e) {
                var target = e.target.closest(selector);
                if (target && el.contains(target)) {
                    handler.call(target, e, target);
                }
            };

            el.addEventListener(eventType, delegateHandler);

            var delegate = {
                container: el,
                eventType: eventType,
                handler: delegateHandler,
                off: function () {
                    el.removeEventListener(eventType, delegateHandler);
                    var idx = registeredDelegates.indexOf(delegate);
                    if (idx !== -1) registeredDelegates.splice(idx, 1);
                }
            };

            registeredDelegates.push(delegate);
            return delegate;
        },

        /**
         * Eliminar todos los delegates de un contenedor
         */
        offAll: function (container) {
            var el = (typeof container === 'string')
                ? document.querySelector(container)
                : container;

            registeredDelegates = registeredDelegates.filter(function (d) {
                if (d.container === el) {
                    el.removeEventListener(d.eventType, d.handler);
                    return false;
                }
                return true;
            });
        },

        /**
         * Debug: listar delegates activos
         */
        debug: function () {
            return registeredDelegates.map(function (d) {
                return d.eventType + ' on ' + (d.container.id || d.container.tagName);
            });
        }
    };
});
