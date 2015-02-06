// WebApi Bundle
function WebApiBundle(reply){
    var rep = reply.split(":");
	if(rep[0]=='clearscreen'){
		$("#chat-display" ).empty();
		botprint('ล้างหน้าจอ เรียบร้อยแล้วค่ะ');
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

