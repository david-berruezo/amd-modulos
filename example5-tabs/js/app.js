/**
 * EJEMPLO 5 - Entry Point
 *
 * Concepto clave: Los plugins NO se conocen entre sí.
 * Se comunican a través del EventBus (patrón pub/sub).
 *
 * require.config define alias de paths para organizar mejor.
 */
require.config({
    baseUrl: 'js',
    paths: {
        // Alias para la carpeta de plugins
        'plugins': 'plugins'
    }
});

require([
    'modules/tabs',
    'modules/eventbus',
    'plugins/dashboard',
    'plugins/todo',
    'plugins/settings'
], function (tabs, eventBus, dashboardPlugin, todoPlugin, settingsPlugin) {
    'use strict';

    // =============================================
    // Crear el sistema de tabs
    // =============================================

    var tabSystem = tabs.create('#tab-container', [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'todos',     label: 'Tareas',    icon: '✅' },
        { id: 'settings',  label: 'Ajustes',   icon: '⚙️' }
    ]);

    // =============================================
    // Inicializar plugins (cada uno escucha sus eventos)
    // =============================================

    dashboardPlugin.init(tabSystem);
    todoPlugin.init(tabSystem);
    settingsPlugin.init(tabSystem);

    // =============================================
    // Escuchar eventos globales desde el app
    // =============================================

    // Cuando el tema cambia, aplicar al contenedor
    eventBus.on('settings:theme:changed', function (data) {
        var app = document.getElementById('app');
        var themes = {
            light: { bg: '#ffffff', color: '#333333' },
            dark:  { bg: '#1a1a2e', color: '#e0e0e0' },
            blue:  { bg: '#e3f2fd', color: '#0d47a1' }
        };
        var theme = themes[data.theme] || themes.light;
        app.style.backgroundColor = theme.bg;
        app.style.color = theme.color;
        app.style.transition = 'all 0.3s ease';
    });

    // Cuando cambia el font size
    eventBus.on('settings:fontsize:changed', function (data) {
        document.getElementById('app').style.fontSize = data.fontSize + 'px';
    });

    // Cuando se guarda la configuración
    eventBus.on('settings:saved', function (settings) {
        console.log('Settings guardados:', settings);
    });

    // Log de todos los cambios de tab
    eventBus.on('tab:changed', function (data) {
        console.log('Tab cambió: ' + data.previousTab + ' → ' + data.currentTab);
    });

    // Log de eventos de todo
    eventBus.on('todo:created', function (data) {
        console.log('Nueva tarea:', data.text);
    });

    eventBus.on('todo:toggled', function (data) {
        console.log('Tarea ' + data.id + ' → ' + (data.done ? 'completada' : 'pendiente'));
    });

    // Debug: mostrar eventos registrados
    console.log('EventBus debug:', eventBus.debug());
});
