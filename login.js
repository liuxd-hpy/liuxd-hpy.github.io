"use strict";

$(document).ready(function() {

    $(".user, .pwd").on("focus", function () {
        $(".mb-left .last").text("");
        $(this).select();   // 点击选择所有文本
    });

    $(".login-btn").on("click", function () {
        let user = $(".user").val().trim();
        let pwd  = $(".pwd").val().trim();
        let tip = $(".mb-left .last");
        if (user == "" || pwd == "") {
            tip.text("* 用户名或密码为空");
        } else {
            $.post("./login.php", {
                user: user,
                pwd:  pwd,

            }, function (data, status, xhr) {

                if (status == "success") {
                    if (data === 0) {
                        setTimeout(function(){
                            window.location = './pcenter/pcenter.html';
                        }, 1000);
                    } else if (data === 1) {
                        tip.text("用户名/工号或密码错误");
                    } else {
                        tip.text("未知错误");
                    }
                }
            }, "json");
        }
    });

    
    pwd_to_md5($(".pwd"));
    
    $(document).keypress(function(event){
        if (event.keyCode == 13) {
            $(".pwd").trigger('blur');
            $(".login-btn").trigger('click');
        }
    });
});














