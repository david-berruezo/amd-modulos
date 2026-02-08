/**
 * EJEMPLO 5 - Plugin Settings (depende de eventbus)
 * Panel de configuración. Emite eventos que otros plugins escuchan.
 */
define(['modules/eventbus'], function (eventBus) {
    'use strict';

    var initialized = false;

    var settings = {
        theme: 'light',
        fontSize: '14',
        notifications: true,
        language: 'es'
    };

    function render(panel) {
        if (initialized) return;
        initialized = true;

        panel.innerHTML =
            '<h3>Configuración</h3>' +
            '<div class="settings-form">' +
                '<div class="setting-item">' +
                    '<label>Tema</label>' +
                    '<select id="setting-theme">' +
                        '<option value="light">Claro</option>' +
                        '<option value="dark">Oscuro</option>' +
                        '<option value="blue">Azul</option>' +
                    '</select>' +
                '</div>' +
                '<div class="setting-item">' +
                    '<label>Tamaño de fuente</label>' +
                    '<input type="range" id="setting-fontsize" min="12" max="22" value="14">' +
                    '<span id="fontsize-value">14px</span>' +
                '</div>' +
                '<div class="setting-item">' +
                    '<label>Notificaciones</label>' +
                    '<label class="toggle">' +
                        '<input type="checkbox" id="setting-notif" checked>' +
                        '<span>Activadas</span>' +
                    '</label>' +
                '</div>' +
                '<div class="setting-item">' +
                    '<label>Idioma</label>' +
                    '<select id="setting-lang">' +
                        '<option value="es">Español</option>' +
                        '<option value="en">English</option>' +
                        '<option value="ca">Català</option>' +
                    '</select>' +
                '</div>' +
                '<button id="save-settings" style="' +
                    'margin-top:16px;padding:10px 20px;background:#4caf50;color:#fff;' +
                    'border:none;border-radius:4px;cursor:pointer;width:100%;font-size:14px;' +
                '">Guardar cambios</button>' +
                '<div id="settings-feedback" style="margin-top:10px;"></div>' +
            '</div>';

        bindEvents();
    }

    function bindEvents() {
        // Tema en tiempo real
        document.getElementById('setting-theme').addEventListener('change', function () {
            settings.theme = this.value;
            eventBus.emit('settings:theme:changed', { theme: this.value });
        });

        // Font size en tiempo real
        document.getElementById('setting-fontsize').addEventListener('input', function () {
            settings.fontSize = this.value;
            document.getElementById('fontsize-value').textContent = this.value + 'px';
            eventBus.emit('settings:fontsize:changed', { fontSize: this.value });
        });

        // Notificaciones
        document.getElementById('setting-notif').addEventListener('change', function () {
            settings.notifications = this.checked;
            this.nextElementSibling.textContent = this.checked ? 'Activadas' : 'Desactivadas';
        });

        // Idioma
        document.getElementById('setting-lang').addEventListener('change', function () {
            settings.language = this.value;
        });

        // Guardar
        document.getElementById('save-settings').addEventListener('click', function () {
            eventBus.emit('settings:saved', settings);
            var feedback = document.getElementById('settings-feedback');
            feedback.innerHTML = '<p style="color:#4caf50;">✅ Configuración guardada</p>';
            setTimeout(function () { feedback.innerHTML = ''; }, 2000);
        });
    }

    return {
        init: function (tabs) {
            var panel = tabs.getPanel('settings');

            eventBus.on('tab:settings:activated', function () {
                render(panel);
            });

            if (tabs.getActiveTab() === 'settings') {
                render(panel);
            }
        },

        getSettings: function () {
            return Object.assign({}, settings);
        }
    };
});
