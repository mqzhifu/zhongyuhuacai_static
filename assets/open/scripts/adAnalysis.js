function drawLine(id,lineObj){
	var echartsLine = echarts.init(document.getElementById(id));
 	echartsLine.setOption({
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	           //type:'none'鼠标悬浮竖向线
		    },
	        //鼠标悬浮弹窗数据
			formatter:function(a){
				return a[0].seriesName+'<br/>'+lineObj.year+'.'+a[0].name+':'+a[0].data;
			}
	    },
	    grid: {
	        left: '4%',
	        right: '4%',
	        bottom: '2%',
	        containLabel: true
	    },
	    //animation: false,
	   	hoverAnimation:true,
		
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: lineObj.data_num,
	        
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {show: false},
		    axisTick: {
				show: false
			},
	    },
	    series: [
	        {
	            name:lineObj.name,
	            type:'line',
	            //symbol: 'none',  //取消折点圆圈
	            areaStyle: {
	            	normal: {
                        color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#FFA4A4'},
                                    {offset: 1, color: '#fff'}
                                ]
                        )
                	}
	            },
	            itemStyle: {
			        normal: {
			            color: "#ff7577",
			            borderWidth:3,
			            lineStyle: {
			            	 
			                color: "#ffbdbe"
			            }
			        }
			    },
			    symbolSize:7, //折线点的大小
			    showSymbol:false,
	            data:lineObj.data_date
	        }
	    ]
	});
}

function drawLines(id,linesObj){
	var echartsLine = echarts.init(document.getElementById(id));
 	echartsLine.setOption({
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	           //type:'none'鼠标悬浮竖向线
		    },
		    //formatter: '{a}{b}{c}',
	    },
     	legend: {
     		x:'left',
	        data:linesObj.dataName
	    },
     	grid: {
	        left: '2%',
	        right: '5%',
	        bottom: '2%',
	        containLabel: true
	    },
	    xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data: linesObj.dataTime
	    },
	    yAxis: {
	        type: 'value',
	        axisLine: {show: false},
	        axisTick: {
				show: false
			},
	    },
	    //animation: false,
	   	hoverAnimation:true,
	    series: linesObj.dataArr
	});
}
function drawPie(id,pieObj){
    // 使用刚指定的配置项和数据显示图表。
    var echartsPie = echarts.init(document.getElementById(id));
     echartsPie.setOption({
 	  	tooltip: {
	        trigger: 'item',
	        formatter: "{b}: {c} ({d}%)"
	    },
    	animation: false,
	    series: [
	        {
	            type:'pie',
	            radius: ['30%', '55%'],
	            hoverAnimation:false,
	            data:pieObj,
	            itemStyle: {
                   
                    normal:{
                       /* color:function(params) {
                        //自定义颜色
                        var colorList = [          
                            	'#ffd2d2', '#ff9ab8','#ffda97'
                            ];
                            return colorList[params.dataIndex]
                         }*/
                    }
              	}
	        }
	    ]
	});
}