/**
 * EJEMPLO 2 - Módulo FormHandler (CON dependencias: validator + formbuilder)
 * Conecta la creación de formularios con la validación.
 * Es el "puente" entre los dos módulos sin dependencias.
 */
define(['modules/validator', 'modules/formbuilder'], function (validator, formBuilder) {
    'use strict';

    return {
        /**
         * Crear un formulario con validación integrada.
         *
         * @param {string} containerId - Selector del contenedor
         * @param {object} config - Configuración del formulario
         * @param {string} config.formId - ID del formulario
         * @param {string} config.submitLabel - Texto del botón
         * @param {Array} config.fields - Campos con sus reglas de validación
         * @param {function} config.onSuccess - Callback al enviar con éxito
         */
        create: function (containerId, config) {
            var container = document.querySelector(containerId);

            // Definir reglas de validación por campo
            var validationRules = {};
            config.fields.forEach(function (field) {
                if (field.rules) {
                    validationRules[field.name] = field.rules;
                }
            });

            // Construir formulario con formBuilder
            var formInstance = formBuilder.build(
                config.formId,
                config.fields,
                config.submitLabel
            );

            // Handler de submit con validación
            formInstance.form.addEventListener('submit', function (e) {
                e.preventDefault();
                formInstance.clearErrors();

                var values = formInstance.getValues();
                var hasErrors = false;

                // Validar cada campo que tenga reglas
                Object.keys(validationRules).forEach(function (fieldName) {
                    var rules = validationRules[fieldName];
                    var error = validator.validate(values[fieldName], rules);

                    if (error) {
                        formInstance.showError(fieldName, error);
                        hasErrors = true;
                    }
                });

                if (!hasErrors && config.onSuccess) {
                    config.onSuccess(values, formInstance);
                }
            });

            // Validación en tiempo real (on blur)
            config.fields.forEach(function (field) {
                if (field.rules) {
                    var ref = formInstance.getField(field.name);
                    if (ref) {
                        ref.input.addEventListener('blur', function () {
                            var error = validator.validate(ref.input.value, field.rules);
                            if (error) {
                                formInstance.showError(field.name, error);
                            } else {
                                ref.errorSpan.style.display = 'none';
                                ref.input.style.borderColor = '#4caf50';
                            }
                        });
                    }
                }
            });

            // Insertar en el DOM
            container.appendChild(formInstance.form);

            return formInstance;
        }
    };
});
