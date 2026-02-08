/**
 * EJEMPLO 5 - Plugin Dashboard (depende de eventbus)
 * Se activa cuando el tab "dashboard" se muestra.
 * Usa CARGA DIFERIDA (lazy loading): solo carga su contenido
 * cuando el usuario hace click en su tab.
 */
define(['modules/eventbus'], function (eventBus) {
    'use strict';

    var initialized = false;

    function render(panel) {
        if (initialized) return;
        initialized = true;

        panel.innerHTML =
            '<h3>Dashboard</h3>' +
            '<div class="dashboard-grid">' +
                '<div class="dash-card" style="background:#e3f2fd;">' +
                    '<span class="dash-number" id="counter-visits">0</span>' +
                    '<span class="dash-label">Visitas hoy</span>' +
                '</div>' +
                '<div class="dash-card" style="background:#e8f5e9;">' +
                    '<span class="dash-number" id="counter-users">0</span>' +
                    '<span class="dash-label">Usuarios activos</span>' +
                '</div>' +
                '<div class="dash-card" style="background:#fff3e0;">' +
                    '<span class="dash-number" id="counter-tasks">0</span>' +
                    '<span class="dash-label">Tareas completadas</span>' +
                '</div>' +
                '<div class="dash-card" style="background:#fce4ec;">' +
                    '<span class="dash-number" id="counter-messages">0</span>' +
                    '<span class="dash-label">Mensajes</span>' +
                '</div>' +
            '</div>' +
            '<div id="activity-log" style="margin-top:16px;">' +
                '<h4>Actividad reciente</h4>' +
                '<ul id="log-list"></ul>' +
            '</div>';

        // Animar contadores
        animateCounter('counter-visits', 1234);
        animateCounter('counter-users', 89);
        animateCounter('counter-tasks', 456);
        animateCounter('counter-messages', 23);
    }

    /**
     * Animación de contadores
     */
    function animateCounter(elementId, target) {
        var el = document.getElementById(elementId);
        var current = 0;
        var step = Math.ceil(target / 30);
        var interval = setInterval(function () {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 30);
    }

    return {
        /**
         * Inicializar plugin
         * Escucha cuando el tab dashboard se activa.
         */
        init: function (tabs) {
            var panel = tabs.getPanel('dashboard');

            // Escuchar el evento del tab
            eventBus.on('tab:dashboard:activated', function () {
                render(panel);
            });

            // Si el dashboard es el tab activo inicialmente
            if (tabs.getActiveTab() === 'dashboard') {
                render(panel);
            }

            // Escuchar actividad de otros tabs para el log
            eventBus.on('tab:changed', function (data) {
                if (!initialized) return;
                var logList = document.getElementById('log-list');
                if (logList) {
                    var li = document.createElement('li');
                    li.textContent = new Date().toLocaleTimeString() +
                        ' - Navegó de "' + data.previousTab + '" a "' + data.currentTab + '"';
                    li.style.fontSize = '13px';
                    li.style.padding = '4px 0';
                    logList.insertBefore(li, logList.firstChild);
                }
            });
        }
    };
});
