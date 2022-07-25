const mix = require('laravel-mix');
require('laravel-mix-polyfill');

mix.js('resources/js/index.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .polyfill({
        enabled: true,
        useBuiltIns: "usage",
        targets: "firefox 50, IE 11"
     });