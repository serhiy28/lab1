<?php

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/StudentController.php';

header('Content-Type: application/json');

$requestMethod = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/lab2/public', '', $uri);
$uriSegments = explode('/', trim($uri, '/'));

file_put_contents(__DIR__ . '/debug.log', "Request URI: $uri\nSegments: " . json_encode($uriSegments) . "\n", FILE_APPEND);

$authController = new AuthController();
$studentController = new StudentController();

if (isset($uriSegments[0]) && $uriSegments[0] === 'api') {
    if (isset($uriSegments[1])) {
        if ($uriSegments[1] === 'login') {
            $authController->login();
        } elseif ($uriSegments[1] === 'logout') {
            $authController->logout();
        } elseif ($uriSegments[1] === 'user') {
            $authController->getUser();
        } elseif ($uriSegments[1] === 'students') {
            if ($requestMethod === 'GET') {
                $studentController->index();
            } elseif ($requestMethod === 'POST') {
                $studentController->create();
            } elseif ($requestMethod === 'PUT' && isset($uriSegments[2])) {
                $studentController->update($uriSegments[2]);
            } elseif ($requestMethod === 'DELETE') {
                $studentController->delete();
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}