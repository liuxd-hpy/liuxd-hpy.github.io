<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$path = dirname(__FILE__);
require "{$path}/src/Exception.php";
require "{$path}/src/PHPMailer.php";
require "{$path}/src/SMTP.php";

define('DEFAULT_EMAIL', array (
    'addr' => '18138805937@163.com',
    'pwd'  => 'liuxd4719',
    // 'addr' => 'liu.xiaodong6@byd.com',
    // 'pwd'  => 'YY017088//',
    'name' => 'wayside-admin',
    'host' => 'smtp.163.com',
    'smtpSecure' => 'ssl',
    'port' => 465,
));

function send_163_email($to, $subject, $body, $from=DEFAULT_EMAIL) {
    $mail = new PHPMailer(true);                              // Passing `true` enables exceptions

    //服务器配置
    $mail->CharSet ="UTF-8";                        // 设定邮件编码
    $mail->SMTPDebug = 0;                           // 调试模式输出
    $mail->isSMTP();                                // 使用SMTP
    $mail->Host = $from['host'];                    // SMTP服务器
    $mail->SMTPAuth = true;                         // 允许 SMTP 认证
    $mail->Username = $from['addr'];                // SMTP 用户名  即邮箱的用户名
    $mail->Password = $from['pwd'];                 // SMTP 密码  部分邮箱是授权码(例如163邮箱)
    $mail->SMTPSecure = $from['smtpSecure'];        // 允许 TLS 或者ssl协议
    $mail->Port = $from['port'];                    // 服务器端口 25 或者465 具体要看邮箱服务器支持

    $mail->setFrom($from['addr'], $from['name']);   // 发件人
    $mail->addAddress($to);                         // 收件人
    //$mail->addAddress('ellen@example.com');       // 可添加多个收件人
    $mail->addReplyTo($from['addr']);               //回复的时候回复给哪个邮箱 建议和发件人一致
    //$mail->addCC('cc@example.com');               //抄送
    //$mail->addBCC('bcc@example.com');             //密送

    //发送附件
    // $mail->addAttachment('../xy.zip');           // 添加附件
    // $mail->addAttachment('../thumb-1.jpg', 'new.jpg');    // 发送附件并且重命名

    //Content
    $mail->isHTML(true);                                    // 是否以HTML文档格式发送  发送后客户端可直接显示对应HTML内容
    $mail->Subject = $subject;
    $mail->Body    = $body;
    $mail->AltBody = '如果邮件客户端不支持HTML则显示此内容';

    return $mail->send();

    // try {
    //     $mail->send();
    //     echo '邮件发送成功';
    // } catch (Exception $e) {
    //     echo '邮件发送失败: ', $mail->ErrorInfo;
    // }
}



