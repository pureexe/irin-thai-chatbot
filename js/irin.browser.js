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
			if(isAndroid()){
				reply = reply.substring(8,reply.length);
            	AndroidBundle(reply);
			}else{
				botprint("คำสั่งนี้รองรับเฉพาะการเปิดผ่านแอปแอนดรอยเท่านั้นค่ะ");
			}
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


$(function() {
	$("#msg-in").keyup(function(e){
		code= (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			sendMSG();
		}
	});
});