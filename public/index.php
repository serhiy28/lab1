<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/lab2/public', '', $uri);
$uriSegments = explode('/', trim($uri, '/'));

if (isset($uriSegments[0]) && $uriSegments[0] === 'api') {
    require_once __DIR__ . '/../routes/route.php';
} else {
    readfile(__DIR__ . '/file.html');
}