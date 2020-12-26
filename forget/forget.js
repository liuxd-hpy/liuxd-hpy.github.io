"use strict";

$(document).ready(function(){

    let $smbtn = $(".smbtn");
    let step = 1;   // 1:填写邮箱 2:反馈验证码 3:填写新密码

    /*-------- 第一步：填写邮箱 -------- */
    let $email = $(".div-email input");
    let $emailp = $(".div-email p");
    let $pcode = $(".div-code input");
    let $pcodep = $(".div-code p");

    let obj1 = {
        email_flag: 0,
        pcode_flag: 0,
        chk: function() {return (this.email_flag == 1 && this.pcode_flag == 1)},
    };

    let checkCode = genPhotoCheckCode("canvas");
    let chkcodeRegx = new RegExp(checkCode, 'i');

    $("canvas").click(function(){
        checkCode = genPhotoCheckCode("canvas");
        chkcodeRegx = new RegExp(checkCode, 'i');
    })

    $(document).on('step-1', function(){

        if (obj1.chk()) {
            enable_smbtn();
        } else {
            disable_smbtn();
        }
    });

    // let myEvent = new Event('step-1');   // 此方法IE 浏览器不支持

    // window.addEventListener('step-1', function(){
    //     console.log(obj1);
    //     if (obj1.chk()) {
    //         enable_smbtn();
    //     } else {
    //         disable_smbtn();
    //     }
    // });

    // function triggerEvent(event) {
    //     if (window.dispatchEvent) { // Chrome、Firefox
    //         window.dispatchEvent(event);
    //     } else { // IE
    //         window.fireEvent(event);
    //     }
    // }

    function enable_smbtn() {
        $smbtn.addClass("btn-able");
        $smbtn.removeAttr("disabled");
    }

    function disable_smbtn() {
        $smbtn.removeClass("btn-able");
        $smbtn.attr("disabled", "true");
    }

    $email.on("focus", function(){
        $(this).select();
        $emailp.css("visibility", "hidden");

        $email.on("input", function(){
            obj1.email_flag = 0;
            // triggerEvent(myEvent);
            $(document).trigger('step-1');
            $emailp.css("visibility", "hidden");

            if (input_check($(this), Regx.email) == 0) {
                obj1.email_flag = 1;
                // triggerEvent(myEvent);
                $(document).trigger('step-1');
            }
        });

        $email.on("mouseleave blur", function(){

            switch (input_check($(this), Regx.email)) {
                /*- right */
                case 0: break;
                /*- 输入为空 */
                case 1: $emailp.text("请输入绑定的邮箱");$emailp.css("visibility", "visible");break;
                /*- 邮箱格式错误 */
                case 2: $emailp.text("邮箱输入有误");$emailp.css("visibility", "visible");break;
                /*- 其他 */
                default: $emailp.text("未知错误");$emailp.css("visibility", "visible");break;
            }
        });

    });

    $pcode.focus(function(){
        $(this).select();
        $pcodep.css("visibility", "hidden");

        $pcode.on("input", function(){
            obj1.pcode_flag = 0;
            // triggerEvent(myEvent);
            $(document).trigger('step-1');
            $pcodep.css("visibility", "hidden");

            if (input_check($(this), chkcodeRegx) == 0) {
                obj1.pcode_flag = 1;
                // triggerEvent(myEvent);
                $(document).trigger('step-1');
            }
        });

        $pcode.on("mouseleave blur", function(){

            switch (input_check($(this), chkcodeRegx)) {
                /*- right */
                case 0: break;
                /*- 输入为空 */
                case 1: $pcodep.text("请输入图片验证码");$pcodep.css("visibility", "visible");break;
                /*- 邮箱格式错误 */
                case 2: $pcodep.text("验证码输入有误");$pcodep.css("visibility", "visible");break;
                /*- 其他 */
                default: $pcodep.text("未知错误");$pcodep.css("visibility", "visible");break;
            }
        });
    });

    /*-------- 第二步: 反馈验证码 -------- */
    let $code = $("#code");
    let $codeBtn = $("#code-btn");
    let $pcodea = $(".div-getcode p");

    $codeBtn.on("click", function(){
        let info = {
            step: step,
            flag: 0,
            email: $email.val().trim(),
        };

        $.post('./forget.php', JSON.stringify(info), function(data, status, xhr){
            if (status == 'success') {
                let $data = JSON.parse(data);
                if ($data.sta == 0) {
                    $code.focus(function(){
                        $code.on("input mouseleave blur", function(){
                            switch (input_check($(this), Regx.chkcode)) {
                                /*- right */
                                case 0: $pcodea.text("");$pcodea.css("visibility", "hidden");enable_smbtn();break;
                                /*- 输入为空 */
                                case 1: $pcodea.text("请输入验证码");$pcodea.css("visibility", "visible");disable_smbtn();break;
                                /*- 邮箱格式错误 */
                                case 2: $pcodea.text("验证码应为6位");$pcodea.css("visibility", "visible");disable_smbtn();break;
                                /*- 其他 */
                                default: $pcodea.text("未知错误");$pcodea.css("visibility", "visible");disable_smbtn();break;
                            }
                        });
                    });
                } else {
                    switch ($data.err) {
                        case 2: console.log("数据库操作失败");break;
                        case 3: console.log("邮件发送失败");break;
                        default: console.log("数据库操作失败");break;
                    }
                }
            }
        });

        // 倒计时60s
        getCodeCount($codeBtn, 60);
    });

    /*-------- 第三步: 填写新密码 -------- */
    let $pwd = $(".reset-pwd input");

    $pwd.focus(function() {
        let $ppwd = $(".reset-pwd p");
        $(this).select();

        $pwd.on("input", function(){
            let pwd = $(this).val().trim();

            if (Regx.pwd.test(pwd)) {
                $ppwd.css("visibility", "hidden");
                enable_smbtn();
            } else {
                disable_smbtn();
            }
        });

        $pwd.on("mouseleave blur", function(){
            let pwd = $(this).val().trim();

            if (!Regx.pwd.test(pwd)) {
                $ppwd.text("密码由6~15位字符组成");
                $ppwd.css("visibility", "visible");
            }
        })
    });

    /*-------- post -------- */
    $smbtn.on("click", function() {
        
        switch (step) {
            /*- 填写邮箱阶段 */
            case 1: {
                let info = {
                    step: step,
                    email: $email.val().trim(),
                };

                $.post('./forget.php', JSON.stringify(info), function(data, status, xhr){

                    if (status == 'success') {
                        let $data = JSON.parse(data);
                        if ($data.sta == 0) {
                            step = 2;
                            $(".email").removeClass("active");
                            $(".getcode").addClass("active");
                            $("#img-top").attr("src", "./img/email_modify02.png");
                            $smbtn.val("提交");
                            disable_smbtn();
                        } else {
                            $emailp.css("visibility", "visible");
                            if ($data.err == 1) {
                                $emailp.text("邮箱未注册");
                            } else {
                                $emailp.text("数据库操作失败");
                            }
                        }
                    }
                });
            }
            break;

            /*- 反馈验证码 */
            case 2: {
                let info = {
                    step: step,
                    flag: 1,
                    email: $email.val().trim(),
                    code: $code.val().trim(),
                };

                $.post('./forget.php', JSON.stringify(info), function(data, status, xhr){
                    if (status == 'success') {
                        let $data = JSON.parse(data);
                        if ($data.sta == 0) {
                            step = 3;
                            $(".getcode").removeClass("active");
                            $(".reset-pwd").addClass("active");
                            $("#img-top").attr("src", "./img/email_modify03.png");
                            $smbtn.val("确认");
                            disable_smbtn();
                        } else {
                            $pcodea.css("visibility", "visible");
                            if ($data.err == 1) {
                                $pcodea.text("验证码错误");
                            } else {
                                $pcodea.text("数据库操作失败");
                            }
                        }
                    }
                });
            }
            break;

            /*- 填写新密码 */
            case 3: {
                let info = {
                    step: step,
                    email: $email.val().trim(),
                    pwd: $.md5($pwd.val().trim()),
                };

                $.post('./forget.php', JSON.stringify(info), function(data, status, xhr){
                    if (status == 'success') {
                        let $lbl = $(".reset-pwd label");
                        $lbl.text("密码重置成功，将自动跳转到登录页面 。。。。");
                        $lbl.css("color", "blue");
                        setTimeout(function(){
                            window.location = '../login.html';
                        }, 1000);
                    }
                });
            }
            break;
        }
    });

    $(".left").click(function(){
        setTimeout(function(){
            window.location = "../login.html";
        }, 500);
    });
});

function input_check($obj, regx) {
    let str = $obj.val().trim();

    if (str == ""){
        return 1;
    } else if (regx.test(str)) {
        return 0;
    } else {
        return 2;
    }
}


