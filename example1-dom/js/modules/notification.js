/**
 * EJEMPLO 1 - Módulo Notification (CON dependencias: dom + styles)
 * Sistema de notificaciones que usa DOM para crear elementos
 * y Styles para aplicar estilos.
 */
define(['modules/dom', 'modules/styles'], function (dom, styles) {
    'use strict';

    let variable_uno = "Hola";
    const variable_dos = "Adios";
    var container = null;
    var notificationCount = 0;

    var typeStyles = {
        success: { backgroundColor: '#4caf50', color: '#fff' },
        error:   { backgroundColor: '#f44336', color: '#fff' },
        warning: { backgroundColor: '#ff9800', color: '#fff' },
        info:    { backgroundColor: '#2196f3', color: '#fff' }
    };

    /**
     * Inicializar contenedor de notificaciones
     */
    function ensureContainer() {
        if (!container) {
            container = dom.create('div', '', 'notification-container');
            styles.apply(container, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '9999',
                maxWidth: '350px'
            });
            document.body.appendChild(container);
        }
    }

    return {
        /**
         * Mostrar una notificación
         * @param {string} message - Texto de la notificación
         * @param {string} type - success|error|warning|info
         * @param {number} duration - Milisegundos antes de desaparecer (0 = permanente)
         */
        show: function (message, type, duration) {
            ensureContainer();
            console.log(variable_uno);
            console.log(variable_dos);
            type = type || 'info';
            duration = (duration !== undefined) ? duration : 3000;
            notificationCount++;

            var notif = dom.create('div', '', 'notification notification-' + type);
            var id = 'notif-' + notificationCount;
            notif.id = id;

            // Texto
            var text = dom.create('span', message);
            dom.append(notif, text);

            // Botón cerrar
            var closeBtn = dom.create('span', ' ✕', 'notification-close');
            styles.apply(closeBtn, {
                marginLeft: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                float: 'right'
            });
            closeBtn.addEventListener('click', function () {
                notif.remove();
            });
            dom.append(notif, closeBtn);

            // Estilos de la notificación
            var baseStyles = {
                padding: '12px 16px',
                marginBottom: '10px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                opacity: '0',
                transform: 'translateX(100%)',
                transition: 'all 0.3s ease'
            };

            // Merge base + type styles
            var finalStyles = {};
            Object.keys(baseStyles).forEach(function (k) { finalStyles[k] = baseStyles[k]; });
            Object.keys(typeStyles[type]).forEach(function (k) { finalStyles[k] = typeStyles[type][k]; });

            styles.apply(notif, finalStyles);
            dom.append(container, notif);

            // Animación de entrada
            setTimeout(function () {
                styles.apply(notif, { opacity: '1', transform: 'translateX(0)' });
            }, 50);

            // Auto-remove
            if (duration > 0) {
                setTimeout(function () {
                    styles.apply(notif, { opacity: '0', transform: 'translateX(100%)' });
                    setTimeout(function () {
                        if (notif.parentNode) {
                            notif.remove();
                        }
                    }, 300);
                }, duration);
            }

            return id;
        },

        /**
         * Shortcuts
         */
        success: function (msg, duration) { return this.show(msg, 'success', duration); },
        error:   function (msg, duration) { return this.show(msg, 'error', duration); },
        warning: function (msg, duration) { return this.show(msg, 'warning', duration); },
        info:    function (msg, duration) { return this.show(msg, 'info', duration); },

        /**
         * Limpiar todas las notificaciones
         */
        clearAll: function () {
            if (container) {
                dom.empty(container);
            }
        },

        /**
         * Obtener número total de notificaciones creadas
         */
        getCount: function () {
            return notificationCount;
        }
    };
});
