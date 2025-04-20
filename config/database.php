<?php
class Database {
    private static $file = __DIR__ . '/../students.json';

    public static function getStudents() {
        if (!file_exists(self::$file)) {
            $initialData = [
                [
                    'id' => 1,
                    'group' => 'PZ-24',
                    'firstName' => 'Serhiy',
                    'lastName' => 'Matrokhin',
                    'gender' => 'Non-binary',
                    'birthday' => '2006-08-03',
                    'status' => 'Offline'
                ],
                [
                    'id' => 2,
                    'group' => 'PZ-25',
                    'firstName' => 'Anna',
                    'lastName' => 'Kovalenko',
                    'gender' => 'Female',
                    'birthday' => '2005-04-15',
                    'status' => 'Online'
                ],
                [
                    'id' => 3,
                    'group' => 'PZ-24',
                    'firstName' => 'Ivan',
                    'lastName' => 'Petrenko',
                    'gender' => 'Male',
                    'birthday' => '2006-11-22',
                    'status' => 'Offline'
                ]
            ];
            file_put_contents(self::$file, json_encode($initialData, JSON_PRETTY_PRINT));
        }
        return json_decode(file_get_contents(self::$file), true);
    }

    public static function saveStudents($students) {
        file_put_contents(self::$file, json_encode($students, JSON_PRETTY_PRINT));
    }
}