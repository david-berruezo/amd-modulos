/**
 * EJEMPLO 2 - Módulo FormBuilder (sin dependencias)
 * Crea campos de formulario dinámicamente.
 */
define(function () {
    'use strict';

    /**
     * Crear un wrapper para un campo con label + input + error
     */
    function createFieldWrapper(config) {
        var wrapper = document.createElement('div');
        wrapper.className = 'form-group';
        wrapper.style.marginBottom = '16px';

        // Label
        var label = document.createElement('label');
        label.textContent = config.label;
        label.setAttribute('for', config.name);
        label.style.display = 'block';
        label.style.marginBottom = '4px';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '14px';
        wrapper.appendChild(label);

        // Input o textarea o select
        var input;

        if (config.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = config.rows || 4;
        } else if (config.type === 'select') {
            input = document.createElement('select');
            // Opción vacía
            var emptyOpt = document.createElement('option');
            emptyOpt.value = '';
            emptyOpt.textContent = '-- Selecciona --';
            input.appendChild(emptyOpt);
            // Opciones
            (config.options || []).forEach(function (opt) {
                var option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = config.type || 'text';
        }

        input.name = config.name;
        input.id = config.name;
        input.placeholder = config.placeholder || '';
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.fontSize = '14px';
        input.style.boxSizing = 'border-box';
        wrapper.appendChild(input);

        // Contenedor de error
        var errorSpan = document.createElement('span');
        errorSpan.className = 'field-error';
        errorSpan.style.color = '#f44336';
        errorSpan.style.fontSize = '12px';
        errorSpan.style.display = 'none';
        wrapper.appendChild(errorSpan);

        return {
            wrapper: wrapper,
            input: input,
            errorSpan: errorSpan
        };
    }

    return {
        /**
         * Construir un formulario completo a partir de una configuración
         * @param {string} formId - ID del formulario
         * @param {Array} fields - Array de configuraciones de campo
         * @param {string} submitLabel - Texto del botón submit
         * @returns {object} { form, getValues, showError, clearErrors, reset }
         */
        build: function (formId, fields, submitLabel) {
            var form = document.createElement('form');
            form.id = formId;
            form.setAttribute('novalidate', 'true');

            var fieldRefs = {};

            // Crear cada campo
            fields.forEach(function (config) {
                var field = createFieldWrapper(config);
                fieldRefs[config.name] = field;
                form.appendChild(field.wrapper);
            });

            // Botón submit
            var submitBtn = document.createElement('button');
            submitBtn.type = 'submit';
            submitBtn.textContent = submitLabel || 'Enviar';
            submitBtn.style.padding = '10px 24px';
            submitBtn.style.backgroundColor = '#0066cc';
            submitBtn.style.color = '#fff';
            submitBtn.style.border = 'none';
            submitBtn.style.borderRadius = '4px';
            submitBtn.style.cursor = 'pointer';
            submitBtn.style.fontSize = '16px';
            submitBtn.style.marginTop = '8px';
            form.appendChild(submitBtn);

            return {
                form: form,

                /**
                 * Obtener valores de todos los campos
                 */
                getValues: function () {
                    var values = {};
                    Object.keys(fieldRefs).forEach(function (name) {
                        values[name] = fieldRefs[name].input.value;
                    });
                    return values;
                },

                /**
                 * Mostrar error en un campo
                 */
                showError: function (fieldName, message) {
                    var ref = fieldRefs[fieldName];
                    if (ref) {
                        ref.errorSpan.textContent = message;
                        ref.errorSpan.style.display = 'block';
                        ref.input.style.borderColor = '#f44336';
                    }
                },

                /**
                 * Limpiar todos los errores
                 */
                clearErrors: function () {
                    Object.keys(fieldRefs).forEach(function (name) {
                        fieldRefs[name].errorSpan.style.display = 'none';
                        fieldRefs[name].errorSpan.textContent = '';
                        fieldRefs[name].input.style.borderColor = '#ccc';
                    });
                },

                /**
                 * Resetear formulario
                 */
                reset: function () {
                    form.reset();
                    this.clearErrors();
                },

                /**
                 * Obtener referencia directa a un campo
                 */
                getField: function (name) {
                    return fieldRefs[name];
                }
            };
        }
    };
});
