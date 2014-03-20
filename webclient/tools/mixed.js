/**
 * replaces <> with - and :/\|?* with + because this are reserved characters on NTFS
 * @param fn
 * @returns
 */
function clearForFilename(fn) {
	return fn.replace(/</g, '-').replace(/>/g, '-').replace(/:/g, '+').replace(/\//g,'+').replace(/\\/g,'+').replace(/\|/g, '+').replace(/\?/g, '+').replace(/\*/g,'+');
}


/**
 * returns an array containing the counts of the same values in the given list
 * @param list array
 * @returns {Array}
 */
function getFrequencies(list) {
	if (list.length < 1) {return list;}
	list.sort();
	var freqs = new Array();
	var j = 0;
	freqs[0] = {'option': list[0], 'freq': 1};
	for (var i=1; i<list.length; i++) {
		if (list[i] != freqs[j].option) {
			j++;
			freqs[j] = {'option': list[i], 'freq': 1};
		} else {
			freqs[j].freq++;  
		}
	}
	return freqs;
}

/**
 * returns the index in an array of objects which matches
 * a given property of the object
 * @param a: array to search in
 * @param elementname: name of property to search
 * @param element: element to search for
 * @returns {Number}
 */
function ArrayIndexOf(a, elementname, element) {
	if (!a || !a.length || a.length < 1) return -1;
	for (var i = 0; i < a.length; i++) {
		if (a[i][elementname] === element) return i;
	}
	return -1;
}

function sendThroughProxy() {
	
}

/**
 * 
 * @param url if url is set to null the parameters from the last call we be used
 * @param data
 * @param callbackObject
 * @param callbackFunction
 * @param proxy
 * @returns
 */
function myXmlSend(url, data, callbackObject, callbackFunction, proxy) {
	if (url != null) { // if url == null: an error occoured and retry was pressed
		myXmlSend.url = url;
		myXmlSend.data = data;
		myXmlSend.callbackObject = callbackObject;
		myXmlSend.callbackFunction = callbackFunction;
		myXmlSend.proxy = proxy;
	}
	var xml2 = new XMLHttpRequest();
	xml2.onload = function() { myXmlSend.callbackFunction.call(myXmlSend.callbackObject, xml2, myXmlSend.url); };
	xml2.onerror = function(e) {
		// var t;
		// if (e instanceof Event) t = e.target.statusText;
		// else                    t = e.toString;
		// alert("error: (" + xml2.status + ") "+ xml2.statusText + "e: " + t);
		// this occures when
		// * certificate of https is not valid
		// * in chrome: protocol unknown
		// * server not found (DNS error)
		// unfortunately the status is in all cases 0
		// so we open a new window (pop-up) to show the problem to the user
		// + "\n" + 'click <a href="' + url +'" here</a>');};

		/*		  if (xml2.status == Components.results.NS_ERROR_UNKNOWN_HOST) {
		   alert("DNS error: " +  this.channel.status);
	     }
		 */		
		var errorDiv = document.getElementById("errorDiv");
		//window.frames['diagnosisIFrame'].document.location.href = url;
		var tmp   = '<div id="error"><h1>Es gab einen Fehler bei einer Verbindung zu einem Server.</h1>';
		var testurl;
		if (myXmlSend.url.indexOf('?') > 0) testurl = myXmlSend.url + '&connectioncheck';
		else                                testurl = myXmlSend.url + '?connectioncheck';
		tmp = tmp + '<ul><li>Klicken Sie <a href="' + testurl + '" target="_blank">auf diesen Link, um die Verbindung zum Server manuell zu testen.</a> Der Link wird in einem neuen Fenster ge�ffnet.</li> <li>Beheben Sie das Problem,</li> <li>schlie�en Sie das neue Fenster und </li><li>klicken anschlie�end auf <button id="retry" name="retry" onclick="myXmlSend(null, null, null, null)">erneut versuchen</button></li></ul></div>';
		tmp = tmp + '';
		errorDiv.innerHTML = tmp;
		// alert(errorDiv.innerHTML);
		errorDiv.style.display = ""; // this causes the div to be displayed (set to "none" to hide it)
		// setTimeout(window.scrollTo(0, 0), 1000); //wait till rendering is done
		window.scrollTo(0, 0);
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");

//		diagnosisControlDiv.innerHTML = '<button id="retry" name="retry" onclick="myXmlSend(url, data, callbackObject, callbackFunction)">erneut versuchen</button>';
		// diagnosisControlDiv.style.display = "block";
		//diagnosisIFrame.innerHtml = '<iframe  srcdoc="<h1>TITEL</h1>" width="100%" height="80%">Your Browser does not support IFrames</iframe>';
		/*		var diagnosisWindow = window.open(myXmlSend.url, "Diagnosis Window", "width=600,height=600,scrollbars=yes");
		diagnosisWindow.onLoad = function() { // funktioniert nicht, weil diagnosisWindow = null, wenn der Popup-blocker aktiv ist
			alert("jetz hat's geklappt");
		};
		 */	/*try {
			diagnosisWindow.focus();
		} catch (e) {
			if (e instanceof TypeError) { // Pop-Up-Window blocked
				alert('Es ist ein Fehler beim Aufbau einer Verbindung aufgetreten. Um den genauen Fehler anzuzeigen, wurde versucht, die Verbindung in einem neuen Fenster zu �ffnen. Bitte lassen Sie das Pop-up-Fenster zu.');
			}
		} */
	};
	try {
		if (proxy && proxy.length > 0) {
			var urlparts = URI.getParts(url);
			myXmlSend.url = proxy + url; // urlparts.pathname + urlparts.search +urlparts.hash;
		}

		xml2.open('POST', myXmlSend.url, true);
		if (proxy && proxy.length > 0) {
			var urlparts = URI.getParts(url);
			var realhost = urlparts.host;
			xml2.setRequestHeader('Host', realhost);
		}
		xml2.send(myXmlSend.data);
		userlog("\r\n\r\n--> gesendet an Server " + myXmlSend.url + ': ' + myXmlSend.data + "\r\n\r\n");
		var errorDiv = document.getElementById("errorDiv");
		// var diagnosisControlDiv = document.getElementById("diagnosisControlDiv");
		errorDiv.style.display = "none";
		// diagnosisControlDiv.style.display = "none";
	} catch (e) { // this is thrown from ff if xml2.open fails because of a non existent protocol (like http oder https)
		// chrome calls xml2.onerror in this case
		// an old IE throws this for "permission dinied"
		// alert('Error trying to connect to ' + myXmlSend.url + '\n' + e.toString());
		xml2.onerror(e);
	}
}


// myXmlSend.myRetry = function() {myXmlSend(url, data, callbackObject, callbackFunction);};

function parseServerAnswer(xml) {
	if (xml.status != 200) {
		userlog("\n<--- empfangen Fehler " + xml.status + ": " + xml.statusText);
		alert("ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (" + xml.status + ") " + xml.statusText);
		throw new ErrorInServerAnswer(2000, 'Error: Server did not sent an answer', 'Got HTTP status: (' + xml.status + ') ' + xml.statusText);
	}
	try {
		userlog("\n<--- empfangen:\n" + xml.responseText);
		var regex = /----vvvote----\n(.*)\n----vvvote----\n/g;
		var tmp = regex.exec(xml.responseText);
		if (tmp != null && 1 in  tmp)	tmp = tmp[1]; // found ----vvvote---- marker
		else 							tmp = xml.responseText; // use complete response if no marker found
		var data = JSON.parse(tmp);
		return data;
	} catch (e) {
		// defined in exception.js
//		alert("ErrorInServerAnswer 2001, 'Error: could not JSON decode the server answer', 'Got from server: '" + xml.responseText);
		throw new ErrorInServerAnswer(2001, 'Error: could not JSON decode the server answer', 'Got from server: ' + xml.responseText);
		// 		return Object({'action':'clientError', 'errorText': "could not JSON decode: (" + e + ") \n" + dataString});

	}
}

/**
 * 
 * Working with up to 53 bits (more is not saved in a number [mantisse of a double])
 * @param num number to be converted to hex string
 * @param digits number of digits of the resulting hex string (padded this zeros)
 * @returns
 */
function int2hex(num, digits) {
	h = Number(num).toString(16);
	ret = ("000000000000000" + h).substr(-digits);
	return ret;
}

/**
 * @param str
 * @returns {String} a string where all not asci characters are encoded to \uXXXX resp. \UXXXXXXXX
 */
function unicodeToBlackslashU(str) {
	var ret = '';
	for (var i = 0; i < str.length; ++i) {
		var unicode = str.charCodeAt(i);
		if (unicode < 128) {
			ret = ret + str.charAt(i);
		} else {
			if (unicode < 65536) {
				ret = ret + '\\u' + int2hex(unicode, 4);
			} else {
				ret = ret + '\\U' + int2hex(unicode, 8);
			}
		}
	}
	return ret;
}

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 * taken from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * 
 */
function shuffleArray(arrayOrig) {
	array = arrayOrig.slice(0);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


