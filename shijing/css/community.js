function filterCommunities() {
  
  var ipt = document.getElementById('textfield');
  var values;

  var val = ipt.value;
  if (val.indexOf('community') != -1) {
    var values = val.split(/[:=]/)[1].split(/\s*,\s*/);

    try {
      for (var i=0,val; val=values[i]; i++) {
	values[i] = parseInt(values[i]);
      }
    }
    catch(e) {
      values = [];
      for (var i=1; i<352; i++) {
	values.push(i);
      }
    }

    if (values.length == 0 || isNaN(values[0])){
      values = [];
      for (var i=1; i<352; i++) {
	values.push(i);
      }
    }
  }
  else if (val == '') {
    values = [];
      for (var i=1; i<352; i++) {
	values.push(i);
      }
  }
  else if (val.indexOf('character') != -1) {

    var chars = val.split(/[:=]/)[1].split(/\s*,\s*/);
    values = [];
    for (var i=1; i < 352; i++) {
      var txt = document.getElementById('community_'+i);
      for (var j=0,this_char; this_char = chars[j]; j++) {
	if (txt.innerHTML.indexOf(this_char) != -1) {
	  values.push(i);
	}
      }
    }
  }
  else if (val.indexOf('rime' != -1 || val.indexOf('rimes') != -1)) {

    var chars = val.split(/[:=]/)[1].split(/\s*,\s*/);
    values = [];
    for (var i=1; i < 352; i++) {
      var txt = document.getElementById('community_'+i);
      for (var j=0,this_char; this_char = chars[j]; j++) {
	if (txt.innerHTML.indexOf('-'+this_char+'<') != -1) {
	  values.push(i);
	}
      }
    }
  }


  for (var i=1;i<352; i++) {
    if (values.indexOf(i) == -1) {
      document.getElementById('community_'+i).style.display = 'none';
    }
    else {
      document.getElementById('community_'+i).style.display = 'block';
    }
  }
}
