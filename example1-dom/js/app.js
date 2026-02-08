/**
 * EJEMPLO 1 - Entry Point (app.js)
 *
 * Carga los módulos con require() y los usa para:
 * - Crear divs dinámicamente
 * - Cambiar temas de color
 * - Mostrar notificaciones
 */
require(['modules/dom', 'modules/styles', 'modules/notification'], function (dom, styles, notification) {
    'use strict';

    // =============================================
    // SECCIÓN 1: Crear contenido dinámico con DOM
    // =============================================

    var mainContent = dom.get('#main-content');

    // Crear un panel de cards dinámicamente
    var cardData = [
        { title: 'Módulo DOM', desc: 'Manipula elementos del DOM fácilmente.' },
        { title: 'Módulo Styles', desc: 'Aplica temas y estilos dinámicos.' },
        { title: 'Módulo Notification', desc: 'Muestra notificaciones animadas.' }
    ];

    var cardsContainer = dom.create('div', '', 'cards-container');
    styles.apply(cardsContainer, {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '20px'
    });

    cardData.forEach(function (data) {
        var card = dom.create('div', '', 'card');
        styles.apply(card, {
            flex: '1',
            minWidth: '200px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        });

        var title = dom.create('h3', data.title);
        var desc = dom.create('p', data.desc);
        styles.apply(desc, { color: '#666', fontSize: '14px' });

        dom.append(card, title);
        dom.append(card, desc);
        dom.append(cardsContainer, card);
    });

    dom.append(mainContent, cardsContainer);

    // =============================================
    // SECCIÓN 2: Botones de tema
    // =============================================

    var themeSection = dom.get('#theme-section');
    var themeNames = styles.getAvailableThemes();

    themeNames.forEach(function (name) {
        var btn = dom.create('button', 'Tema: ' + name, 'btn-theme');
        btn.addEventListener('click', function () {
            styles.applyTheme('#app', name);
            notification.info('Tema cambiado a: ' + name);
        });
        dom.append(themeSection, btn);
    });

    // =============================================
    // SECCIÓN 3: Botones de notificación
    // =============================================

    var notifSection = dom.get('#notification-section');

    var notifTypes = [
        { type: 'success', text: '¡Operación completada!', label: 'Success' },
        { type: 'error',   text: 'Algo salió mal.',       label: 'Error' },
        { type: 'warning', text: 'Cuidado con esto.',     label: 'Warning' },
        { type: 'info',    text: 'Información útil.',     label: 'Info' }
    ];

    notifTypes.forEach(function (item) {
        var btn = dom.create('button', item.label, 'btn-notif');
        btn.addEventListener('click', function () {
            notification[item.type](item.text);
        });
        dom.append(notifSection, btn);
    });

    // Botón limpiar
    var clearBtn = dom.create('button', 'Limpiar todo', 'btn-clear');
    clearBtn.addEventListener('click', function () {
        notification.clearAll();
    });
    dom.append(notifSection, clearBtn);

    // =============================================
    // SECCIÓN 4: Toggle de paneles
    // =============================================

    var toggleBtn = dom.get('#toggle-panel');
    toggleBtn.addEventListener('click', function () {
        dom.toggle('#hidden-panel');
        notification.info('Panel toggled');
    });

    // Aplicar tema inicial
    styles.applyTheme('#app', 'light');

    notification.success('¡App cargada correctamente!', 2000);
});
