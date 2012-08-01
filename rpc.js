/*global safari,console*/
/*
Transmission Extension for Safari by Partido Surrealista Mexicano is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
Based on a work at www.transmissionbt.com.

http://creativecommons.org/licenses/by-nc-sa/3.0/
*/

var Piroteca = {};

safari.application.addEventListener("command", function(evt){
	if(evt.command === 'piroteca'){
		new Piroteca.request(evt.userInfo);
	}
}, false);

safari.extension.settings.addEventListener("change", function(event){
	switch (event.key) {
		case 'url':
			Piroteca.base = event.newValue;
		break;
		case 'ssid':
			console.log('Cambio el ssid a '+event.newValue);
			Piroteca.ssid = event.newValue;
		break;
		default:
			console.log(event);
		break;
	}
}, false);


safari.application.addEventListener("contextmenu", function(event){
	if( event.userInfo ){
		event.contextMenu.appendContextMenuItem('piroteca', 'Add Torrent to Transmission');
	}
	
}, false);


Piroteca.request = function(url) {
	var xhr = new XMLHttpRequest();
	var data = {
		method: 'torrent-add',
		"arguments": { paused: false, filename: url }
	};
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4) {
			if (xhr.status === 200) {
				var btih = url.match(/btih:([^&]+)/)[1];
				safari.application.activeBrowserWindow.activeTab.page.dispatchMessage('pirotecado', btih);
			} else if(xhr.status === 409) {
				Piroteca.ssid = xhr.getResponseHeader('X-Transmission-Session-Id');
				safari.extension.settings.ssid = Piroteca.ssid;
				Piroteca.request(url);
			}
		}
		
	};
	try {
		xhr.open('post', Piroteca.base+'/transmission/rpc');
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
		xhr.setRequestHeader("X-Transmission-Session-Id", Piroteca.ssid);
		xhr.send(JSON.stringify(data));
	} catch (ex) {
		console.error(ex);
	}
	
};

//init!
try {
	Piroteca.base = safari.extension.settings.url;
	Piroteca.ssid = safari.extension.settings.ssid;
} catch (ex) {
	console.error(ex);
	console.log(safari);
}
