// WebApi Bundle
function WebApiBundle(reply){
    var rep = reply.split(":");
    if(rep[0] == "weather"){
        if(rep[1]=="here"){
            if (!navigator.geolocation){
                botprint("เบาวเซอร์ของท่านเก่าเกินกว่าที่"+bot.name+"จะหาตำแหน่งของท่านพบค่ะ");
            }else{
                if(isAndroid()){
                    botprint("loading...","loading");
                }else{
                    botprint("กรุณาอนุญาติให้"+bot.name+"เข้าถึงตำแหน่งของคุณด้วยค่ะ","loading");
                }
                navigator.geolocation.getCurrentPosition(function(position){
                        $.get("http://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"")
                            .done(function(data){
                                if(rep[2]=="all"){
                                    var weat="";
                                    console.log(data.weather);
                                    data.weather.forEach(function(r){
                                        weat+=weathearcode(""+r.id)+"/";
                                    });
                                    console.log(weat);
                                    weat = weat.substring(0,weat.length-1);
                                    botprint("อุณหภูมิขณะนี้ "+Math.round(data.main.temp-273.15)+" องศาเซลเซียส "+weat);
                                }
                                if(rep[2]=="temp"){
                                    botprint("อุณหภูมิขณะนี้ "+Math.round(data.main.temp-273.15)+" องศาเซลเซียสค่ะ");
                                }
                                botremove("loading");
                            }).fail(function() {
                                botprint("ขออภัยค่ะ "+bot.name+"ต้องการอินเตอร์เน็ตเพื่อเข้าถึงข้อมูลค่ะ");
                                botremove("loading");
                            });
                    }, function(){
                        botprint("ขออภัยคะ "+bot.name+"ไม่สามารถหาตำแหน่งของท่านได้");
                });
            }
        }else{
            botprint("loading...","loading");
            var loc = rep[1].replace(/ /g,'');
            if(loc=="กรุงเทพ"){
             loc = "กรุงเทพฯ";
            }
           $.get("http://api.openweathermap.org/data/2.5/weather?q="+loc+",th")
                .done(function(data){
                    if(rep[2]=="all"){
                        var weat="";
                        data.weather.forEach(function(r){
                            weat+=weathearcode(""+r.id)+"/";
                        });
                        weat = weat.substring(0,weat.length-1);
                        botprint("ขณะนี้ที่"+loc+"อุณหภูมิ "+Math.round(data.main.temp-273.15)+" องศาเซลเซียส "+weat);
                    }
                    if(rep[2]=="temp"){
                        botprint("อุณหภูมิที่"+loc+"ขณะนี้ "+Math.round(data.main.temp-273.15)+" องศาเซลเซียสค่ะ");
                    }
                           botremove("loading");
                    }).fail(function() {
                        botprint("ขออภัยค่ะ "+bot.name+"ต้องการอินเตอร์เน็ตเพื่อเข้าถึงข้อมูลค่ะ");
                        console.log("fail");
                           botremove("loading");
                    });
        }
    }
	else if(rep[0]=='clearscreen'){
		$("#chat-display" ).empty();
		botprint('ล้างหน้าจอ เรียบร้อยแล้วค่ะ');
	} else if(rep[0]=='translate'){
		botprint("กำลังเชื่่อมต่อระบบแปลภาษา...","loading");
		$.getJSON( "https://api.irin.in.th/translate/api.php?text="+rep[1]+"&to=th&callback=translatecomplete", function( data ) {
			if(data.status=="SUCCESS"){
				var str=data.translation;
				if(str.charAt(str.length-1)==" "){
					str=str.substring(0, str.length - 1);
				}
				botprint("แปลว่า \""+str+"\" ค่ะ")
			}else{
				botprint("ขออภัยค่ะ ระบบแปลภาษาเกิดการขัดข้องกรุณาติดต่อผู้ดูแลของ"+bot.name+"ด่วนเลยค่ะ");
			}
			botremove("loading");
		}).fail(function() {
			botprint("ขออภัยค่ะ "+bot.name+"ต้องการอินเตอร์เน็ตเพื่อเข้าถึงข้อมูลค่ะ");
            botremove("loading");
  		});
	} else if(rep[0]=="battery"){
		if(navigator.getBattery){
			navigator.getBattery().then(function(battery) {
				var dmsg = "";
				if(battery.dischargingTime/3600>=1){
					dmsg+= " "+Math.floor(battery.dischargingTime/3600)+" ชั่วโมง";
				}
				dmsg+= " "+Math.floor((battery.dischargingTime-(Math.floor(battery.dischargingTime/3600)*3600))/60)+" นาที";
				botprint("ขณะนี้ปริมาแบตเตอรี่เหลือ "+battery.level*100+"% ใช้ได้อีก"+dmsg+"ค่ะ");
			});
		}else{
			botprint("ขออภัยค่ะ "+bot.name+"ไม่พบแบตเตอรี่บนอุปกรณ์นี้");
		}
	}
}

// weater code converter for http://api.openweathermap.org/ 
function weathearcode(code){
    if(code.charAt(0)=="2"){
        return "มีพายุฝนฟ้าคะนอง";
    }else if(code.charAt(0)=="3"){
        return "ฝนตกปรอยๆ";
    }else if(code.charAt(0)=="5"){
        return "ฝนตก";
    }else if(code.charAt(0)=="6"){
        return "หิมะตก";
    }else if(code == "701"||code == "721"||code == "741"){
            return "หมอก";
    }else if(code == "711"){
        return "มีควัน";
    }else if(code == "731"||code == "751"){
            return "ทราย";
    }else if(code == "761"||code == "771"){
            return "ฝุ่น";
    }else if(code == "761"){
            return "เถ้าภูเขาไฟ";
    }else if(code == "781"){
            return "พายุหมุน";
    }else if(code == "800"){
            return "ฟ้าปลอดโปร่ง";
    } else if(code=="801"){
            return "มีเมฆเล็กน้อย";
    }else if(code=="802"){
            return "มีเมฆปานกลาง";
    }else if(code=="803"){
            return "มีเมฆมาก";
    }else if(code=="804"){
            return "มีเมฆเต็มฟ้า";
    } else if(code=="900"||code=="901"||code=="902"){
            return "มีพายุ";
    } else if(code=="903"){
            return "ร้อน";
    } else if(code=="904"){
            return "หนาว";
    } else if(code=="905"){
            return "ลมแรง";
    } else if(code=="906"){
            return "ลูกเห็บตก";
    }
    else{
            return "สงบ";    
    }
    // คอยเช็คโค้ดใหม่ด้วย
}