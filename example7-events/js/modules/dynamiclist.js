/**
 * EJEMPLO 7 - Módulo DynamicList (depende de eventdelegate + template)
 * Lista dinámica que se carga via AJAX simulado.
 * Los eventos funcionan con delegation (no importa cuándo
 * se añade el HTML, los eventos siempre funcionan).
 *
 * Este es el patrón CLAVE de Moodle: contenido cargado
 * dinámicamente + event delegation para que todo funcione.
 */
define(['modules/eventdelegate', 'modules/template'], function (events, template) {
    'use strict';

    return {
        /**
         * Crear una lista dinámica en un contenedor
         */
        create: function (containerSelector, config) {
            var container = document.querySelector(containerSelector);
            var items = config.initialItems || [];
            var nextId = items.length + 1;

            // Registrar templates
            template.register('list-item', config.itemTemplate);
            template.register('list-empty', config.emptyTemplate || '<p class="empty">No hay elementos.</p>');

            /**
             * Renderizar toda la lista
             */
            function render() {
                if (items.length === 0) {
                    container.innerHTML = template.render('list-empty', {});
                    return;
                }

                var html = items.map(function (item) {
                    return template.render('list-item', item);
                }).join('');

                container.innerHTML = html;
            }

            // ==========================================
            // AQUÍ ESTÁ LA CLAVE: EVENT DELEGATION
            // Registramos los eventos UNA VEZ en el
            // contenedor padre. No importa si el HTML
            // se recrea, los eventos siguen funcionando.
            // ==========================================

            // Click en botón eliminar
            events.on(container, 'click', '[data-action="delete"]', function (e, target) {
                var id = parseInt(target.dataset.id);
                items = items.filter(function (item) { return item.id !== id; });
                render();
                if (config.onDelete) config.onDelete(id);
            });

            // Click en botón editar
            events.on(container, 'click', '[data-action="edit"]', function (e, target) {
                var id = parseInt(target.dataset.id);
                var item = items.find(function (i) { return i.id === id; });
                if (item && config.onEdit) config.onEdit(item);
            });

            // Click en botón toggle (ej: favorito, completado)
            events.on(container, 'click', '[data-action="toggle"]', function (e, target) {
                var id = parseInt(target.dataset.id);
                var field = target.dataset.field;
                var item = items.find(function (i) { return i.id === id; });
                if (item && field) {
                    item[field] = !item[field];
                    render();
                    if (config.onToggle) config.onToggle(item, field);
                }
            });

            // Hover en items (para highlight)
            events.on(container, 'mouseenter', '.list-item', function (e, target) {
                target.style.backgroundColor = '#f5f5f5';
            });
            events.on(container, 'mouseleave', '.list-item', function (e, target) {
                target.style.backgroundColor = '';
            });

            // Render inicial
            render();

            // API pública
            return {
                /**
                 * Añadir item
                 */
                add: function (data) {
                    data.id = nextId++;
                    items.push(data);
                    render();
                    return data;
                },

                /**
                 * Actualizar item
                 */
                update: function (id, data) {
                    var item = items.find(function (i) { return i.id === id; });
                    if (item) {
                        Object.keys(data).forEach(function (key) {
                            if (key !== 'id') item[key] = data[key];
                        });
                        render();
                    }
                    return item;
                },

                /**
                 * Simular carga AJAX (añadir items con delay)
                 */
                loadMore: function (newItems, delay) {
                    delay = delay || 800;

                    // Mostrar loading
                    var loadingDiv = document.createElement('div');
                    loadingDiv.className = 'loading-more';
                    loadingDiv.textContent = 'Cargando más...';
                    loadingDiv.style.cssText = 'text-align:center;padding:12px;color:#666;';
                    container.appendChild(loadingDiv);

                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            newItems.forEach(function (item) {
                                item.id = nextId++;
                                items.push(item);
                            });
                            render(); // Re-render completo, pero events siguen funcionando
                            resolve(items);
                        }, delay);
                    });
                },

                /**
                 * Obtener items actuales
                 */
                getItems: function () {
                    return items.slice();
                },

                /**
                 * Destruir (limpiar event delegates)
                 */
                destroy: function () {
                    events.offAll(container);
                    container.innerHTML = '';
                }
            };
        }
    };
});
