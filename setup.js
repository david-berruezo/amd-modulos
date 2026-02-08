/**
 * Setup script: copia require.js a todos los ejemplos.
 * Ejecutar después de npm install:
 *   node setup.js
 */
var fs = require('fs');
var path = require('path');

var source = path.join(__dirname, 'node_modules', 'requirejs', 'require.js');

if (!fs.existsSync(source)) {
    console.error('ERROR: require.js no encontrado. Ejecuta primero: npm install');
    process.exit(1);
}

var examples = fs.readdirSync(__dirname).filter(function (dir) {
    return dir.startsWith('example') && fs.statSync(path.join(__dirname, dir)).isDirectory();
});

examples.forEach(function (example) {
    var destDir = path.join(__dirname, example, 'js');
    var dest = path.join(destDir, 'require.js');

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(source, dest);
    console.log('✅ ' + example + '/js/require.js copiado');
});

console.log('\n¡Listo! Ahora puedes ejecutar cualquier ejemplo:');
console.log('  npx grunt serve --example=example1-dom');
console.log('  npx grunt serve --example=example2-forms');
console.log('  npx grunt serve --example=example3-jquery');
console.log('  ... etc.');
