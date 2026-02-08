/**
 * EJEMPLO 7 - Módulo Template (sin dependencias)
 * Motor de templates simple con {{variable}} syntax.
 * Similar al sistema de templates Mustache de Moodle.
 */
define(function () {
    'use strict';

    var templateCache = {};

    return {
        /**
         * Registrar un template
         */
        register: function (name, html) {
            templateCache[name] = html;
        },

        /**
         * Renderizar un template con datos
         * Soporta:
         * - {{variable}} para valores simples
         * - {{#if condition}}...{{/if}} para condicionales
         * - {{#each items}}...{{/each}} para loops
         */
        render: function (name, data) {
            var template = templateCache[name];
            if (!template) {
                console.warn('Template "' + name + '" not found.');
                return '';
            }

            var html = template;

            // Procesar {{#each items}}...{{/each}}
            html = html.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, function (match, key, inner) {
                var items = data[key];
                if (!Array.isArray(items)) return '';
                return items.map(function (item, index) {
                    var itemHtml = inner;
                    // Reemplazar {{this.prop}} por el valor
                    itemHtml = itemHtml.replace(/\{\{this\.(\w+)\}\}/g, function (m, prop) {
                        return item[prop] !== undefined ? item[prop] : '';
                    });
                    // {{@index}}
                    itemHtml = itemHtml.replace(/\{\{@index\}\}/g, index);
                    return itemHtml;
                }).join('');
            });

            // Procesar {{#if condition}}...{{/if}}
            html = html.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, function (match, key, inner) {
                return data[key] ? inner : '';
            });

            // Reemplazar {{variable}}
            html = html.replace(/\{\{(\w+)\}\}/g, function (match, key) {
                return data[key] !== undefined ? data[key] : '';
            });

            return html;
        },

        /**
         * Renderizar desde un elemento <script type="text/template">
         */
        fromElement: function (selector, data) {
            var el = document.querySelector(selector);
            if (!el) return '';
            var name = el.id || selector;
            if (!templateCache[name]) {
                this.register(name, el.innerHTML);
            }
            return this.render(name, data);
        }
    };
});
