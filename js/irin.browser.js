var botname = "ไอริน";
var botauthor = "เพียว";
// Generate Unique ID for Error log tracking
var uniqueid = 'xxxxxxxxxxx7a2exxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});

// Create our RiveScript interpreter.
var rs = new RiveScript({
	debug_div: "debug",
	debug:     false
});

// Init for wordcut 
var wordcut = require('wordcut');
wordcut.init();   
function cutthai(msg){
    var lastchar = msg.charAt(msg.length - 1);
    if(lastchar=="?"){
        msg = msg.substr(0,msg.length-1);
    }
    msg = wordcut.cut(msg);
    msg = msg.replace(/\|/g," ");
    msg = msg.replace("   "," ");
    return msg;
}

// Load our files from the brain/ folder.
brainfile = ["brain/spellcheck.rive",
             "brain/irin.rive",
             "brain/date.rive",
             "brain/javascript.rive",
             "brain/webapi.rive"
            ];
if(isAndroid()){
    brainfile.push("brain/android.rive");
}
 
rs.loadFile(brainfile, on_load_success, on_load_error);
function on_load_success () {
	$("#msg-in").removeAttr("disabled");
	$("#msg-in").attr("placeholder", "ส่งข้อความ");
	$("#msg-in").focus();
	rs.sortReplies();
}
function on_load_error (err) {
	console.log("Loading error: " + err);
}
 
// check is runing on android;
function isAndroid(){
    if(typeof Android !== "undefined") {
        return true;
    } else {
        return false;
    }
}


// Main Program

function sendMSG(word){
	var msg = word;
    if(!msg){
        msg = $("#msg-in").val();
        $("#msg-in").val("");
    }
	 $("#chat-display").append("<li class='right clearfix'><span class='chat-img pull-right'><img src='https://placehold.it/50/FA6F57/fff&text=ME' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='pull-right primary-font'>ฉัน</strong></div><br><p class='pull-right'>"+msg+"</p></div></li>")
	try {
		var reply = rs.reply("user", cutthai(msg));
		reply = reply.replace(/\n/g, "<br>");
        if(reply.substring(0,8)=="Android:"){
            reply = reply.substring(8,reply.length);
            AndroidBundle(reply);
        }else if(reply.substring(0,7)=="WebApi:"){
            reply = reply.substring(7,reply.length);
            WebApiBundle(reply);
        }else{
            $.get("https://log.pureapp.in.th/irin/add.php?c="+msg+"&p="+reply+"&uid="+uniqueid); // For Loging system
            botprint(reply);
        }
	} catch(e) {
		window.alert(e.message + "\n" + e.line);
		console.log(e);
	}
}

function botprint(reply,liid){
	$("#chat-display").append("<li class='left clearfix' id='"+liid+"'><span class='chat-img pull-left'><img src='image/irin-thumb-50.png' alt='ไอริน' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>ไอริน</strong></div><p>"+reply+"</p></div></li>");
                if(isAndroid()){
                $(window).scrollTop($('#chat-display').height());
            }else{
                $(".panel-body").scrollTop($('#chat-display').height());
            }
}
function botloading(){
	$("#chat-display").append("<li class='left clearfix' id='loading'><span class='chat-img pull-left'><img src='https://placehold.it/50/55C1E7/fff&text=IRIN' alt='User Avatar' class='img-circle' /></span><div class='chat-body clearfix'><div class='header'><strong class='primary-font'>ไอริน</strong></div><p>loading...</p></div></li>");
            if(isAndroid()){
                $(window).scrollTop($('#chat-display').height());
            }else{
                $(".panel-body").scrollTop($('#chat-display').height());
            }
}
function botremove(id){
    $( "#"+id ).remove();
}

// Android Bundle
function AndroidBundle(reply){
    var rep = reply.split(":");
    if(rep[0] == "Toast"){
                Android.Toast(rep[1]);
    }
}

// WebApi Bundle
function WebApiBundle(reply){
    var rep = reply.split(":");
    if(rep[0] == "weather"){
        if(rep[1]=="here"){
            if (!navigator.geolocation){
                botprint("เบาวเซอร์ของท่านเก่าเกินกว่าที่ไอรินจะหาตำแหน่งของท่านพบค่ะ");
            }else{
                if(isAndroid()){
                    botprint("loading...","loading");
                }else{
                    botprint("กรุณาอนุญาติให้ไอรินเข้าถึงตำแหน่งของคุณด้วยค่ะ","loading");
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
                                botprint("ขออภัยค่ะ ไอรินต้องการอินเตอร์เน็ตเพื่อเข้าถึงข้อมูลค่ะ");
                                botremove("loading");
                            });
                    }, function(){
                        botprint("ขออภัยคะ ไอรินไม่สามารถหาตำแหน่งของท่านได้");
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
                        botprint("ขออภัยค่ะ ไอรินต้องการอินเตอร์เน็ตเพื่อเข้าถึงข้อมูลค่ะ");
                        console.log("fail");
                           botremove("loading");
                    });
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
$(function() {
	$("#msg-in").keyup(function(e){
		code= (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			sendMSG();
		}
	});
});