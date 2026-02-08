/**
 * EJEMPLO 3 - Módulo Modal (depende de jQuery)
 * Crea modales dinámicos estilo diálogo.
 */
define(['jquery'], function ($) {
    'use strict';

    var $overlay = null;
    var $modal = null;
    var isOpen = false;

    /**
     * Crear la estructura del modal (solo una vez)
     */
    function ensureModal() {
        if ($overlay) return;

        // Overlay
        $overlay = $('<div>').addClass('modal-overlay').css({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 10000,
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center'
        });

        // Modal container
        $modal = $('<div>').addClass('modal-container').css({
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '0',
            minWidth: '400px',
            maxWidth: '600px',
            maxHeight: '80vh',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            transform: 'scale(0.8)',
            opacity: 0,
            transition: 'all 0.3s ease'
        });

        // Header
        var $header = $('<div>').addClass('modal-header').css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #eee',
            backgroundColor: '#f8f9fa'
        });

        var $title = $('<h3>').addClass('modal-title').css({ margin: 0, fontSize: '18px' });
        var $closeBtn = $('<button>').addClass('modal-close').text('✕').css({
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666',
            padding: '0 4px'
        });
        $closeBtn.on('click', function () { close(); });
        $header.append($title).append($closeBtn);

        // Body
        var $body = $('<div>').addClass('modal-body').css({
            padding: '20px',
            overflowY: 'auto',
            maxHeight: '50vh'
        });

        // Footer
        var $footer = $('<div>').addClass('modal-footer').css({
            padding: '12px 20px',
            borderTop: '1px solid #eee',
            textAlign: 'right',
            display: 'none'
        });

        $modal.append($header).append($body).append($footer);
        $overlay.append($modal);
        $('body').append($overlay);

        // Cerrar al hacer click en overlay
        $overlay.on('click', function (e) {
            if ($(e.target).is($overlay)) {
                close();
            }
        });

        // Cerrar con Escape
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        });
    }

    /**
     * Cerrar modal con animación
     */
    function close() {
        if (!isOpen) return;
        $modal.css({ transform: 'scale(0.8)', opacity: 0 });
        setTimeout(function () {
            $overlay.css('display', 'none');
            isOpen = false;
        }, 300);
    }

    return {
        /**
         * Abrir modal
         * @param {string} title - Título del modal
         * @param {string} htmlContent - Contenido HTML
         * @param {function} onConfirm - Si se pasa, muestra botón "Confirmar"
         */
        open: function (title, htmlContent, onConfirm) {
            ensureModal();

            $modal.find('.modal-title').text(title);
            $modal.find('.modal-body').html(htmlContent);

            var $footer = $modal.find('.modal-footer');
            $footer.empty();

            if (onConfirm) {
                $footer.css('display', 'block');

                var $cancelBtn = $('<button>').text('Cancelar').css({
                    padding: '8px 16px',
                    marginRight: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#fff',
                    cursor: 'pointer'
                });
                $cancelBtn.on('click', close);

                var $confirmBtn = $('<button>').text('Confirmar').css({
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#0066cc',
                    color: '#fff',
                    cursor: 'pointer'
                });
                $confirmBtn.on('click', function () {
                    onConfirm($modal.find('.modal-body'));
                });

                $footer.append($cancelBtn).append($confirmBtn);
            } else {
                $footer.css('display', 'none');
            }

            $overlay.css('display', 'flex');

            // Trigger animación
            setTimeout(function () {
                $modal.css({ transform: 'scale(1)', opacity: 1 });
            }, 50);

            isOpen = true;
        },

        /**
         * Cerrar modal
         */
        close: close,

        /**
         * Comprobar si está abierto
         */
        isOpen: function () {
            return isOpen;
        }
    };
});
