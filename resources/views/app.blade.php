<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FilmCenter</title>
    <!-- <link rel="icon" type="image/png" href="/images/logo.png" /> -->
    <link rel="icon" href="https://symphony.com/wp-content/uploads/2020/12/sd-integrations-logo-jira.png" />
    {{-- <link href="{{asset('css/index.css')}}" rel="stylesheet" type="text/css"> --}}
    <script type="text/javascript">
        const APP_URL = '{{env("APP_URL")}}';
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7218499682629293"
     crossorigin="anonymous"></script>
</head>

<body>
    <div id="app"></div>
    <script src="{{asset('js/index.js')}}"></script>
</body>

</html>