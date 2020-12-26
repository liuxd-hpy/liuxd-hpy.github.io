var Regx = {
    email: /^[\.a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    chkcode: /^[A-Za-z0-9]{6}$/,
    pwd: /^.{6,15}$/,
    mobilephone: /^\d{11,13}$/,
};

function pwd_to_md5($obj) {

    $obj.on("blur", function(){
        let str = $obj.val().trim();
        if (str != "") {
            $obj.val($.md5(str));
        }
    });
}

// 验证码倒计时
function getCodeCount($obj, time) {

    let countTime = setInterval(function(){
        if (time == 0) {
            $obj.val('重新获取');
            $obj.removeAttr("disabled");
            clearInterval(countTime);
        } else {
            $obj.val('('+time+'s)后重新获取');
            $obj.attr("disabled","true");
            time--;
        }
    }, 1000);
}

/* ======================== Math 对象方法 ========================

Math.ceil();    //向上取整。
Math.floor();   //向下取整。
Math.round();   //四舍五入。
Math.random();  //0.0 ~ 1.0 之间的一个伪随机数。【包含0不包含1】 //比如0.8647578968666494

Math.ceil(Math.random()*10);    //获取从1到10的随机整数 ，取0的概率极小。
Math.round(Math.random());      //可均衡获取0到1的随机整数。
Math.floor(Math.random()*10);   //可均衡获取0到9的随机整数。
Math.round(Math.random()*10);   //基本均衡获取0到10的随机整数，其中获取最小值0和最大值10的几率少一半。

//因为结果在0~0.4 为0，0.5到1.4为1  ...  8.5到9.4为9，9.5到9.9为10。所以头尾的分布区间只有其他数字的一半。

/* ======================== Math 对象方法 ======================== */

function getCheckCode() {
    let code = "";  // 验证码

    var alphabet = [  // 验证码字母表
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z'];

    for (let i = 0; i < 6; i++) {
        code += alphabet[randomIntNum(0, 61)];
    }

    return code;
}

function randomIntNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomFloatNum(min, max) {
    return (Math.random() * (max - min) + min);
}

/**生成一个随机色**/
function randomColor(min, max) {
    var r = randomIntNum(min, max);
    var g = randomIntNum(min, max);
    var b = randomIntNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
}

// 生成图片验证码
function genPhotoCheckCode(selector) {

    let code = getCheckCode();  // 验证码

    let CodeCanvas = document.querySelector(selector);
    let CodeCanvasDocument = CodeCanvas.getContext("2d");   // 创建context对象
    CodeCanvasDocument.fillStyle = randomColor(180, 240);    // 画布填充色
    CodeCanvasDocument.fillRect(0, 0, CodeCanvas.width, CodeCanvas.height); // 清空画布，重设大小即清空画布
    
    for (let i =  0; i < 6; i++) {
        let x = i * 40 + 20;
        let y = CodeCanvas.height * randomFloatNum(0.5, 0.75); // 0.50~0.75
        let deg = randomFloatNum(-20, 20);
        // 随机生成字体颜色、大小
        CodeCanvasDocument.fillStyle = randomColor(100, 160);
        CodeCanvasDocument.font = randomIntNum(70, 90) + "px SimHei";
        CodeCanvasDocument.translate(x, y);
        CodeCanvasDocument.rotate(deg * Math.PI / 180);
        CodeCanvasDocument.fillText(code[i], 0, 0);    // 参数(text,x,y,maxWidth): 绘制文本、文本左下角坐标xy、设置文本最大宽度(可选参数)
        CodeCanvasDocument.rotate(-deg * Math.PI / 180);
        CodeCanvasDocument.translate(-x, -y);
    }
    
    for (let i = 0; i < 3; i++) {
        Drawline(CodeCanvasDocument, CodeCanvas.width, CodeCanvas.height);
    }

    for (let i = 0; i < 50; i++) {
        DrawDot(CodeCanvasDocument, CodeCanvas.width, CodeCanvas.height);
    }

    function Drawline(canvas, width, height) {
        canvas.strokeStyle = randomColor(40, 180);  // 描边属性
        canvas.beginPath(); // 开启新的路径
        canvas.moveTo(randomIntNum(0, width/4), randomIntNum(height/4, 3*height/4));
        canvas.lineTo(randomIntNum(3*width/4, width), randomIntNum(0, height));
        canvas.lineWidth = 1;   // 线宽
        canvas.stroke();    // 描边，即起点描到终点
    }

    function DrawDot(canvas, width, height) {
        let px = randomIntNum(0, width);
        let py = randomIntNum(0, height);

        canvas.strokeStyle = randomColor(100, 150);
        canvas.beginPath(); // 开启新的路径
        canvas.moveTo(px, py);
        canvas.lineTo(px+1, py+1);
        canvas.lineWidth = 3;
        canvas.stroke();
    }

    return code;
}