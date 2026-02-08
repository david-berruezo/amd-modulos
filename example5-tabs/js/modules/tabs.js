/**
 * EJEMPLO 5 - Módulo Tabs (depende de eventbus)
 * Sistema de pestañas que emite eventos cuando cambia de tab.
 * Otros módulos pueden escuchar esos eventos.
 */
define(['modules/eventbus'], function (eventBus) {
    'use strict';

    return {
        /**
         * Crear un sistema de tabs
         * @param {string} containerSelector - Contenedor
         * @param {Array} tabsConfig - Configuración de tabs
         * @returns {object} API de tabs
         */
        create: function (containerSelector, tabsConfig) {
            var container = document.querySelector(containerSelector);
            var activeTab = tabsConfig[0].id;

            // Contenedor de tabs
            var tabBar = document.createElement('div');
            tabBar.className = 'tab-bar';

            // Contenedor de paneles
            var panelContainer = document.createElement('div');
            panelContainer.className = 'tab-panels';

            tabsConfig.forEach(function (tab) {
                // Botón del tab
                var button = document.createElement('button');
                button.className = 'tab-button';
                button.textContent = tab.icon ? tab.icon + ' ' + tab.label : tab.label;
                button.dataset.tabId = tab.id;

                button.addEventListener('click', function () {
                    activateTab(tab.id);
                });

                tabBar.appendChild(button);

                // Panel del tab
                var panel = document.createElement('div');
                panel.className = 'tab-panel';
                panel.id = 'panel-' + tab.id;
                panel.style.display = 'none';
                panelContainer.appendChild(panel);
            });

            container.appendChild(tabBar);
            container.appendChild(panelContainer);

            /**
             * Activar un tab
             */
            function activateTab(tabId) {
                var previousTab = activeTab;
                activeTab = tabId;

                // Actualizar botones
                tabBar.querySelectorAll('.tab-button').forEach(function (btn) {
                    btn.classList.remove('active');
                    if (btn.dataset.tabId === tabId) {
                        btn.classList.add('active');
                    }
                });

                // Actualizar paneles
                panelContainer.querySelectorAll('.tab-panel').forEach(function (panel) {
                    panel.style.display = 'none';
                });
                var activePanel = document.getElementById('panel-' + tabId);
                if (activePanel) {
                    activePanel.style.display = 'block';
                }

                // Emitir evento (otros módulos pueden escuchar esto)
                eventBus.emit('tab:changed', {
                    currentTab: tabId,
                    previousTab: previousTab
                });

                // Evento específico del tab
                eventBus.emit('tab:' + tabId + ':activated', { tabId: tabId });
            }

            // Activar el primer tab
            activateTab(tabsConfig[0].id);

            return {
                activate: activateTab,
                getActiveTab: function () { return activeTab; },
                getPanel: function (tabId) {
                    return document.getElementById('panel-' + tabId);
                }
            };
        }
    };
});
