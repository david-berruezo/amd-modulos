/**
 * EJEMPLO 4 - Módulo Loading (sin dependencias)
 * Gestiona estados de carga (spinners, overlays).
 */
define(function () {
    'use strict';

    var spinners = {};

    return {
        /**
         * Mostrar spinner en un contenedor
         */
        show: function (selector, message) {
            var el = document.querySelector(selector);
            if (!el) return;

            message = message || 'Cargando...';

            var overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.style.cssText = 'position:relative;text-align:center;padding:40px;color:#666;';

            overlay.innerHTML =
                '<div class="spinner" style="' +
                    'display:inline-block;width:40px;height:40px;' +
                    'border:4px solid #e0e0e0;border-top:4px solid #0066cc;' +
                    'border-radius:50%;animation:spin 0.8s linear infinite;' +
                '"></div>' +
                '<p style="margin-top:12px;font-size:14px;">' + message + '</p>';

            // Inyectar keyframes si no existen
            if (!document.getElementById('loading-keyframes')) {
                var style = document.createElement('style');
                style.id = 'loading-keyframes';
                style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }

            el.innerHTML = '';
            el.appendChild(overlay);
            spinners[selector] = overlay;
        },

        /**
         * Ocultar spinner
         */
        hide: function (selector) {
            var el = document.querySelector(selector);
            if (el && spinners[selector]) {
                el.removeChild(spinners[selector]);
                delete spinners[selector];
            }
        },

        /**
         * Mostrar mensaje de error
         */
        showError: function (selector, message) {
            var el = document.querySelector(selector);
            if (!el) return;

            el.innerHTML =
                '<div style="text-align:center;padding:20px;color:#f44336;">' +
                    '<p style="font-size:24px;">⚠</p>' +
                    '<p>' + message + '</p>' +
                    '<button class="retry-btn" style="' +
                        'margin-top:10px;padding:8px 16px;background:#f44336;color:#fff;' +
                        'border:none;border-radius:4px;cursor:pointer;' +
                    '">Reintentar</button>' +
                '</div>';

            return el.querySelector('.retry-btn');
        },

        /**
         * Inline loading (para botones)
         */
        buttonLoading: function (button, loading) {
            if (loading) {
                button.dataset.originalText = button.textContent;
                button.textContent = 'Cargando...';
                button.disabled = true;
                button.style.opacity = '0.6';
            } else {
                button.textContent = button.dataset.originalText || button.textContent;
                button.disabled = false;
                button.style.opacity = '1';
            }
        }
    };
});
