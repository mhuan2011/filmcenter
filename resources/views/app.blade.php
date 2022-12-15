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
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7218499682629293" crossorigin="anonymous"></script>
</head>

<body>
    <div id="app"></div>
    <script src="{{asset('js/index.js')}}"></script>

    <!-- Messenger Plugin chat Code -->
    <div id="fb-root"></div>

    <!-- Your Plugin chat code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>

    <!-- <script>
        var chatbox = document.getElementById('fb-customer-chat');
        chatbox.setAttribute("page_id", "100486146223729");
        chatbox.setAttribute("attribution", "biz_inbox");
    </script> -->

    <!-- Your SDK code -->
    <!-- <script>
        window.fbAsyncInit = function() {
            FB.init({
                xfbml: true,
                version: 'v15.0'
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk')); -->
    </script>
</body>

</html>