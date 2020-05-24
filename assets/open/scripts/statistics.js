// 概括——30天访问趋势按钮
function show_sub2(v) {
    console.log(v) // 选中过后的值
}
// 概括——30天收入趋势按钮
function show_sub3(v) {
    console.log(v) // 选中过后的值
}
// 实时统计—— 实时趋势按钮 
function show_sub4(v) {
    console.log(v) // 选中过后的值
}
// 实时统计——实时趋势按钮——时间粒度
function show_sub5(v) {
    console.log(v) // 选中过后的值
}
// 访问分析——累计注册用户
function show_sub6(v) {
    console.log(v) // 选中过后的值
}
// 访问分析——访问页面
function show_sub7(v) {
    console.log(v) // 选中过后的值
}
// 访问分析——新增用户存留
function show_sub8(v) {
    console.log(v) // 选中过后的值
}
// 访问分析——新增用户存留——保留
function show_sub9(v) {
    console.log(v) // 选中过后的值
}
// 收入分析——单日总收入全部
function show_sub10(v) {
    console.log(v) // 选中过后的值
}
// 用户画像——性别及年龄分布
function show_sub11(v) {
    console.log(v) // 选中过后的值
}

function show_sub12(v) {
    console.log(v) // 选中过后的值
}
// 用户画像——省份与城市 
function show_sub13(v) {
    console.log(v) // 选中过后的值
}

function show_sub14(v) {
    console.log(v) // 选中过后的值
}
// 用户画布——机型
function show_sub15(v) {
    console.log(v) // 选中过后的值
}

