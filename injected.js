/*global safari,console*/
/*
Transmission Extension for Safari by Partido Surrealista Mexicano is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Based on a work at www.transmissionbt.com.

http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var torrents = {};

safari.self.addEventListener("message", function(evt){
	if ( evt.name === 'pirotecado' ){
		var element = torrents[evt.message];
		if (!element) {
			//console.log("no existe "+evt.message+' en torrents');
			//console.log(torrents);
			return false;
		}
		//console.log('si existe!', torrents);
		delete(torrents[evt.message]);
		element.className = element.className? element.className+' pirotecado' : 'pirotecado';
	} else {
		console.log(evt);
	}
}, true);

document.addEventListener('contextmenu', function(evt){
	if(evt.target.nodeName === 'A' || evt.target.parentNode.nodeName === 'A') {
		var a = evt.target.nodeName === 'A'? evt.target : evt.target.parentNode;
		if(a.href.match(/.torrent$/) || a.href.match(/^magnet:/)){
			var torrent = a.href;
			var btih = torrent.match(/btih:([^&]+)/)[1];
			torrents[btih] = a;
			safari.self.tab.setContextMenuEventUserInfo(evt, torrent);
		}
	}
}, false);