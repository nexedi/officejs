var showUng=function(m) {
	if(m==false){
		document.getElementById("ungcontent").style.display='none';
		document.getElementById("themecontent").style.display='block';
		document.getElementById("ungheader").style.display='none';
		document.getElementById("themeheader").style.display='block';
	}
	else{
		document.getElementById("ungcontent").style.display='block';
		document.getElementById("themecontent").style.display='none';
		document.getElementById("ungheader").style.display='block';
		document.getElementById("themeheader").style.display='none';
		$(document).ready(initung);
	}
}
