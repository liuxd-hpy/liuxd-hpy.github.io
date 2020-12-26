<?php

/*********************************************php各种header的定义*********************************************
//定义编码
header( 'Content-Type:text/html;charset=utf-8 ');
  
//Atom
header('Content-type: application/atom+xml');
  
//CSS
header('Content-type: text/css');
  
//Javascript
header('Content-type: text/javascript');
  
//JPEG Image
header('Content-type: image/jpeg');
  
//JSON
header('Content-type: application/json');
  
//PDF
header('Content-type: application/pdf');
  
//RSS
header('Content-Type: application/rss+xml; charset=ISO-8859-1');
  
//Text (Plain)
header('Content-type: text/plain');
  
//XML
header('Content-type: text/xml');
  
// ok
header('HTTP/1.1 200 OK');
  
//设置一个404头:
header('HTTP/1.1 404 Not Found');
  
//设置地址被永久的重定向
header('HTTP/1.1 301 Moved Permanently');
  
//转到一个新地址
header('Location: http://www.example.org/');
//文件延迟转向:
header('Refresh: 10; url=http://www.example.org/');
print 'You will be redirected in 10 seconds';
  
//当然，也可以使用html语法实现
// <meta http-equiv="refresh" content="10;http://www.example.org/ />
  
// override X-Powered-By: PHP:
header('X-Powered-By: PHP/4.4.0');
header('X-Powered-By: Brain/0.6b');
  
//文档语言
header('Content-language: en');
  
//告诉浏览器最后一次修改时间
$time = time() - 60; // or filemtime($fn), etc
header('Last-Modified: '.gmdate('D, d M Y H:i:s', $time).' GMT');
  
//告诉浏览器文档内容没有发生改变
header('HTTP/1.1 304 Not Modified');
  
//设置内容长度
header('Content-Length: 1234');
  
//设置为一个下载类型
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="example.zip"');
header('Content-Transfer-Encoding: binary');
// load the file to send:
readfile('example.zip');
  
// 对当前文档禁用缓存
header('Cache-Control: no-cache, no-store, max-age=0, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header('Pragma: no-cache');
  
//设置内容类型:
header('Content-Type: text/html; charset=iso-8859-1');
header('Content-Type: text/html; charset=utf-8');
header('Content-Type: text/plain'); //纯文本格式
header('Content-Type: image/jpeg'); //JPG***
header('Content-Type: application/zip'); // ZIP文件
header('Content-Type: application/pdf'); // PDF文件
header('Content-Type: audio/mpeg'); // 音频文件
header('Content-Type: application/x-shockw**e-flash'); //Flash动画

//显示登陆对话框
header('HTTP/1.1 401 Unauthorized');
header('WWW-Authenticate: Basic realm="Top Secret"');
print 'Text that will be displayed if the user hits cancel or ';
print 'enters wrong login data';

******************************************************************************************/

header('Content-Type: text/plain');

include_once './public.php';

define('LOGIN_SUCCESS', 0);
define('PWD_USER_ERROR', 1);
define('UNKNOW_ERROR', 2);

function Login_check($user, $pwd) {

    if ( isset($user) && isset($pwd) ) {

        // 连接数据库
        $conn = sql_conn();

        // 获取(工号，用户名，密码)
        $sql = "SELECT staff_no, name, pwd FROM base_info WHERE (pwd='{$pwd}' and (staff_no='{$user}' or name='{$user}'))";
        // echo $sql;
        $result = $conn->query($sql);

        // 查询成功
        if ($result) {
            if ($result->num_rows != 0) {
                echo LOGIN_SUCCESS;
            } else {
                echo PWD_USER_ERROR;
            }
        } else {
            echo $conn->error;
            echo UNKNOW_ERROR;
        }

        $conn->close();
    }
}

Login_check($_POST['user'], $_POST['pwd']);

?>