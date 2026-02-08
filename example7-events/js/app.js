/**
 * EJEMPLO 7 - Entry Point
 *
 * Demuestra EVENT DELEGATION + TEMPLATES:
 * El contenido HTML se puede recrear completamente
 * (simula contenido AJAX) y los eventos siguen funcionando
 * porque están delegados al contenedor padre.
 */
require(['modules/dynamiclist', 'modules/template'], function (dynamicList, template) {
    'use strict';

    var logPanel = document.getElementById('event-log');

    function log(message) {
        var entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = '<span class="log-time">' + new Date().toLocaleTimeString() + '</span> ' + message;
        logPanel.insertBefore(entry, logPanel.firstChild);

        // Máximo 20 entradas
        while (logPanel.children.length > 20) {
            logPanel.removeChild(logPanel.lastChild);
        }
    }

    // =============================================
    // LISTA DE PRODUCTOS (con templates)
    // =============================================

    var productList = dynamicList.create('#product-list', {
        initialItems: [
            { id: 1, name: 'Laptop Pro 15"', price: 1299, favorite: false, inStock: true },
            { id: 2, name: 'Monitor 4K 27"', price: 549,  favorite: true,  inStock: true },
            { id: 3, name: 'Teclado mecánico', price: 129,  favorite: false, inStock: false },
            { id: 4, name: 'Mouse ergonómico', price: 79,   favorite: true,  inStock: true },
            { id: 5, name: 'Webcam HD',        price: 89,   favorite: false, inStock: true }
        ],

        // Template para cada item (usa la syntax {{variable}})
        itemTemplate:
            '<div class="list-item product-item" data-id="{{id}}">' +
                '<div class="item-main">' +
                    '<span class="item-name">{{name}}</span>' +
                    '<span class="item-price">{{price}} €</span>' +
                '</div>' +
                '<div class="item-actions">' +
                    '<button data-action="toggle" data-id="{{id}}" data-field="favorite" class="btn-fav" title="Favorito">{{favIcon}}</button>' +
                    '<button data-action="toggle" data-id="{{id}}" data-field="inStock" class="btn-stock" title="Stock">{{stockIcon}}</button>' +
                    '<button data-action="edit" data-id="{{id}}" class="btn-edit" title="Editar">✏️</button>' +
                    '<button data-action="delete" data-id="{{id}}" class="btn-del" title="Eliminar">🗑️</button>' +
                '</div>' +
            '</div>',

        emptyTemplate: '<p class="empty">No hay productos. ¡Añade uno!</p>',

        // Callbacks
        onDelete: function (id) {
            log('🗑️ Producto <strong>ID ' + id + '</strong> eliminado');
        },
        onEdit: function (item) {
            log('✏️ Editando: <strong>' + item.name + '</strong>');
            document.getElementById('f-name').value = item.name;
            document.getElementById('f-price').value = item.price;
            document.getElementById('edit-id').value = item.id;
            document.getElementById('btn-add').textContent = 'Actualizar';
        },
        onToggle: function (item, field) {
            var value = item[field] ? 'Sí' : 'No';
            log('🔄 <strong>' + item.name + '</strong> → ' + field + ': ' + value);
        }
    });

    // =============================================
    // FORMULARIO: Añadir / Actualizar
    // =============================================

    document.getElementById('product-form').addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('f-name').value.trim();
        var price = parseFloat(document.getElementById('f-price').value);
        var editId = document.getElementById('edit-id').value;

        if (!name || isNaN(price)) return;

        if (editId) {
            // Actualizar
            productList.update(parseInt(editId), { name: name, price: price });
            log('✅ Producto <strong>ID ' + editId + '</strong> actualizado');
            document.getElementById('edit-id').value = '';
            document.getElementById('btn-add').textContent = 'Añadir';
        } else {
            // Crear
            var newItem = productList.add({
                name: name,
                price: price,
                favorite: false,
                inStock: true
            });
            log('✅ Producto <strong>' + name + '</strong> creado (ID: ' + newItem.id + ')');
        }

        this.reset();
    });

    // =============================================
    // CARGAR MÁS (simula AJAX)
    // =============================================

    document.getElementById('btn-load-more').addEventListener('click', function () {
        var btn = this;
        btn.disabled = true;
        btn.textContent = 'Cargando...';

        log('⏳ Cargando más productos...');

        productList.loadMore([
            { name: 'SSD 1TB NVMe',      price: 109,  favorite: false, inStock: true },
            { name: 'RAM 32GB DDR5',      price: 159,  favorite: false, inStock: true },
            { name: 'Hub USB-C',          price: 49,   favorite: false, inStock: false }
        ], 1500).then(function (items) {
            btn.disabled = false;
            btn.textContent = 'Cargar más (simula AJAX)';
            log('✅ <strong>3 productos</strong> cargados. Total: ' + items.length);
        });
    });

    log('🚀 App inicializada. Los eventos usan <strong>Event Delegation</strong>.');
});
