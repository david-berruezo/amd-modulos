/**
 * EJEMPLO 5 - Plugin Todo (depende de eventbus)
 * Lista de tareas que se carga al activar su tab.
 * Emite eventos cuando se completan/crean tareas.
 */
define(['modules/eventbus'], function (eventBus) {
    'use strict';

    var initialized = false;
    var todos = [
        { id: 1, text: 'Revisar módulos AMD', done: true },
        { id: 2, text: 'Practicar con jQuery', done: false },
        { id: 3, text: 'Crear componente de tabs', done: false },
        { id: 4, text: 'Implementar EventBus', done: true },
        { id: 5, text: 'Aprender Grunt', done: false }
    ];
    var nextId = 6;

    function render(panel) {
        panel.innerHTML =
            '<h3>Lista de Tareas</h3>' +
            '<div class="todo-input-row">' +
                '<input type="text" id="todo-input" placeholder="Nueva tarea...">' +
                '<button id="todo-add">Añadir</button>' +
            '</div>' +
            '<div class="todo-filters">' +
                '<button class="todo-filter active" data-filter="all">Todas</button>' +
                '<button class="todo-filter" data-filter="pending">Pendientes</button>' +
                '<button class="todo-filter" data-filter="done">Completadas</button>' +
            '</div>' +
            '<ul id="todo-list"></ul>' +
            '<p id="todo-summary"></p>';

        renderList();
        bindEvents(panel);
    }

    function renderList(filter) {
        filter = filter || 'all';
        var list = document.getElementById('todo-list');
        var summary = document.getElementById('todo-summary');
        list.innerHTML = '';

        var filtered = todos;
        if (filter === 'pending') {
            filtered = todos.filter(function (t) { return !t.done; });
        } else if (filter === 'done') {
            filtered = todos.filter(function (t) { return t.done; });
        }

        filtered.forEach(function (todo) {
            var li = document.createElement('li');
            li.className = 'todo-item' + (todo.done ? ' completed' : '');

            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.done;
            checkbox.addEventListener('change', function () {
                todo.done = this.checked;
                renderList(filter);
                eventBus.emit('todo:toggled', { id: todo.id, done: todo.done });
            });

            var text = document.createElement('span');
            text.textContent = todo.text;
            if (todo.done) {
                text.style.textDecoration = 'line-through';
                text.style.color = '#999';
            }

            var deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✕';
            deleteBtn.className = 'todo-delete';
            deleteBtn.addEventListener('click', function () {
                todos = todos.filter(function (t) { return t.id !== todo.id; });
                renderList(filter);
                eventBus.emit('todo:deleted', { id: todo.id });
            });

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        });

        var pending = todos.filter(function (t) { return !t.done; }).length;
        summary.textContent = pending + ' tareas pendientes de ' + todos.length + ' totales.';
        summary.style.fontSize = '13px';
        summary.style.color = '#666';
        summary.style.marginTop = '10px';
    }

    function bindEvents(panel) {
        // Añadir tarea
        document.getElementById('todo-add').addEventListener('click', addTodo);
        document.getElementById('todo-input').addEventListener('keypress', function (e) {
            if (e.key === 'Enter') addTodo();
        });

        // Filtros
        panel.querySelectorAll('.todo-filter').forEach(function (btn) {
            btn.addEventListener('click', function () {
                panel.querySelectorAll('.todo-filter').forEach(function (b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');
                renderList(this.dataset.filter);
            });
        });
    }

    function addTodo() {
        var input = document.getElementById('todo-input');
        var text = input.value.trim();
        if (!text) return;

        var todo = { id: nextId++, text: text, done: false };
        todos.push(todo);
        input.value = '';
        renderList();

        eventBus.emit('todo:created', { id: todo.id, text: todo.text });
    }

    return {
        init: function (tabs) {
            var panel = tabs.getPanel('todos');

            eventBus.on('tab:todos:activated', function () {
                if (!initialized) {
                    render(panel);
                    initialized = true;
                }
            });

            if (tabs.getActiveTab() === 'todos') {
                render(panel);
                initialized = true;
            }
        }
    };
});
