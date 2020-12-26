<?php
require '../PHPMailer/sendEmail.php';
require '../public.php';

$str_recv = file_get_contents("php://input");
$recv = json_decode($str_recv, true);   // true：解析为关联数据、false：解析为对象
// var_dump($recv);

// 连接数据库
$conn = sql_conn();
$ret = array(
    'sta' => 0,     // 0: 无问题; 1: 有错误，取error
    'err' => 0,   // 0: 无问题; 1: 邮箱未注册/验证码错误 2: 数据库操作失败 3: 邮件发送失败
);

switch ($recv['step']) {
    /*- 填写邮箱阶段 */
    case 1: {
        $sql = "SELECT * FROM base_info WHERE email='{$recv['email']}'";
        $result = $conn->query($sql);
        // 数据查询成功
        if ($result) {
            if ($result->num_rows == 0) {
                $ret['sta'] = 1;
                $ret['err'] = 1;
            } else {/*- 邮箱已注册 */ }
        } else {
            $ret['sta'] = 1;
            $ret['err'] = 2;
        }
    }
    break;

    /*- 反馈验证码 */
    case 2: {
        /*- 获取验证码 */
        if ($recv['flag'] == 0) {
            // 生成验证码
            $code = ""; $i = 0;
            while ($i++ < 6) {
                $code .= rand(0, 9);
            }
            // 将验证码写入到数据库
            $sql = "INSERT INTO forget(email, code) VALUES('{$recv['email']}', '{$code}')";
            $result = $conn->query($sql);
            // 数据库写入成功
            if ($result) {
                // 发送邮件
                $body = "尊敬的 wayside 用户，您此次找回密码的验证码为：" . $code;
                // 邮件发送失败
                if (!send_163_email($recv['email'], 'wayside 找回密码', $body)) {
                    $ret['sta'] = 1;
                    $ret['err'] = 3;
                }
            } else {
                $ret['sta'] = 1;
                $ret['err'] = 2;
                // echo $conn->error;
            }
        } else { // 提交验证码
            // 查询数据库是否有此条记录
            $sql = "SELECT * FROM forget WHERE email='{$recv['email']}' and code='{$recv['code']}'";
            $result = $conn->query($sql);
            // 数据库查询成功
            if ($result) {
                // 未查询到记录
                if ($result->num_rows == 0) {
                    $ret['sta'] = 1;
                    $ret['err'] = 1;
                } else {
                    // 删除记录
                    $sql = "DELETE FROM forget WHERE email='{$recv['email']}'";
                    $result = $conn->query($sql);
                }
            } else {
                $ret['sta'] = 1;
                $ret['err'] = 2;
                // echo $conn->error; 
            }
        }
    }
    break;

    /*- 填写新密码 */
    case 3: {
        $sql = "UPDATE base_info SET pwd='{$recv['pwd']}' WHERE email='{$recv['email']}'";
        $conn->query($sql);
    }
    break;

    /*- 未知命令 */
    default: {

    }break;
}

$conn->close();

echo json_encode($ret);

?>

