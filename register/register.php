<?php
require '../PHPMailer/sendEmail.php';
require '../public.php';

$str_recv = file_get_contents("php://input");
$recv = json_decode($str_recv, true);   // true：解析为关联数据、false：解析为对象
/* $recv结构
array (size=6)
  'name' => string '1' (length=1)
  'staff' => string '1' (length=1)
  'pwd' => string '1' (length=1)
  'tele' => string '18138805937' (length=0)
  'email' => string '916643534@qq.com' (length=16)
  'chkcode' => string '4711' (length=0)
*/

// 连接数据库
$conn = sql_conn();
$ret = array(
    'sta' => 0,     // 0: 无问题; 1: 有错误，取error
    'error' => 0,   // 0: 无问题; 1: 验证码错误; 2: 数据库处理错误; 
);

// 查询register数据库中是否有本条验证数据且验证码一致
$sql = "SELECT * FROM register
        WHERE name='{$recv['name']}' and staff_no='{$recv['staff']}' and email='{$recv['email']}' and chkcode='{$recv['chkcode']}'";
$result = $conn->query($sql);
// 数据查询成功
if ($result) {
    // 校验成功
    if ($result->num_rows != 0) {
        // 用户注册成功，填入base_info表中
        $sql = "INSERT INTO base_info(staff_no, name, pwd, email, telephone)
                VALUES('{$recv['staff']}', '{$recv['name']}', '{$recv['pwd']}', '{$recv['email']}', '{$recv['tele']}')";
        $result = $conn->query($sql);
        // 数据插入成功
        if ($result) {
            // 从register表删除此注册信息
            $sql = "DELETE FROM register WHERE staff_no='{$recv['staff']}' or email='{$recv['email']}' or (name!='' and name='{$recv['name']}')";
            $result = $conn->query($sql);
            // 数据删除失败
            if (!$result) {
                $ret['sta'] = 1;
                $ret['error'] = 2;
            } else {
                // do nothing
            }
        } else {
            $ret['sta'] = 1;
            $ret['error'] = 2;
        }
    } else {
        $ret['sta'] = 1;
        $ret['error'] = 1;
    }
} else {
    $ret['sta'] = 1;
    $ret['error'] = 2;
    // echo $conn->error;
}

$conn->close();

echo json_encode($ret);










?>


