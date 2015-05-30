var rs = new RiveScript({
	debug_div: "debug",
	debug:     false
});

var wordcut = require('wordcut');
wordcut.init();

function cutthai(msg){
    var lastchar = msg.charAt(msg.length - 1);
    if(lastchar=="?"&&msg.length!=1){
        msg = msg.substr(0,msg.length-1);
    }
    msg = wordcut.cut(msg);
    msg = msg.replace(/\|/g," ");
    msg = msg.replace("   "," ");
    return msg;
}

var brainfile = ["brain/spellcheck.rive",
				 "brain/irin.rive",
				 "brain/javascript.rive",
				 "brain/browser.rive"
				];
function on_load_success (){
	$("#chatinput").removeAttr("disabled");
	$("#chatinput").attr("placeholder", "ส่งข้อความ");
	$("#chatinput").focus();
	rs.sortReplies();
}
function on_load_error (err) {
	console.log("Loading error: " + err);
}
rs.loadFile(brainfile, on_load_success, on_load_error);

function sendMSG(){
	var msg = $("#chatinput").val();
	$("#chatinput").val("");
	if(msg!=""){
		$("#chat-display").append("<div class='chatbox-parent-user'><div class='grey lighten-4 chatbox-user right'>"+msg+"</div></div>");
		var reply = rs.reply("user", cutthai(msg));
		if(reply!=""&&reply!="-"){
			reply = reply.replace(/\n/g, "<br>");
			$("#chat-display").append("<div class='chatbox-parent-irin'><img src='image/irin-thumb.png' class='responsive-img circle irin-avatar'><div class='chatbox-irin'>"+reply+"</div></div>");
			$("#chat-display").scrollTop($('#chat-display').prop("scrollHeight"));
		}
	}
}
function irinPrint(reply){
	$("#chat-display").append("<div class='chatbox-parent-irin'><img src='image/irin-thumb-50.png' class='responsive-img circle irin-avatar'><div class='chatbox-irin'>"+reply+"</div></div>");
	$("#chat-display").scrollTop($('#chat-display').prop("scrollHeight"));
}


$(function() {
	$("#chatinput").keyup(function(e){
		code= (e.keyCode ? e.keyCode : e.which);
		if(code==13){
			sendMSG();
		}
	});
	$("#btn-send").click(function(){
		sendMSG();
	});
});