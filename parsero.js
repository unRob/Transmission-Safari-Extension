/*global safari,console*/

var selected = null;

function colog(e){
	if(e.name == 'message'){
		console.log('MSG: '+e.message);
	} else if( e.name == 'pirotecado') {
		if(selected){
			var elem = selected;
			var prev = elem.getAttribute('class');
			prev = prev===null? '' : prev+' ';
			elem.setAttribute('class', prev+"pirotecado");
			selected = null;
		}
	}
}

safari.self.addEventListener("message", colog, true);

document.addEventListener('contextmenu', function(event){
	if(event.target.nodeName === 'A' || event.target.parentNode.nodeName === 'A') {
		var a = event.target.nodeName === 'A'? event.target : event.target.parentNode;
		if(a.href.match(/.torrent$/)){
			var torrent = {url:a.href};
			selected = a;
			safari.self.tab.setContextMenuEventUserInfo(event, torrent);
			//console.log(torrent);
		}
	} else {
		//console.log('no tengo torrent');
		//console.log(event.target.nodeName);
	}
});