function show_sub16(v) {
    console.log(v) // 选中过后的值
}
$(function() {
    // user
    var user_Boolean = false;
    var password_Boolean = false;
    var verify_Boolean = false;
    var varconfirm_Boolean = false;
    var emaile_Boolean = false;
    var Mobile_Boolean = false;
    $('.reg_user').blur(function() {
        if ((/^[a-z0-9_-]{4,8}$/).test($(".reg_user").val())) {
            $('.user_hint').html("4-20个字符，支付中英文、数字").css("color", "rgba(158,172,202,1)");
            user_Boolean = true;
        } else {
            $('.user_hint').html("请输入昵称").css("color", "#EF4D57");
            user_Boolean = false;
        }
    });
    // password
    $('.reg_password').blur(function() {
        if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_password").val())) {
            $('.password_hint').html("字母、数字或英文符号，最短8位，区分大小写").css("color", "rgba(158,172,202,1)");
            password_Boolean = true;
        } else {
            $('.password_hint').html("请输入正确格式的密码").css("color", "#EF4D57");
            password_Boolean = false;
        }
    });
    // verify
    $('.reg_verify').blur(function() {
        if ((/^[a-z0-9_-]{6,16}$/).test($(".reg_verify").val())) {
            $('.verify_hint').html("请输入验证码").css("color", "rgba(158,172,202,1)");
            verify_Boolean = true;
        } else {
            $('.verify_hint').html("请输入正确的验证码").css("color", "#EF4D57");
            verify_Boolean = false;
        }
    });


    // password_confirm
    $('.reg_confirm').blur(function() {
        if (($(".reg_password").val()) == ($(".reg_confirm").val())) {
            $('.confirm_hint').html("✔").css("color", "green");
            varconfirm_Boolean = true;
        } else {
            $('.confirm_hint').html("×").css("color", "red");
            varconfirm_Boolean = false;
        }
    });


    // Email
    $('.reg_email').blur(function() {
        if ((/^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/).test($(".reg_email").val())) {
            $('.email_hint').html("✔").css("color", "green");
            emaile_Boolean = true;
        } else {
            $('.email_hint').html("×").css("color", "red");
            emaile_Boolean = false;
        }
    });


    // Mobile
    $('.reg_mobile').blur(function() {
        if ((/^1[34578]\d{9}$/).test($(".reg_mobile").val())) {
            $('.mobile_hint').html("做为登录账号").css("color", "rgba(158,172,202,1)");
            Mobile_Boolean = true;
        } else {
            $('.mobile_hint').html("请输入正确的手机号").css("color", "#EF4D57");
            Mobile_Boolean = false;
        }
    });


    // click
    $('.red_button').click(function() {
        if (user_Boolean && password_Boolea && varconfirm_Boolean && emaile_Boolean && Mobile_Boolean == true) {
            layer.alert("注册成功");
        } else {
            layer.alert("请完善信息");
        }
    });


    $('.switch').on('switch-change', function(e, data) {
        // console.log()
        if (data.value) {
            $('#myModal-open').modal('show')
        } else {
            $('#myModal-close').modal('show')
        }
    });
    // -----------------------------------------------------------------------------------------------------
    // 数据统计切换
    $(".table_head li").each(function() {
        var index = $(this).index(); // 初始化
        $(".table_head li").eq(0).addClass("active");
        $(this).click(function() { // 点击某个元素时，给这个元素添加active类，其余兄弟元素的active类都取消
            $(this).addClass("active").siblings().removeClass("active");
            $(".container_count>div").eq(index).stop(true).show().siblings().stop(true).hide();
        })
    });

    // // 获取option的select的值  第二个图表的选项
    // function show_sub2(v) {
    //     console.log(v) // 选中过后的值
    // }
    // 绘制第二个图表
    // 近30天访问趋势
    initGameVisit();
    function initGameVisit() {
        var dateData = [];//日期信息
        var gameVisitData = [];//数据信息
        var postUrl = "/statistics/gameVisit/";
        var postInfo = {
            gameid: $('#gameid').val(),
            gameVisitType: $('#gameVisitType').val()
        };
        $.ajax({
            type: "post",
            url: postUrl,
            data: postInfo,
            dataType: "json",
            success: function (data) {

                if (data.error_id == 200) {
                    gameVisitTitle = data['data']['title'];

                    gameVisitData = data['data']['dataList'];
                    dateData = data['data']['dateList'];
                    initGameVisitChart();
                } else {
                    layer.alert(data.message);
                    return false;
                }
            },
            error: function () {
                layer.alert('获取数据失败，请重试1');
                return false;
            }
        });

        function initGameVisitChart() {
            var chart_second = echarts.init(document.getElementById('chart_second'));
            var option = {
                title: {
                    text: gameVisitTitle,
                    left: 'center',
                    top: 'bottom',
                    textStyle: {
                        color: '#4A4E67',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontFamily: '微软雅黑',
                        fontSize: 14
                    }
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        textStyle: {
                            align: 'middle',
                        }
                    },
                    data:dateData
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 80,
                    splitNumber: 5,
                    axisTick: { //y轴刻度线
                        show: false
                    },
                    axisLine: { //y轴
                        show: false
                    },
                },
                series: [{
                    data: gameVisitData, // 动态传来的值
                    type: 'line',
                    stack: '销售量',
                    symbol: 'circle', // 设定为实心点
                    symbolSize: 8, // 设定实心点的大小
                    areaStyle: {
                        normal: {
                            color: '#E2E6EF' //改变区域颜色
                        }
                    },
                    itemStyle: {
                        normal: {
                            label: { show: true },
                            color: '#43B548', // 设置折现点的颜色
                            lineStyle: {
                                color: '#63C167'
                            }
                        }
                    },
                }]
            };
            chart_second.setOption(option);
        }

    }
    // // 获取option的select的值  第三个图表的选项
    // function show_sub3(v) {
    //     console.log(v) // 选中过后的值
    // }
    // 绘制第三个图
    var chart_third = echarts.init(document.getElementById('chart_third'));
    var option = {
        title: {
            text: '2019年01月07日 - 2019年02月06日 单日总收入',
            left: 'center',
            top: 'bottom',
            textStyle: {
                color: '#4A4E67',
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: '微软雅黑',
                fontSize: 14
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    align: 'middle',
                }
            },
            data: ['01.22', '01.24', '01.25', '01.28', '01.30', '02.01', '02.05', '02.07', '02.09', '02.11', '02.15', '02.17', '02.19']
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 80,
            splitNumber: 5,
            axisTick: { //y轴刻度线
                show: false
            },
            axisLine: { //y轴
                show: false
            },
        },
        series: [{
            data: [12, 23, 45, 46, 5, 6, 6, 7, 7, 7, 7], // 第三个列表要动态去改变的值
            type: 'line',
            stack: '销售量',
            symbol: 'circle', // 设定为实心点
            symbolSize: 8, // 设定实心点的大小
            areaStyle: {
                normal: {
                    color: '#E2E6EF' //改变区域颜色
                }
            },
            itemStyle: {
                normal: {
                    label: { show: true },
                    color: '#43B548', // 设置折现点的颜色
                    lineStyle: {
                        color: '#63C167'
                    }
                }
            },
        }]
    };
    chart_third.setOption(option);

    //-------------------------------------------------------------------------------------------------
    // // 实时统计时间
    // function show_sub4(v) {
    //     console.log(v) // 选中过后的值
    // }
    // // 实时统计粒子时间
    // function show_sub5(v) {
    //     console.log(v) // 选中过后的值
    // }
    // 改变echarts的宽高
    var real_time_charts = echarts.init(document.getElementById('real_time_charts'));
    // var $real_time_charts = $('#real_time_charts').find('canvas');
    // console.log($real_time_charts)
    // $real_time_charts.width(871);
    // 实时统计

    var option = {
        title: {
            text: '实时访问次数',
            left: 'center',
            top: 'bottom',
            textStyle: {
                color: '#4A4E67',
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: '微软雅黑',
                fontSize: 14
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    align: 'middle',
                }
            },
            splitLine: {
                show: false
            }, //去除网格线
            data: ['01.22', '01.24', '01.25', '01.28', '01.30', '02.01', '02.05', '02.07'] // 可变更的日期
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 40,
            splitNumber: 5,
            splitLine: {　　　　
                show: false　　
            },
            axisTick: { //y轴刻度线
                show: false
            },
            axisLine: { //y轴
                show: false
            },
        },
        series: [{
            data: [12, 23, 40, 38, 5, 6, 6, 7, 7, 7, 7], // 第三个列表要动态去改变的值
            type: 'line',
            stack: '销售量',
            symbol: 'circle', // 设定为实心点
            symbolSize: 8, // 设定实心点的大小
            // areaStyle: {
            //     normal: {
            //         color: '#E2E6EF' //改变区域颜色
            //     }
            // },
            itemStyle: {
                normal: {
                    label: { show: true },
                    color: '#43B548', // 设置折现点的颜色
                    lineStyle: {
                        color: '#63C167'
                    }
                }
            },
        }]
    };
    real_time_charts.setOption(option);
    // -------------------------------------------------------------
    // 访问分析
    // function show_sub6(v) {
    //     console.log(v) // 选中过后的值
    // }
    // 累计注册用户数
    var analyse_charts_first = echarts.init(document.getElementById('analyse_charts_first'));
    var option = {
        title: {
            text: '2019/1/7 - 2019/2/6 累计注册用户数',
            left: 'center',
            top: 'bottom',
            textStyle: {
                color: '#4A4E67',
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: '微软雅黑',
                fontSize: 14
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                textStyle: {
                    align: 'middle',
                }
            },
            splitLine: {
                show: false
            }, //去除网格线
            data: ['01.22', '01.24', '01.25', '01.28', '01.30', '02.01', '02.05', '02.07'] // 可变更的日期
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 40,
            splitNumber: 5,
            splitLine: {　　　　
                show: false　　
            },
            axisTick: { //y轴刻度线
                show: false
            },
            axisLine: { //y轴
                show: false
            },
        },
        series: [{
            data: [12, 23, 40, 38, 5, 6, 6, 7, 7, 7, 7], // 第三个列表要动态去改变的值
            type: 'line',
            stack: '销售量',
            symbol: 'circle', // 设定为实心点
            symbolSize: 8, // 设定实心点的大小
            areaStyle: {
                normal: {
                    color: '#E2E6EF' //改变区域颜色
                }
            },
            itemStyle: {
                normal: {
                    label: { show: true },
                    color: '#43B548', // 设置折现点的颜色
                    lineStyle: {
                        color: '#63C167'
                    }
                }
            },
        }]
    };
    analyse_charts_first.setOption(option);
});
// 累计注册用户数——表格
$.fn.serializeJson = function() {
    var serializeObj = {};
    var array = this.serializeArray();
    $(array).each(function() {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};

var data = [];
var now = new Date(2019, 3, 14);
var mm = now.getMinutes();

function getNowFormatDate(date) {
    var seperator1 = ".";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
    return currentdate;
}

for (var i = 1; i < 30; i++) {
    now.setMinutes(mm + i);
    var model = {
        Time: getNowFormatDate(now),
        User: 10,
        New_user: i,
        Active_user: i,
        Number: i,
        Stay: i,
        Share: i,
        User_share: 20
    }
    data.push(model);
}
var tableIns = $("#table_user").rayTable({
    data: data,
    height: 440,
    page: true,
    cols: [
        [
            { field: 'Time', title: '时间', rowspan: 2, style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, align: 'center', width: 108 },
            { field: 'User', title: '累计注册用户数', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'Active_user', title: '活跃用户数', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'Number', title: '访问次数', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'New_user', title: '新增注册用户数', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'Stay', title: '人均停留时长', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'Share', title: '分享次数', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff' }, width: 108 },
            { field: 'User_share', title: '分享用户数', style: { 'color': '#9EACCA' }, width: 108 },
        ]
    ]
});
// 访问页面
var analyse_html = echarts.init(document.getElementById('analyse_html'));
option = {
    title: {
        text: '访问来源',
        x: 'center',
        y: 'bottom',
        paddingTop: 20,
        textStyle: {
            color: '#4A4E67',
            fontStyle: 'normal',
            fontWeight: '400',
            fontFamily: '微软雅黑',
            fontSize: 14,
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    color: ['#79A7C8', '#E9A084', '#93D8A9'],
    // legend: {
    //     orient: 'vertical',
    //     left: 'left',
    //     data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    // },
    series: [{
        name: '访问来源',
        type: 'pie',
        // radius: '55%',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false, // 解决文字叠加问题
        // 动态要改变的数据
        data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
        ],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
};


analyse_html.setOption(option);
// 新增用户留存 
var analyse_newUser_charts = echarts.init(document.getElementById('analyse_newUser_charts'));
var option = {
    title: {
        text: '2019/1/7 - 2019/2/6 累计注册用户数',
        left: 'center',
        top: 'bottom',
        textStyle: {
            color: '#4A4E67',
            fontStyle: 'normal',
            fontWeight: '400',
            fontFamily: '微软雅黑',
            fontSize: 14
        }
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            textStyle: {
                align: 'middle',
            }
        },
        splitLine: {
            show: false
        }, //去除网格线
        data: ['01.22', '01.24', '01.25', '01.28', '01.30', ] // 可变更的日期
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitNumber: 5,
        splitLine: {　　　　
            show: false　　
        },
        axisTick: { //y轴刻度线
            show: false
        },
        axisLine: { //y轴
            show: false
        },
    },
    series: [{
        data: [12, 23, 40, 38, 5, 7], // 第三个列表要动态去改变的值
        type: 'line',
        stack: '销售量',
        symbol: 'circle', // 设定为实心点
        symbolSize: 8, // 设定实心点的大小
        areaStyle: {
            normal: {
                color: '#E2E6EF' //改变区域颜色
            }
        },
        itemStyle: {
            normal: {
                label: { show: true },
                color: '#43B548', // 设置折现点的颜色
                lineStyle: {
                    color: '#63C167'
                }
            }
        },
    }]
};
analyse_newUser_charts.setOption(option);
// 新增用户存留——表格
$.fn.serializeJson = function() {
    var serializeObj = {};
    var array = this.serializeArray();
    $(array).each(function() {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};

var data = [];
var now = new Date(2019, 3, 14);
var mm = now.getMinutes();

function getNowFormatDate(date) {
    var seperator1 = ".";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
    return currentdate;
}
for (var i = 1; i < 30; i++) { // 可修改的值
    now.setMinutes(mm + i);
    var model = {
        Data: getNowFormatDate(now),
        Y_keep: 10,
        Three_keep: "我是Subject" + i,
        S_keep: "我是body" + i,
    }
    data.push(model);
}
var tableIns = $("#table_newUser").rayTable({
    data: data,
    height: 440,
    page: true,
    cols: [
        [
            { field: 'Data', title: '日期', rowspan: 2, style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff', width: 217 }, align: 'center', width: 217 },
            { field: 'Y_keep', title: '次日留存率', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff', width: 217 }, width: 217 },
            { field: 'Three_keep', title: '三日留存率', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff', width: 217 }, width: 217 },
            { field: 'S_keep', title: '七日留存率', align: 'center', style: { 'color': '#9EACCA', 'border-right': 'solid 1px #fff', width: 217 }, width: 217 },
        ]
    ]
});
// 收入分析
var income_charts = echarts.init(document.getElementById('income_charts'));
var option = {
    title: {
        text: '2019/1/7 - 2019/2/6 累计注册用户数',
        left: 'center',
        top: 'bottom',
        textStyle: {
            color: '#4A4E67',
            fontStyle: 'normal',
            fontWeight: '400',
            fontFamily: '微软雅黑',
            fontSize: 14
        }
    },
    xAxis: {
        type: 'category',
        axisLabel: {
            textStyle: {
                align: 'middle',
            }
        },
        splitLine: {
            show: false
        }, //去除网格线
        data: ['01.22', '01.24', '01.25', '01.28', '01.30', ] // 可变更的日期
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitNumber: 5,
        splitLine: {　　　　
            show: false　　
        },
        axisTick: { //y轴刻度线
            show: false
        },
        axisLine: { //y轴
            show: false
        },
    },
    series: [{
        data: [12, 23, 40, 38, 5, 7], // 第三个列表要动态去改变的值
        type: 'line',
        stack: '销售量',
        symbol: 'circle', // 设定为实心点
        symbolSize: 8, // 设定实心点的大小
        areaStyle: {
            normal: {
                color: '#E2E6EF' //改变区域颜色
            }
        },
        itemStyle: {
            normal: {
                label: { show: true },
                color: '#43B548', // 设置折现点的颜色
                lineStyle: {
                    color: '#63C167'
                }
            }
        },
    }]
};
income_charts.setOption(option);
// IAP虚拟支付订单——表格
$.fn.serializeJson = function() {
    var serializeObj = {};
    var array = this.serializeArray();
    $(array).each(function() {
        if (serializeObj[this.name]) {
            if ($.isArray(serializeObj[this.name])) {
                serializeObj[this.name].push(this.value);
            } else {
                serializeObj[this.name] = [serializeObj[this.name], this.value];
            }
        } else {
            serializeObj[this.name] = this.value;
        }
    });
    return serializeObj;
};

var data = [];
var now = new Date(2019, 3, 14);
var mm = now.getMinutes();

function getNowFormatDate(date) {
    var seperator1 = ".";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year +
        seperator1 +
        month +
        seperator1 +
        strDate +
        " " +
        date.getHours() +
        seperator2 +
        date.getMinutes() +
        seperator2 +
        date.getSeconds();
    return currentdate;
}
for (var i = 1; i < 30; i++) { // 可修改的值
    now.setMinutes(mm + i);
    var model = {
        Order_number: i,
        Setup_time: 10,
        Money: "我是Subject" + i
    }
    data.push(model);
}
var tmpdata = $.extend(true, [], data);
// tmpdata[0].Name = "<script>layer.alert('不该弹窗的');<\/script>";
var tableIns = $("#table_pay").rayTable({
    data: tmpdata,
    page: true,
    expandRow: true,
    background: "#fff",
    cols: [
        [{
            field: 'Order_number',
            title: '订单号',
            width: 447,
            align: 'left',
            dataType: 'html',
            rowspan: 1,
            style: {
                background: '#fff',
                width: 447,
            }
        }, {
            field: 'Setup_time',
            title: '创建时间',
            align: 'center',
            width: 192,
            style: {
                background: '#fff',
                width: 192,
            }
        }, {
            field: 'Money',
            title: '金额',
            align: 'center',
            width: 192,
            style: {
                background: '#fff',
                width: 192,
            }
        }]
    ]
});

tableIns.on("expand", function(index, rowdata, $container) {
    return [
        '<div style="text-align:left;">我是详情页面</div>',
        '<div style="text-align:left;">编号:' + rowdata.Order_number + '</div>',
        '<div style="text-align:left;>Subject:' + rowdata.Setup_time + '</div>',
        '<div style="text-align:left;>爱好:' + rowdata.Money + '</div>'
    ].join('');
});
// 用户画像
// 饼图
var sex_charts = echarts.init(document.getElementById('sex_charts'));
option = {
    title: {
        text: '性别分布',
        x: 'center',
        y: 'bottom',
        paddingTop: 20,
        textStyle: {
            color: '#4A4E67',
            fontStyle: 'normal',
            fontWeight: '400',
            fontFamily: '微软雅黑',
            fontSize: 14,
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    labelLine: {
        normal: {
            show: false
        }
    },
    color: ['#79A7C8', '#E9A084', '#93D8A9'],
    series: [{
        name: '访问来源',
        type: 'pie',
        // radius: '55%',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false, // 解决文字叠加问题
        // 动态要改变的数据
        data: [
            { value: 100, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
        ],
        itemStyle: {
            normal: {
                label: {
                    show: false //隐藏标示文字
                },
                labelLine: {
                    show: false //隐藏标示线
                }
            }
        }
    }],
};


sex_charts.setOption(option);

// 条形图
var age_charts = echarts.init(document.getElementById('age_charts'));
option = {
    color: ['#19AC19'],
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Sun', 'Sun', 'Sun'] // 可改变
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130, 56, 56, 7, 8], // 可改变
        type: 'bar'
    }]
};

age_charts.setOption(option);

// 机型
var mode_charts = echarts.init(document.getElementById('mode_charts'));
option = {
    title: {
        text: '机型',
        x: 'center',
        y: 'bottom',
        paddingTop: 20,
        textStyle: {
            color: '#4A4E67',
            fontStyle: 'normal',
            fontWeight: '400',
            fontFamily: '微软雅黑',
            fontSize: 14,
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    labelLine: {
        normal: {
            show: false
        }
    },
    color: ['#79A7C8', '#E9A084', '#93D8A9'],
    series: [{
        name: '访问来源',
        type: 'pie',
        // radius: '55%',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false, // 解决文字叠加问题
        // 动态要改变的数据
        data: [
            { value: 100, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 234, name: '联盟广告' },
        ],
        itemStyle: {
            // normal: {
            //     label: {
            //         show: false //隐藏标示文字
            //     },
            //     labelLine: {
            //         show: false //隐藏标示线
            //     }
            // }
        }
    }],
};


mode_charts.setOption(option);