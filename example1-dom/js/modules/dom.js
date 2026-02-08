/**
 * EJEMPLO 1 - Módulo DOM (sin dependencias)
 * Funciones helper para manipular el DOM.
 */
define(function () {
    'use strict';

    return {
        /**
         * Obtener elemento por selector
         */
        get: function (selector) {
            return document.querySelector(selector);
        },

        /**
         * Obtener todos los elementos por selector
         */
        getAll: function (selector) {
            return document.querySelectorAll(selector);
        },

        /**
         * Crear un elemento con texto y clases opcionales
         */
        create: function (tag, text, className) {
            var el = document.createElement(tag);
            if (text) {
                el.textContent = text;
            }
            if (className) {
                el.className = className;
            }
            return el;
        },

        /**
         * Insertar elemento dentro de un contenedor
         */
        append: function (parent, child) {
            if (typeof parent === 'string') {
                parent = this.get(parent);
            }
            parent.appendChild(child);
            return child;
        },

        /**
         * Vaciar el contenido de un elemento
         */
        empty: function (selector) {
            var el = (typeof selector === 'string') ? this.get(selector) : selector;
            el.innerHTML = '';
            return el;
        },

        /**
         * Añadir/quitar clase CSS
         */
        toggleClass: function (selector, className) {
            var el = (typeof selector === 'string') ? this.get(selector) : selector;
            el.classList.toggle(className);
            return el;
        },

        /**
         * Mostrar/ocultar elemento
         */
        toggle: function (selector) {
            var el = (typeof selector === 'string') ? this.get(selector) : selector;
            if (el.style.display === 'none') {
                el.style.display = '';
            } else {
                el.style.display = 'none';
            }
            return el;
        }
    };
});
