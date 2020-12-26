"use strict";

$(document).ready(function(){

    let $name = $(".name");
    let $staff = $(".staff-no");
    let $pwd = $(".pwd");
    let $spwd = $(".spwd");
    let $tele = $(".telephone");
    let $email = $(".email");
    let $chk_code = $(".chk-code");
    let $chk_btn = $(".chk-btn");
    let $tag = $("p");

    $(".user, .staff-no, .pwd, .spwd, .telephone").on("focus", function() {
        $(this).select();
        $tag.text("");
        if ( ($email.val().trim() === "") && (!$chk_code.hasClass("hide")) ){
            $chk_code.addClass("hide");
            $chk_btn.addClass("hide");
        }
    });

    pwd_to_md5($pwd);
    pwd_to_md5($spwd);

    $chk_code.on("focus", function() {
        $(this).select();
        $tag.text("");
    });
    
    $email.on("focus", function() {
        $(this).select();
        $tag.text("");

        if ($chk_code.hasClass("hide")) {
            $chk_code.removeClass("hide");
            $chk_btn.removeClass("hide");
        }
    });
    
    $chk_btn.on("click", function() {
        let name = $name.val().trim();
        let staff = $staff.val().trim();
        let pwd = $pwd.val().trim();
        let spwd = $spwd.val().trim();
        let tele = $tele.val().trim();
        let email = $email.val().trim();
    
        // 信息检查成功
        if (info_integrity_check(staff, pwd, spwd, tele, email)) {
            let info = {
                name : name,
                staff: staff,
                email: email,
            };
    
            $.post('./get_chkcode.php', JSON.stringify(info), function(data, status,xhr) {
                if (status=='success') {
                    // console.log(data);
                    let recv = JSON.parse(data);
                    // 命令正确
                    if (recv['sta'] == 0) {
                        // 倒计时60s
                        getCodeCount($chk_btn, 60);
                    } else {
                        switch (recv['error']) {
                            case 1: $tag.text('用户名已注册');break;
                            case 2: $tag.text('工号已注册');break;
                            case 3: $tag.text('邮箱已注册');break;
                            case 4: $tag.text('数据库处理错误');break;
                            case 5: $tag.text('邮件发送失败');break;
                            default: console.log('未知错误');break;
                        }
                    }
                }
            });
        }
    });
    
    $(".sm").on("click", function() {
        let name = $name.val().trim();
        let staff = $staff.val().trim();
        let pwd = $pwd.val().trim();
        let spwd = $spwd.val().trim();
        let tele = $tele.val().trim();
        let email = $email.val().trim();
        let chkcode = $chk_code.val().trim();
    
        // 信息检查成功
        if (info_integrity_check(staff, pwd, spwd, tele, email)) {
            // 验证码是否输入
            if (/^\d{4}$/.test(chkcode)) {
                let info = {
                    name : name,
                    staff: staff,
                    pwd  : pwd,
                    tele : tele,
                    email: email,
                    chkcode: chkcode,
                };
        
                $.post('./register.php', JSON.stringify(info), function(data, status, xhr) {
                    if (status=='success') {
                        let recv = JSON.parse(data);
                        // 注册成功
                        if (recv['sta'] == 0) {
                            setTimeout(function(){
                                // 跳转到登录界面
                                window.location = '../login.html';                                
                            }, 1000);
                        } else {
                            switch (recv['error']) {
                                case 1: $tag.text('验证码错误');break;
                                case 2: $tag.text('数据库处理错误');break;
                                default: console.log('未知错误');break;
                            }
                        }
                    }
                });
            } else if (chkcode == "") {
                $tag.text("请输入验证码");
            } else {
                $tag.text("验证码格式错误");
            }
        }
    });
    
    function info_integrity_check(staff, pwd, spwd, tele, email) {
    
        // 用户名(姓名)、工号、密码、确认密码邮箱均不为空
        if ((staff != "") && (pwd != "") && (spwd != "") && (email != "") ) {
            // 两次密码是否一致
            if (pwd == spwd) {
                // 手机号码格式正确
                if ( (tele == "") || (Regx.mobilephone.test(tele)) ) {
                    // 邮箱格式是否正确
                    if (Regx.email.test(email)) {   //liu.xiaodong6@byd.com
                        return true;
                    } else {
                        $tag.text("邮箱格式错误!!!");
                        return false;
                    }
                } else {
                    $tag.text("手机号码格式错误!!!");
                    return false;
                }
            } else {
                $tag.text("两次密码输入不一致!!!");
                return false;
            }
        } else {
            $tag.text("'*' 部分为必填项");
            return false;
        }
    }
});


















