<?php

define('SQL_HOST', 'localhost');
define('SQL_USER', 'root');
define('SQL_PWD' , '');
define('SQL_DB_WAYSIDE', 'dt_wayside');

function sql_conn() {
    $conn = new mysqli(SQL_HOST, SQL_USER, SQL_PWD, SQL_DB_WAYSIDE);
    if (!$conn) {
        exit("数据库连接失败。。。。");
    } else {
        $conn->set_charset('utf8mb4');
        return $conn;
    }
}

// @sql_conn();

?>