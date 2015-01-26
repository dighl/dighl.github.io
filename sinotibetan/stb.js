$('#concepts').multiselect({
      disableIfEmtpy: true,
      includeSelectAllOption : true,
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true,
 }
    );

$('#doculects').multiselect({
      disableIfEmtpy: true,
      includeSelectAllOption : true,
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true,
}
    );

$('#columns').multiselect({
      disableIfEmtpy: true,
      includeSelectAllOption : true,
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true,
}
    );

var sortprefs = {
  'DOCULECT' : 1,
  'CONCEPT' : 3,
  'GLOSS_IN_SOURCE' :2,
  'IPA' : 5,
  'ENTRY_IN_SOURCE' : 4,
  'TOKENS' : 6,
  'ALIGNMENT' : 7,
  'NOTE' : 8
};

function makeURL() {
  
  url = 'http://tsv.lingpy.org?remote_dbase=sinotibetan.sqlite3' 
    + '&file=sinotibetan'
    + '&basics=DOCULECT|CONCEPT|IPA|TOKENS|BORROWING|COMMENT|COGID|ALIGNMENT'
    ;

  /* get selected doculects */
  var docs = document.getElementById('doculects');
  var doculects = [];
  for (var i=0,doc; doc=docs.options[i]; i++) {
    if (doc.selected) {doculects.push(doc.value);
    }
  }

  if (doculects.length != docs.options.length && doculects.length > 0) {
    url += '&doculects='+doculects.join('|');
  }


  /* get selected doculects */
  var docs = document.getElementById('concepts');
  var concepts = [];
  for (var i=0,doc; doc=docs.options[i]; i++) {
    if (doc.selected) {concepts.push(doc.value);
    }
  }
  if (concepts.length != docs.options.length && concepts.length > 0) {
    url += '&concepts='+concepts.join('|');
  }

  /* get selected doculects */
  var docs = document.getElementById('columns');
  var columns = [];
  for (var i=0,doc; doc=docs.options[i]; i++) {
    if (doc.selected) {columns.push(doc.value);
    }
  }
  columns.sort(
      function (x,y) {
	_x = (x in sortprefs) ? sortprefs[x] : x.charCodeAt(0);
	_y = (y in sortprefs) ? sortprefs[y] : y.charCodeAt(0);
	return _x - _y;
      });
  console.log(columns);
  
  if (columns.length != docs.options.length && columns.length > 0) {
    url += '&columns='+columns.join('|');
  }

  /* output the url */
  var output = document.getElementById('output');
  output.innerHTML = '<br><br><p style="margin-top:30px;width:60%;font-size:16px">Press <a style="color:red;font-weight:bold;" href="'+url+'" target="_blank">here</a> to open the database '
    + 'with your specified settings, or paste the link below in your browser.</p>';
  output.innerHTML += '<pre style="width:60%"><code>'+url+'</code></pre>';

}
