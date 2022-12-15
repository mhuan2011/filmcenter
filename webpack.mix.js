const mix = require('laravel-mix');
require('mix-env-file');
require('laravel-mix-polyfill');

mix.js('resources/js/index.js', 'public/js')
    .react()
    .sass('resources/sass/app.scss', 'public/css')
    .polyfill({
        enabled: true,
        useBuiltIns: "usage",
        targets: "firefox 50, IE 11"
    })
mix.env(process.env.ENV_FILE);
