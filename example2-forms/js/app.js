/**
 * EJEMPLO 2 - Entry Point
 *
 * Crea dos formularios:
 * 1. Registro de usuario (con validación)
 * 2. Formulario de contacto (con validación)
 *
 * Muestra los datos enviados en un panel de resultados.
 */
require(['modules/formhandler', 'modules/validator'], function (formHandler, validator) {
    'use strict';

    var resultsPanel = document.getElementById('results');

    /**
     * Mostrar resultado en el panel
     */
    function showResult(title, data) {
        var entry = document.createElement('div');
        entry.style.padding = '12px';
        entry.style.marginBottom = '10px';
        entry.style.backgroundColor = '#e8f5e9';
        entry.style.borderRadius = '6px';
        entry.style.borderLeft = '4px solid #4caf50';

        var h4 = document.createElement('h4');
        h4.textContent = title;
        h4.style.marginBottom = '8px';
        entry.appendChild(h4);

        Object.keys(data).forEach(function (key) {
            var p = document.createElement('p');
            p.innerHTML = '<strong>' + key + ':</strong> ' + data[key];
            p.style.fontSize = '14px';
            p.style.margin = '2px 0';
            entry.appendChild(p);
        });

        resultsPanel.insertBefore(entry, resultsPanel.firstChild);
    }

    // =================================================
    // FORMULARIO 1: Registro de usuario
    // =================================================

    formHandler.create('#form-register', {
        formId: 'registerForm',
        submitLabel: 'Registrarse',
        fields: [
            {
                name: 'username',
                label: 'Nombre de usuario',
                type: 'text',
                placeholder: 'Ej: david_dev',
                rules: [
                    validator.required,
                    validator.minLength(3),
                    validator.maxLength(20),
                    validator.pattern(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guion bajo.')
                ]
            },
            {
                name: 'email',
                label: 'Email',
                type: 'email',
                placeholder: 'tu@email.com',
                rules: [
                    validator.required,
                    validator.email
                ]
            },
            {
                name: 'age',
                label: 'Edad',
                type: 'number',
                placeholder: '18-99',
                rules: [
                    validator.required,
                    validator.numeric,
                    validator.range(18, 99)
                ]
            },
            {
                name: 'role',
                label: 'Rol',
                type: 'select',
                options: [
                    { value: 'student', label: 'Estudiante' },
                    { value: 'teacher', label: 'Profesor' },
                    { value: 'admin',   label: 'Administrador' }
                ],
                rules: [
                    validator.required
                ]
            }
        ],
        onSuccess: function (values, form) {
            showResult('✅ Registro exitoso', values);
            form.reset();
        }
    });

    // =================================================
    // FORMULARIO 2: Contacto
    // =================================================

    formHandler.create('#form-contact', {
        formId: 'contactForm',
        submitLabel: 'Enviar mensaje',
        fields: [
            {
                name: 'name',
                label: 'Nombre completo',
                type: 'text',
                placeholder: 'Tu nombre',
                rules: [
                    validator.required,
                    validator.minLength(2)
                ]
            },
            {
                name: 'contact_email',
                label: 'Email de contacto',
                type: 'email',
                placeholder: 'tu@email.com',
                rules: [
                    validator.required,
                    validator.email
                ]
            },
            {
                name: 'subject',
                label: 'Asunto',
                type: 'text',
                placeholder: 'Asunto del mensaje',
                rules: [
                    validator.required,
                    validator.minLength(5),
                    validator.maxLength(100)
                ]
            },
            {
                name: 'message',
                label: 'Mensaje',
                type: 'textarea',
                rows: 5,
                placeholder: 'Escribe tu mensaje aquí...',
                rules: [
                    validator.required,
                    validator.minLength(10),
                    validator.maxLength(500)
                ]
            }
        ],
        onSuccess: function (values, form) {
            showResult('📧 Mensaje enviado', values);
            form.reset();
        }
    });
});
