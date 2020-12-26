<?php
require '../PHPMailer/sendEmail.php';
require '../public.php';

// send_163_email()
$str_recv = file_get_contents("php://input");
$recv = json_decode($str_recv, true);   // true：解析为关联数据、false：解析为对象

/* $recv结构
array (size=6)
  'name' => string '刘校东' (length=1)
  'staff' => string '2809292' (length=1)
  'pwd' => string 'sdjsldjosn23234mdsij2' (length=1)
  'tele' => string '18138805937' (length=0)
  'email' => string 'liu.xiaodong@byd.com' (length=6)
*/

// 连接数据库
$conn = sql_conn();
$ret = array(
    'sta' => 0,     // 0: 无问题，取code; 1: 有错误，取error
    // 'code' => 0,    // 验证码，随机生成的四位数
    'error' => 0,   // 0: 无问题; 1: 用户名已注册; 2: 工号已注册; 3: 邮箱已注册; 4: 数据库处理错误; 5: 邮件发送失败
);

// 查询用户名或工号或email是否与已注册账号有重复
$sql = 'SELECT name,staff_no,email FROM base_info';
$result = $conn->query($sql);
if ($result) {
    
    while ($row=$result->fetch_assoc()) {
        if ( ($recv['name'] != "") && ($row['name'] == $recv['name']) ) {
            $ret['sta'] = 1; $ret['error'] = 1; break;
        } else if ($row['staff_no'] == $recv['staff']) {
            $ret['sta'] = 1; $ret['error'] = 2; break;
        } else if ($row['email'] == $recv['email']) {
            $ret['sta'] = 1; $ret['error'] = 3; break;
        } else {
            /* do nothing */
        }
    }

    // 用户未注册
    if ($ret['sta'] == 0) {
        // 生成验证码
        $code = ""; $i = 0;
        while ($i++ < 6) {
            $code .= rand(0, 9);
        }
        // echo $code;
        $sql = "INSERT INTO register(staff_no, name, email, chkcode) 
                VALUES('{$recv['staff']}', '{$recv['name']}', '{$recv['email']}', '{$code}')";
        $result = $conn->query($sql);
        // 数据库写入成功
        if ($result) {
            // 发送邮件
            $body = "欢迎注册 wayside 用户，您此次的验证码为：" . $code;
            // 邮件发送失败
            if (!send_163_email($recv['email'], 'wayside用户注册验证码', $body)) {
                $ret['sta'] = 1;
                $ret['error'] = 5;
            }
        } else {
            $ret['sta'] = 1;
            $ret['error'] = 4;
            // echo $conn->error;
        }
    }
} else {
    $ret['sta'] = 1;
    $ret['error'] = 4;
    // echo $conn->error;
}

$conn->close();

echo json_encode($ret);










?>


