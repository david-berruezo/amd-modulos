/**
 * EJEMPLO 1 - Módulo Styles (sin dependencias)
 * Aplica estilos dinámicos a elementos.
 */
define(function () {
    'use strict';

    var themes = {
        light: {
            background: '#ffffff',
            color: '#333333',
            accent: '#0066cc',
            border: '#dddddd'
        },
        dark: {
            background: '#1a1a2e',
            color: '#e0e0e0',
            accent: '#00d4ff',
            border: '#333355'
        },
        warm: {
            background: '#fff8f0',
            color: '#5d4037',
            accent: '#ff7043',
            border: '#d7ccc8'
        }
    };

    var currentTheme = 'light';

    return {
        /**
         * Aplicar estilos inline a un elemento
         */
        apply: function (element, styles) {
            if (typeof element === 'string') {
                element = document.querySelector(element);
            }
            Object.keys(styles).forEach(function (prop) {
                element.style[prop] = styles[prop];
            });
            return element;
        },

        /**
         * Obtener un tema por nombre
         */
        getTheme: function (name) {
            return themes[name] || themes.light;
        },

        /**
         * Aplicar tema a un contenedor
         */
        applyTheme: function (selector, themeName) {
            var el = document.querySelector(selector);
            var theme = themes[themeName] || themes.light;
            currentTheme = themeName;

            el.style.backgroundColor = theme.background;
            el.style.color = theme.color;
            el.style.borderColor = theme.border;
            el.style.transition = 'all 0.3s ease';

            // Aplicar color accent a los botones dentro del contenedor
            var buttons = el.querySelectorAll('button');
            buttons.forEach(function (btn) {
                btn.style.backgroundColor = theme.accent;
                btn.style.color = '#ffffff';
                btn.style.border = 'none';
                btn.style.padding = '8px 16px';
                btn.style.cursor = 'pointer';
                btn.style.borderRadius = '4px';
                btn.style.marginRight = '8px';
            });

            return theme;
        },

        /**
         * Obtener tema actual
         */
        getCurrentTheme: function () {
            return currentTheme;
        },

        /**
         * Listar temas disponibles
         */
        getAvailableThemes: function () {
            return Object.keys(themes);
        }
    };
});
