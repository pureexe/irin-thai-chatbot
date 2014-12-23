// Android Bundle
function AndroidBundle(reply){
    var rep = reply.split(":");
    if(rep[0] == "Toast"){
                Android.Toast(rep[1]);
    }
}