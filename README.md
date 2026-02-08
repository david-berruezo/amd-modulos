# AMD Practice - 7 Ejemplos Progresivos

## Instalación rápida

```bash
npm install
node setup.js
```

## Ejecutar un ejemplo

```bash
npx grunt serve --example=example1-dom
npx grunt serve --example=example2-forms
npx grunt serve --example=example3-jquery
npx grunt serve --example=example4-ajax
npx grunt serve --example=example5-tabs
npx grunt serve --example=example6-crud
npx grunt serve --example=example7-events
```

Se abre en http://localhost:9000 con livereload.

---

## Los 7 ejemplos

### Ejemplo 1 — Manipulación DOM + Notificaciones
**Módulos:** `dom.js` (sin deps) → `styles.js` (sin deps) → `notification.js` (depende de ambos)

Aprenderás: `define()` básico, inyección de dependencias, manipulación DOM sin jQuery.

### Ejemplo 2 — Formularios con Validación
**Módulos:** `validator.js` (sin deps) → `formbuilder.js` (sin deps) → `formhandler.js` (depende de ambos)

Aprenderás: Funciones que devuelven funciones (closures), validación en tiempo real, creación dinámica de formularios.

### Ejemplo 3 — jQuery + AMD (⭐ clave para Moodle)
**Módulos:** `datatable.js` (depende de jquery) → `modal.js` (depende de jquery)

Aprenderás: `require.config()` con paths, cargar jQuery desde CDN como módulo AMD, usar `$` dentro de módulos.

### Ejemplo 4 — API/AJAX simulado
**Módulos:** `api.js` (sin deps, simula backend) → `loading.js` (sin deps) → `courseui.js` (depende de ambos)

Aprenderás: Promises dentro de módulos AMD, estados de carga (spinners), manejo de errores, patrón similar a `core/ajax` de Moodle.

### Ejemplo 5 — Tabs + EventBus + Plugins (⭐ arquitectura Moodle)
**Módulos:** `eventbus.js` (sin deps) → `tabs.js` (depende de eventbus) + 3 plugins independientes

Aprenderás: Patrón Publisher/Subscriber, plugins desacoplados que se comunican por eventos, carga lazy (solo renderiza cuando el tab se activa).

### Ejemplo 6 — CRUD Completo (MVC)
**Módulos:** `storage.js` (sin deps) → `studentmodel.js` (depende de storage) → `studentview.js` (depende de model)

Aprenderás: Cadena de 3 niveles de dependencias, patrón Model-View, persistencia con localStorage, CRUD completo.

### Ejemplo 7 — Event Delegation + Templates (⭐ patrón clave Moodle)
**Módulos:** `eventdelegate.js` (sin deps) → `template.js` (sin deps) → `dynamiclist.js` (depende de ambos)

Aprenderás: Event delegation (eventos en el padre que capturan clicks de hijos dinámicos), motor de templates tipo Mustache, contenido que se recarga por "AJAX" y sigue respondiendo a eventos.

---

## Mapa de dependencias

```
Ejemplo 1:  dom ─────────┐
            styles ──────┼──→ notification ──→ app.js
                         │
Ejemplo 2:  validator ───┐
            formbuilder ─┼──→ formhandler ──→ app.js
                         │
Ejemplo 3:  jquery ──────┼──→ datatable ────┐
                         └──→ modal ────────┼──→ app.js
                                            │
Ejemplo 4:  api ─────────┐                  │
            loading ─────┼──→ courseui ─────→ app.js
                         │
Ejemplo 5:  eventbus ────┼──→ tabs ─────────┐
                         ├──→ dashboard ────┤
                         ├──→ todo ─────────┼──→ app.js
                         └──→ settings ─────┘
                         
Ejemplo 6:  storage ──→ studentmodel ──→ studentview ──→ app.js

Ejemplo 7:  eventdelegate ──┐
            template ───────┼──→ dynamiclist ──→ app.js
```

## Conceptos AMD esenciales

| Concepto | Código |
|----------|--------|
| Módulo sin deps | `define(function() { return {...}; });` |
| Módulo con deps | `define(['dep1', 'dep2'], function(d1, d2) { return {...}; });` |
| Entry point | `require(['modulo'], function(mod) { mod.init(); });` |
| Config paths | `require.config({ paths: { jquery: 'url' } });` |
| Carga lazy | `require(['heavy-module'], function(m) { ... });` dentro de un define |
