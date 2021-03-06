/* Wordlist main library
 *
 * author   : Johann-Mattis List
 * email    : mattis.list@lingulist.de
 * created  : 2014-06-28 09:48
 * modified : 2014-07-18 13:30
 *
 */

function reset()
{
 WLS = {};
 CFG = {'preview': 10,'nodi': false, 'sorted': false, 'formatter':false, '_alignment': false};
 STORE = '';
}

/* basic parameters */
var BASICS = [
  'DOCULECT',
  'GLOSS',
  'CONCEPT',
  'IPA',
  'TOKENS',
  'COGID',
  'TAXON',
  'TAXA',
  'PROTO',
  'PROTO_TOKENS',
  'ALIGNMENT',
  'ETYMONID'
  ];

var WLS = {};
var CFG = {'preview': 10,'nodi': false, 'sorting': false, 'formatter': false, '_alignment':false};
var STORE = ''; // global variable to store the text data in raw format


/* function for resetting the formatter */
function resetFormat(value)
{

  if(!value)
  {
    CFG['formatter'] = false;
    WLS['etyma'] = [];
  }
  else if(CFG['formatter'] != value)
  {
    var size = 0;
    CFG['formatter'] = value;
    var format_selection = {};
    var format_idx = WLS.header.indexOf(value);
    for(key in WLS)
    {
      if(!isNaN(key))
      {
        var tmp = WLS[key][format_idx];
        if(tmp in format_selection)
        {
          format_selection[tmp].push(key);
        }
        else if(tmp != 0)
        {
          format_selection[tmp] = [key];
        }
        size++;
      }
    }
    WLS['etyma'] = format_selection;
  }
  else
  {
    CFG['formatter'] = false;
    WLS['etyma'] = [];
  }

}

/* load qlc-file */
function csvToArrays(allText, separator, comment, keyval) {
  var allTextLines = allText.split(/\r\n|\n/);

  var qlc = {};
  var taxa = {};
  var concepts = {};
  var tIdx = -1;
  var cIdx = -1;
  var cogid = -1;
  var selection = [];
  var columns = {};
  var count = 1;

  var firstLineFound = false;
  var noid = false;
  for (var i = 0; i < allTextLines.length; i++)
  {
    var data = allTextLines[i].split(separator);
    if (data[0].charAt(0) == comment || data[0].replace(/\s*/g,'') == '' || data[0].charAt(0) == keyval){}
    else if (data[0] == 'ID')
    {
      firstLineFound = true;

      /* get the header */
      var header = [];
      for (j = 1; j < data.length; j++)
      {
        var datum = data[j].toUpperCase();
        header.push(datum);
        if (['TAXA', 'TAXON', 'LANGUAGE', 'DOCULECT'].indexOf(datum) != -1)
        {
          tIdx = j;
        }
        if (datum == 'GLOSS' || datum == 'CONCEPT' )
        {
          cIdx = j;
        }
        if (BASICS.indexOf(datum) != -1)
        {
          columns[datum] = j;
        }
        else
        {
          columns[datum] = -j;
        }
      }
      /* apply check for tidx and cidx */
      if (tIdx == -1 && cIdx == -1) {tIdx = 1;cIdx = 2;}
      else if (cIdx == -1 && tIdx > 1) {cIdx = 1; }
      else if (cIdx == -1 && tIdx <= 1) {cIdx = 2; }
      else if (tIdx == -1 && cIdx > 1) {tIdx = 1; }
      else if (tIdx == -1 && cIdx <= 1) {tIdx = 2; }

      /* append to basics */
      columns[data[tIdx].toUpperCase()] = Math.abs(columns[data[tIdx].toUpperCase()]);
      columns[data[cIdx].toUpperCase()] = Math.abs(columns[data[cIdx].toUpperCase()]);
      BASICS.push(data[tIdx].toUpperCase());
      BASICS.push(data[cIdx].toUpperCase());

    }
    /* handle cases where no ID has been submitted */
    else if(firstLineFound == false)
    {
      firstLineFound = true;
      noid = true;
      CFG['noid'] = true;

      /* get the header */
      var header = [];
      for (j = 0; j < data.length; j++)
      {
        var datum = data[j].toUpperCase();
        header.push(datum);
        if (['TAXA', 'TAXON', 'LANGUAGE', 'DOCULECT'].indexOf(datum) != -1)
        {
          tIdx = j;
        }
        if (datum == 'GLOSS' || datum == 'CONCEPT')
        {
          cIdx = j;
        }
        columns[datum] = j+1;
      }
      /* apply check for tidx and cidx */
      if (tIdx == -1 && cIdx == -1) {tIdx = 0;cIdx = 1;}
      else if (cIdx == -1 && tIdx > 1) {cIdx = 0; }
      else if (cIdx == -1 && tIdx <= 1) {cIdx = 1; }
      else if (tIdx == -1 && cIdx > 1) {tIdx = 2; }
      else if (tIdx == -1 && cIdx <= 1) {tIdx = 1; }

      /* append to basics */
      columns[data[tIdx].toUpperCase()] = Math.abs(columns[data[tIdx].toUpperCase()]);
      columns[data[cIdx].toUpperCase()] = Math.abs(columns[data[cIdx].toUpperCase()]);
      BASICS.push(data[tIdx].toUpperCase());
      BASICS.push(data[cIdx].toUpperCase());

    }
    //else if (data[0].charAt(0) == comment || data[0] == '') {}
    else if (firstLineFound)
    {
      if(!noid)
      {
        var idx = parseInt(data[0]);
        qlc[idx] = data.slice(1, data.length);
      }
      else
      {
        var idx = count;
        count += 1;
        qlc[idx] = data.slice(0,data.length);
      }

      /* check for header */
      var taxon = data[tIdx];
      var concept = data[cIdx];
      if (taxon in taxa)
      {
        taxa[taxon].push(idx);
      }
      else
      {
        taxa[taxon] = [idx];
      }
      if (concept in concepts)
      {
        concepts[concept].push(idx);
      }
      else
      {
        concepts[concept] = [idx];
      }
      selection.push(idx);
    }
  }
  // check whether or not we need this sorting mode, maybe we can as well get rid of it
  //selection.sort(function(x, y) {return x - y});

  WLS = qlc;
  WLS['header'] = header;
  WLS['taxa'] = taxa;
  WLS['concepts'] = concepts;
  WLS['parsed'] = true;
  WLS['rows'] = selection;
  WLS['_trows'] = selection.slice();
  WLS['columns'] = columns;
  WLS['filename'] = CFG['filename'];
  
  /* ! attention here, this may change if no ids are submitted! */
  CFG['_tidx'] = tIdx-1;
  CFG['_cidx'] = cIdx-1;
  
  /* add formatting options for all "ID" headers to the data */
  var formatter = document.getElementById('formatter');
  var tmp_text = '<th>Formatter</th><td>';
  var tmp_count = 0;
  for(var col in WLS['columns'])
  {
    if(col.indexOf('ID') - col.length == -2 && tmp_count == 0)
    {
      tmp_text += '<input onchange="resetFormat(this.value)" type="radio" checked name="formatter" value="'+col+'">'+col+' ';
      resetFormat(col);
      tmp_count += 1;
    }
    else if(col.indexOf('ID') - col.length == -2)
    {
      tmp_text += '<input onchange="resetFormat(this.value)" type="radio" name="formatter" value="'+col+'">'+col+' ';
      tmp_count += 1;
    }
  }
  tmp_text += '<input onchange="resetFormat(false)" type="radio" name="formatter" value="">FALSE ';
  if(tmp_count > 0)
  {
    formatter.innerHTML = tmp_text + '</td>';
    formatter.style.display = "table-row";
  }
  else
  {
    formatter.style.display = "none";
  }
  
  /* add settings for the column preview to the data */
  var all_columns = document.getElementById('columncb');
  var tmp_text = '<th>Columns</th><td>';
  for (col in WLS['columns'])
  {
    tmp_text += '<input id="cb_' + col + '" onchange="filterColumns(this.value);" type="checkbox" ';
    if (BASICS.indexOf(col) != -1)
    {
      tmp_text += 'checked ';
    }
    tmp_text += 'name="columns" value="';
    tmp_text += col;
    tmp_text += '"> ' + col + '<br>';
  }
  all_columns.innerHTML = tmp_text + '</td>';
  all_columns.style.display = 'table-row';
}

function showWLS(start)
{
  if (!WLS['parsed'])
  {
    //var store = document.getElementById('store');

    csvToArrays(STORE, '\t', '#', '@');
  }

  var text = '<table id="qlc_table">';

  // add col-tags to the dable
  text += '<col id="ID" />';
  var thtext = ''; // ff vs. chrome problem
  for (i in WLS['header'])
  {
    var head = WLS['header'][i];
    if (WLS['columns'][head] > 0)
    {
      text += '<col id="' + head + '" />';
      thtext += '<th title="Double-click for sorting along this column." id="HEAD_'+head+'" ondblclick="sortTable(event,'+"'"+head+"'"+')">' + head + '</th>';
    }
    else
    {
      text += '<col id="' + head + '" style="visibility:hidden;" />';
      thtext += '<th style="display:none">' + head + '</th>';
    }
  }

  text += '<tr>';
  text += '<th>ID</th>';
  text += thtext;
  text += '</tr>';

  //for(idx in WLS)
  var count = 1;
  if(CFG['formatter'])
  {
    var previous_format = '';
    var tmp_class = 'd0';
    for (i in WLS['rows']) //in WLS['rows'])
    {
      var idx = WLS['rows'][i];
      var current_format = WLS[idx][WLS['header'].indexOf(CFG['formatter'])];
      if (!isNaN(idx) && count >= start)
      {
        var rowidx = parseInt(i) + 1;
        if(current_format == 0)
        {
          tmp_class = 'd2';
          previous_format = current_format;
        }
        else if(previous_format == 0)
        {
          tmp_class = 'd0';
          previous_format = current_format;
        }
        else if(current_format != previous_format)
        {
          if(tmp_class == 'd0')
          {
            tmp_class = 'd1';
          }
          else
          {
            tmp_class = 'd0';
          }
          previous_format = current_format;
        }

        text += '<tr class="'+tmp_class+'" id="L_' + idx + '">';
        text += '<td class="ID" title="LINE ' + rowidx + '">' + idx + '</td>';
        for (j in WLS[idx])
        {
          var jdx = parseInt(j) + 1;

          var head = WLS['header'][j];
          if (WLS['columns'][head] > 0)
          {
            var cell_display = '';
          }
          else
          {
            var cell_display = ' style="display:none"'; // ff vs. chrome problem
          }
          if(WLS.header[j] != CFG['formatter'])
          {
            text += '<td class="' + WLS['header'][j] + '" title="MODIFY ENTRY ' + idx + '/' + jdx + '" onclick="editEntry(' + idx + ',' + jdx + ',0,0)" data-value="' + WLS[idx][j] + '"' + cell_display + '>';
            text += WLS[idx][j];
            text += '</td>';
          }
          else
          {
            text += '<td ondblclick="editGroup(event,'+"'"+WLS[idx][j]+"'"+')" oncontextmenu="editGroup(event,'+"'"+WLS[idx][j]+"')"+'" class="' + WLS['header'][j] + '" title="MODIFY ENTRY ' + idx + '/' + jdx + '" onclick="editEntry(' + idx + ',' + jdx + ',0,0)" data-value="' + WLS[idx][j] + '"' + cell_display + '>';
            text += WLS[idx][j];
            text += '</td>';
          }

        }
        text += '</tr>';
        count += 1;
      }
      else {count += 1;}
      if (count >= start + CFG['preview'])
      {
        break;
      }
    }
  }
  else
  {
    for (i in WLS['rows']) //in WLS['rows'])
    {
      var idx = WLS['rows'][i];
      if (!isNaN(idx) && count >= start)
      {
        var rowidx = parseInt(i) + 1;
        text += '<tr id="L_' + idx + '">';
        text += '<td class="ID" title="LINE ' + rowidx + '">' + idx + '</td>';
        for (j in WLS[idx])
        {
          var jdx = parseInt(j) + 1;

          var head = WLS['header'][j];
          if (WLS['columns'][head] > 0)
          {
            var cell_display = '';
          }
          else
          {
            var cell_display = ' style="display:none"'; // ff vs. chrome problem
          }
          text += '<td class="' + WLS['header'][j] + '" title="MODIFY ENTRY ' + idx + '/' + jdx + '" onclick="editEntry(' + idx + ',' + jdx + ',0,0)" data-value="' + WLS[idx][j] + '"' + cell_display + '>';
          text += WLS[idx][j];
          text += '</td>';
        }
        text += '</tr>';
        count += 1;
      }
      else {count += 1;}
      if (count >= start + CFG['preview'])
      {
        break;
      }
    }
  }
  text += '</table>';
  qlc.innerHTML = text;

  var db = document.getElementById('db');

  // modify previous and next
  var previous = document.getElementById('previous');
  if (parseInt(start) - CFG['preview'] >= 0)
  {
    previous.onclick = function() {showWLS(start - CFG['preview']);};
    var prestart = start - CFG['preview'];
    var startbefore = start - 1;
    previous.value = prestart + '-' + startbefore;
    previous.className = previous.className.replace(/inactive/, 'active');
  }
  else
  {
    previous.className = previous.className.replace(/ active/, ' inactive');
  }

  var next = document.getElementById('next');
  if (WLS['rows'].length > start + CFG['preview'])
  {
    var poststart = start + parseInt(CFG['preview']);
    var postpoststart = start + 2 * parseInt(CFG['preview']) - 1;
    if (postpoststart >= WLS['rows'].length)
    {
      postpoststart = WLS['rows'].length;
    }
    next.onclick = function() {showWLS(poststart);};
    next.value = poststart + '-' + postpoststart;
    next.className = next.className.replace(/inactive/, 'active');
  }
  else
  {
    next.className = next.className.replace(/ active/, ' inactive');
  }

  var current = document.getElementById('current');
  var following = start + CFG['preview'] - 1;
  if (following >= WLS['rows'].length - 1)
  {
    following = WLS['rows'].length;
  }
  current.innerHTML = 'Showing ' + start + ' - ' + following + ' of ' + parseInt(WLS['rows'].length) + ' entries';
  current.className = current.className.replace(/inactive/, 'active');

  document.getElementById('view').style.display = 'none';
  document.getElementById('mainsettings').style.display = 'inline';
  
  document.getElementById('filedisplay').style.display = 'block';
  document.getElementById('drop_zone').style.display = 'none';
  var fn = document.getElementById('filename');
  fn.innerHTML = '&lt;' + CFG['filename'] + '&gt;';
  highLight();
  
  if(CFG['sorted'])
  {
    document.getElementById('HEAD_'+CFG['sorted'].split('_')[1]).style.backgroundColor = 'Crimson';
  }
  
  //document.location.hash = 'qlc';
  return 1;
}

/* specific customized functions for adding a column to the wordlist */
function addColumn(event)
{
  var col = document.getElementById('add_column');

  if (event.keyCode != 13)
  {
    return;
  }

  var name = col.value.trim();
  if (name == '')
  {
    col.value = '';
    return;
  }
  var base = function(i) {return '?'};

  if (name.indexOf('>>') != -1)
  {
    var basename = name.split('>>');
    var basex = basename[0];

    var bases = basex.split(/\+/);
    var base = function(i) {
      var new_entry = '';
      for (k in bases)
      {
        var tmp = bases[k];
        if (tmp.charAt(0) == '$')
        {
          var j = WLS['header'].indexOf(tmp.slice(1, tmp.length).toUpperCase());
          if (j != -1)
          {
            new_entry += WLS[i][j];
          }
          else
          {
            new_entry += tmp;
          }
        }
        else if (tmp.charAt(0) == '!')
        {
          try
          {
            var str = 'var x = ' + tmp.slice(1, tmp.length) + '(' + '"' + new_entry + '"); return x;';
            var F = new Function(str);
            new_entry = F();
          }
          catch (err)
          {
            db = document.getElementById('db');
            db.innerHTML = err;
            db.style.color = 'red';
          }
        }
        else if (tmp.indexOf('(') != -1 && tmp.indexOf(')') != -1)
        {
            var str = 'var x = "' + new_entry + '".' + tmp + '; return x;';
            var F = new Function(str);
            new_entry = F();
        }
        else
        {
          new_entry += tmp;
        }
      }
      return new_entry;
    };
    var name = basename[1].toUpperCase();
  }

  if (name in WLS['columns'])
  {
    col.value = '';
    return;
  }

  for (idx in WLS)
  {
    if (!isNaN(idx))
    {
      WLS[idx].push(base(idx));
    }
  }
  WLS['header'].push(name);
  WLS['columns'][name] = WLS.header.length - 1;
  if (BASICS.indexOf(name) == -1)
  {
    BASICS.push(name);
  }

  col.value = '';
  showWLS(1);
}

function editEntry(idx, jdx, from_idx, from_jdx)
{
  var line = document.getElementById('L_' + idx);

  /* if line is undefined, check for next view */
  if (line === null || typeof line == 'undefined')
  {
    var ridx = WLS['rows'].indexOf(idx);
    var fidx = WLS['rows'].indexOf(from_idx);
    //fakeAlert(fidx+' '+ridx);
    if(ridx == -1 && fidx == -1)
    {
      fakeAlert("Error with the IDs, cannot find the correct indices for "+ridx+" and "+fidx);
      return;
    }
    else if (ridx == -1 && fidx == 0)
    {
      var wlsidx = WLS['rows'].length - CFG['preview'] - 1;
      showWLS(wlsidx);
      editEntry(WLS['rows'][(WLS['rows'].length-1)],jdx,0,0);
      return;
    }
    else if (ridx == -1 && fidx == WLS['rows'].length-1)
    {
      showWLS(1);
      editEntry(WLS['rows'][0],jdx,0,0);
      return;
    }
    else if (ridx > fidx)
    {
      var next = document.getElementById('next');
      if(typeof next != 'undefined')
      {
        var to_idx = parseInt(next.value.split('-')[0]);
        showWLS(to_idx);
        editEntry(idx, jdx, from_idx, from_jdx);
        return;
      }
      else
      {
        fakeAlert("Error with following entry, it seems to be undefined.");
        return;
      }
    }
    else if (ridx < fidx)
    {
      var previous = document.getElementById('previous');
      if(typeof previous != 'undefined')
      {
        var to_idx = parseInt(previous.value.split('-')[0]);
        showWLS(to_idx);
        editEntry(idx, jdx, from_idx, from_jdx);
        return;
      }
      else
      {
        fakeAlert("Error with preceeding entry, it seems to be undefined.");
      }
    }
    else
    {
      return;
    }
  }

  var entry = line.childNodes[jdx];

  if (jdx < 1 || jdx - 1 == WLS['header'].length)
  {
    if (jdx < 1)
    {
      jdx = WLS['header'].length;
      from_jdx = jdx + 1;
      editEntry(idx, jdx, from_idx, from_jdx);
      return;
    }
    else if (jdx - 1 == WLS['header'].length)
    {
      jdx = 1;
      from_jdx = 2;
      editEntry(idx, jdx, from_idx, from_jdx);
      return;
    }
  }

  var col = document.getElementById(entry.className);

  if (col.style.visibility == 'hidden')
  {
    if (from_jdx > jdx)
    {
      editEntry(idx, jdx - 1, from_idx, from_jdx);
    }
    else if (from_jdx < jdx)
    {
      editEntry(idx, jdx + 1, from_idx, from_jdx);
    }
    return;
  }

  entry.onclick = '';
  var value = entry.dataset.value;
  var size = value.length + 5;
  var text = '<input class="cellinput" type="text" size="' + size + '" id="modify_' + idx + '_' + jdx + '" value="' + value + '" />';

  var ipt = document.createElement('input');
  ipt.setAttribute('class', 'cellinput');
  ipt.setAttribute('type', 'text');
  ipt.setAttribute('id', 'modify_' + idx + '_' + jdx);
  ipt.setAttribute('value', value);
  ipt.setAttribute('data-value', value);
  ipt.setAttribute('onkeyup', 'modifyEntry(event,' + idx + ',' + jdx + ',this.value)');
  ipt.setAttribute('onblur', 'unmodifyEntry(' + idx + ',' + jdx + ',"' + value + '")');

  ipt.size = size;
  entry.innerHTML = '';
  entry.appendChild(ipt);
  ipt.focus();

  //completeModify(idx,jdx);
}

function autoModifyEntry(idx, jdx, value, current)
{

  var tcurrent = parseInt(getCurrent());
  current = parseInt(current);

  if (tcurrent != current)
  {
    var tmp = showWLS(current);
  }
  var line = document.getElementById('L_' + idx);
  if (line !== null)
  {
    var entry = line.childNodes[jdx];
    entry.dataset.value = value;
    entry.innerHTML = value;
    entry.style.border = '1px solid Crimson';
  }
  var j = parseInt(jdx) - 1;
  WLS[idx][j] = value;

  highLight();

}

function modifyEntry(event, idx, jdx, xvalue)
{
  var process = false;

  /* get current index in the current view */
  var cdx = WLS['rows'].indexOf(idx);
  var bdx = WLS['rows'][cdx - 1];
  var ndx = WLS['rows'][cdx + 1];
  var j = parseInt(jdx) - 1;

  var entry = document.getElementById('L_' + idx).cells[jdx];

  /* move up and down */
  if (event.keyCode == 38)
  {
    process = true;
    ni = bdx;
    nj = jdx;
  }
  else if (event.keyCode == 40)
  {
    process = true;
    ni = ndx;
    nj = jdx;
  }
  /* move to left and right */
  else if (event.keyCode == 37 && event.ctrlKey)
  {
    process = true;
    ni = idx;
    nj = jdx - 1;
  }
  else if (event.keyCode == 39 && event.ctrlKey)
  {
    process = true;
    ni = idx;
    nj = jdx + 1;
  }
  /* unmodify on escape */
  else if (event.keyCode == 27)
  {
    unmodifyEntry(idx, jdx, entry.dataset.value);
    return;
  }
  /* modify on enter */
  else if (event.keyCode != 13)
  {
    return;
  }

  /* change sampa to ipa if entries are ipa or tokens */
  if (entry.className == 'IPA' || entry.className.indexOf('TOKENS') != -1 || entry.className == 'PROTO' || entry.className.indexOf('ALIGNMENT') != -1)
  {
    xvalue = sampa2ipa(xvalue); //modify.value);
  }
  //WLS[idx][j] = xvalue; //modify.value;

  var prevalue = entry.dataset.value;
  entry.dataset.value = xvalue; //this.value; //modify.value;

  entry.onclick = function() {editEntry(idx, jdx, 0, 0)};

  entry.innerHTML = '';
  entry.innerHTML = xvalue; //modify.value;

  if (process == true)
  {
    editEntry(ni, nj, idx, jdx);
  }
  highLight();

  var current = getCurrent();

  if (prevalue != xvalue)
  {
    undoManager.add({
      undo: function() {autoModifyEntry(idx, jdx, prevalue, current);},
      redo: function() {autoModifyEntry(idx, jdx, xvalue, current);}
      }
    );
    WLS[idx][jdx - 1] = xvalue;
  }
  if (undoManager.hasUndo() == true)
  {
    $('#undo').removeClass('inactive');
    $('#undo').addClass('active');
  }
  else
  {
    $('#undo').removeClass('active');
    $('#undo').addClass('inactive');
  }
}


function unmodifyEntry(idx, jdx, xvalue)
{
  var entry = document.getElementById('L_' + idx).cells[jdx];
  var value = xvalue; //entry.innerText;
  entry.onclick = function() {editEntry(idx, jdx, 0, 0)};
  var j = parseInt(jdx) - 1;
  WLS[idx][j] = value;
  entry.innerHTML = '';
  entry.innerHTML = value;
  highLight();
}

// function filterWordlist(event,value)
// {
//   if(typeof WLS['_prows'] == 'undefined')
//   {
//     WLS['_prows'] = WLS['rows'];
//   }
//   else
//   {
//     WLS['rows'] = WLS['_prows'];
//   }
//   if(value == '')
//   {
//     WLS['rows'] = WLS['_prows'];
//     showWLS(1);
//     return;
//   }
// 
//   if(event.keyCode == 13)
//   {
//     if(value.indexOf('==') != -1)
//     {
//       var mode = 'equal';
//       var vals = value.split(/\s*==\s*/);
//     }
//     else if(value.indexOf('=') != -1)
//     {
//       var mode = 'like';
//       var vals = value.split(/\s*=\s/);
//     }
//     else{return;}
// 
//     //var vals = value.split(/\s*=\s*/);
//     var c = vals[0];
//     var v = vals[1].toLowerCase().replace(/\n/,'');
//     var new_rows = [];
//     var idx = WLS['header'].indexOf(c.toUpperCase());
//     if(typeof idx != 'undefined')
//     {
//       for(var i=0,r;r=WLS['rows'][i];i++)
//       {
//         var val = WLS[r][idx].toLowerCase();
//         if(val.indexOf(v) != -1 && mode == 'like')
//         {
//           new_rows.push(r);
//         }
// 	      else if(val == v && mode == 'equal')
// 	      {
// 	      new_rows.push(r);
// 	      }
//       }
//       if(new_rows.length > 0)
//       {
// 	      WLS['rows'] = new_rows;
// 	      showWLS(1);
//       }
//     }
//   }
//   else
//   {
//     return;
//   }
// }

function filterWLS(event, type)
{
  if(type == 'custom' && event.keyCode != 13)
  {
    return;
  }
  else if(type == 'custom' && event.keyCode == 13)
  {
    applyFilter();
    showWLS(1);
    return;
  }
  
  var stuff = Object.keys(WLS[type]);

  function split(val ) {
    return val.split(/,\s*/);
  }
  function extractLast(term ) {
    return split(term).pop();
  }
  $('#' + type).bind('keydown', function(event ) 
      {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).data('ui-autocomplete').menu.active)
        {
          event.preventDefault();
        }
      }
    ).autocomplete(
    {
      delay: 0,
      minLength: 0,
      source: function(request, response ) 
      {
        // delegate back to autocomplete, but extract the last term
        response($.ui.autocomplete.filter(
        stuff, extractLast(request.term)));
      },
      focus: function() 
      {
        // prevent value inserted on focus
        return false;
      },
      select: function(event, ui ) 
      {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        terms.push('');
        this.value = terms.join(', ');
        return false;
      }
    }
  );

  if (event.keyCode == 13)
  {
    applyFilter();

    // determine the correct position at which we are at the moment
    var previous = document.getElementById('previous');
    var current_index = 1;
    if (previous === null)
    {
      current_index = 1;
    }
    else
    {
      current_index = parseInt(previous.value.split('-')[1]) + 1;
    }

    if (isNaN(current_index))
    {
      showWLS(1);
    }
    else
    {
      showWLS(current_index);
    }
  }
}

function applyFilter()
{

  var taxa = document.getElementById('taxa');
  var concepts = document.getElementById('concepts');
  var entries = document.getElementById('columns');
  var custom = document.getElementById('filter_all');

  var trows = [];
  var crows = [];
  var erows = [];
  var arows = [];

  var tlist = taxa.value.split(/,\s*/);
  var clist = concepts.value.split(/,\s*/);
  var elist = entries.value.toUpperCase().split(/,\s*/);
  var alist = custom.value;

  if (tlist[0] == '')
  {
    tlist = Object.keys(WLS['taxa']);
  }
  if (clist[0] == '')
  {
    clist = Object.keys(WLS['concepts']);
  }
  if (elist[0] == '')
  {
    elist = [];
  }

  for (i in tlist)
  {
    if (tlist[i] != '')
    {
      trows.push.apply(trows, WLS['taxa'][tlist[i]]);
    }
  }
  for (i in clist)
  {
    if (clist[i] != '')
    {
      crows.push.apply(crows, WLS['concepts'][clist[i]]);
    }
  }

  /* now it starts */
  if(alist.replace(/\s*/,'') != '')
  {
    if(alist.indexOf('==') != -1)
    {
      var keyval = alist.split(/\s*==\s*/);
      var key = keyval[0].toUpperCase();
      var val = keyval[1];
      var compare = 'identical';
    }
    else if(alist.indexOf('=') != -1)
    {
      var keyval = alist.split(/\s*=\s*/);
      var key = keyval[0].toUpperCase();
      var val = keyval[1];
      var compare = 'similar';
    }
    else 
    {
      var compare = 'error';
    }
    
    if(compare != 'error')
    {
      for(var i=0; i < WLS._trows.length;i++)
      {
        var idx = WLS._trows[i];
        
        var value = WLS[idx][WLS.header.indexOf(key)];
        if(typeof value == 'undefined')
        {
          fakeAlert("The values specified in the custom filter are erroneous.");
          custom.value = '';
          break;
        }
        if(compare == 'identical' && value == val)
        {
          arows.push(idx);
        }
        else if(compare == 'similar' && value.indexOf(val) != -1)
        {
          arows.push(idx);
        }
      }
    }
    else
    {
      fakeAlert("The values specified in the custom filter are erroneous.");
      custom.value = '';
    }
    
    if(custom.value == '')
    {
      arows = WLS._trows.slice();
    }
  }
  else
  {
    arows = WLS._trows.slice();
  }

  /* check for the filtering of columns now */
  if (elist[0] == '*')
  {
    entries.value = '';
    for (i in WLS['header'])
    {
      head = WLS['header'][i];
      WLS['columns'][head] = Math.abs(WLS['columns'][head]);
      document.getElementById('cb_' + head).checked = true;
      if (BASICS.indexOf(head) == -1)
      {
        entries.value += head + ', ';
      }
    }
  }
  else
  {
    for (i in WLS['header'])
    {
      var head = WLS['header'][i];
      if (elist.indexOf(head) != -1)
      {
        if (BASICS.indexOf(head) != -1)
        {
          WLS['columns'][head] = -Math.abs(WLS['columns'][head]);
          document.getElementById('cb_' + head).checked = false;
        }
        else
        {
          WLS['columns'][head] = Math.abs(WLS['columns'][head]);
          document.getElementById('cb_' + head).checked = true;
        }
      }
      else
      {
        if (BASICS.indexOf(head) == -1)
        {
          WLS['columns'][head] = -Math.abs(WLS['columns'][head]);
          document.getElementById('cb_' + head).checked = false;
        }
        else
        {
          WLS['columns'][head] = Math.abs(WLS['columns'][head]);
          document.getElementById('cb_' + head).checked = true;
        }
      }
    }
  }

  /* sort both lists */
  trows.sort(function(x, y) {return x - y});
  crows.sort(function(x, y) {return x - y});
  arows.sort(function(x, y) {return x - y});

  /* function taken from http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript */
  function intersection_destructive(a, b)
  {
    var result = new Array();
    while (a.length > 0 && b.length > 0)
    {
       if (a[0] < b[0]) { a.shift(); }
       else if (a[0] > b[0]) { b.shift(); }
       else /* they're equal */
       {
         result.push(a.shift());
         b.shift();
       }
    }

    return result;
  }

  var rows = intersection_destructive(trows, crows);
  rows = intersection_destructive(rows, arows);

  if(rows.length < 1)
  {
    fakeAlert("No entries matching your filter criteria could be found. All filters will be reset.");
    custom.value = '';
    applyFilter();
  }
  else
  {
    WLS['rows'] = rows.sort(function(x, y) {return x - y;});
  }
}

/* filter the columns in the data */
function filterColumns(column)
{

  var columns = document.getElementById('columns');

  if (columns.value.indexOf(column) != -1)
  {
    columns.value = columns.value.replace(column + ', ', '');
  }
  else
  {
    columns.value += column + ', ';
  }

  //columns.value += column.value+', ';
  applyFilter();
  showCurrent();
}


function getCurrent()
{
  var previous = document.getElementById('previous');
  var current_index = 1;
  if (previous === null)
  {
    current_index = 1;
  }
  else
  {
    current_index = parseInt(previous.value.split('-')[1]) + 1;
  }
  return current_index;
}

function showCurrent()
{
  var previous = document.getElementById('previous');
  var current_index = 1;
  if (previous === null)
  {
    current_index = 1;
  }
  else
  {
    current_index = parseInt(previous.value.split('-')[1]) + 1;
  }

  if (isNaN(current_index))
  {
    showWLS(1);
  }
  else
  {
    showWLS(current_index);
  }
}

/* file-handler function from http://www.html5rocks.com/de/tutorials/file/dndfiles/ */
function handleFileSelect(evt) 
{
  var files = evt.target.files; /* FileList object */
  var file = files[0];
  reset();
  
  //var store = document.getElementById('store');
  CFG['filename'] = file.name;
  localStorage.filename = file.name;
  STORE = '';

  /* create file reader instance */
  var reader = new FileReader({async: false});
  reader.onload = function(e) {STORE = reader.result;};
  reader.readAsText(file);

  /* modify this part !!! */
  var modify = ['view'];
  for (i in modify)
  {
    tmp = document.getElementById(modify[i]);
    tmp.style.display = 'block';
  }
  var modify = ['concepts', 'columns', 'taxa', 'add_column', 'previous', 'next', 'current',];
  for (i in modify)
  {
    $('#' + modify[i]).removeClass('active');
    $('#' + modify[i]).addClass('inactive');
  }
  document.getElementById('qlc').innerHTML = '';

  var fn = document.getElementById('filename');
  fn.innerHTML = '&lt;' + CFG['filename'] + '&gt;';
  var dropZone = document.getElementById('drop_zone');
  dropZone.style.display = 'none';
}

function refreshFile()
{
  //var store = document.getElementById('store');
  var text = '# WORDLIST\n';
  text += '@modified: ' + getDate() + '\n#\n';
  //text += 'ID\t' + WLS['header'].join('\t') + '\n';
  text += 'ID';
  for(var i=0,head;head=WLS['header'][i];i++)
  {
    if(WLS['columns'][head] > 0)
    {
      text += '\t'+head;
    }
  }
  text += '\n';
  for (concept in WLS['concepts'])
  {
    if(CFG['noid'] == false)
    {
      text += '#\n';
    }
    for (i in WLS['concepts'][concept])
    {
      var idx = WLS['concepts'][concept][i];

      if (!isNaN(idx))
      {
        //text += idx + '\t' + WLS[idx].join('\t') + '\n';
	text += idx;
	for(var j=0,head;head=WLS['header'][j];j++)
	{
	  if(WLS['columns'][head] > 0)
	  {
	    text += '\t'+WLS[idx][j];
	  }
	}
	text += '\n';
      }
    }
  }
  //store.innerText = text;
  STORE = text;
  WLS['edited'] = true;
  localStorage.text = text;
  localStorage.filename = CFG['filename'];

  $('#undo').removeClass('active');
  $('#undo').addClass('inactive');
  $('#redo').removeClass('active');
  $('#redo').addClass('inactive');
  undoManager.clear();
  showWLS(getCurrent());
  fakeAlert("Document was saved in local storage and can now be exported. Note that only those columns which are currently displayed will be written to file. If You want to select different columns for export, check out the current settings of column display by pressing F2, alter them accordingly, and SAVE the document again."); 
}

function fakeAlert(text)
{
  var falert = document.createElement('div');
  falert.id = 'fake';
  var text = '<div class="message"><p>' + text + '</p>';
  text += '<div class="okbutton" onclick="' + "$('#fake').remove(); document.onkeydown = function(event){basickeydown(event)};" + '")> OK </div></div>';
  falert.className = 'fake_alert';

  document.body.appendChild(falert);
  falert.innerHTML = text;
  document.onkeydown = function(event){$('#fake').remove(); document.onkeydown = function(event){basickeydown(event);};};

}
/* save file */
function saveFile()
{
  /* disallow saving when document was not edited */
  if (!WLS['edited'])
  {
    fakeAlert('You need to SAVE (press button or CTRL+S) the document before you can EXPORT it.');
    return;
  }

  //var store = document.getElementById('store');
  var blob = new Blob([STORE], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, CFG['filename']);
}

/* save one alignment from the data into file */
function saveAlignment(idx)
{
  /* check for valid alignment first */
  if(!CFG['_alignment'])
  {
    fakeAlert("No valid alignment was specified.");
    return;
  }
  var blob = new Blob([CFG['_alignment']],{type: 'text/plain;charset=utf-8'});
  saveAs(blob, CFG['filename'].replace('.tsv','_'+idx+'_.msa'));
}

function getDate()
{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  var hh = today.getHours();
  var mins = today.getMinutes();

  if (dd < 10) {
      dd = '0' + dd;
  }

  if (mm < 10) {
      mm = '0' + mm;
  }

  today = [yyyy, mm, dd].join('-') + ' ' + hh + ':' + mins;
  return today;
}


function highLight()
{
  for(var i=0,head;head=WLS.header[i];i++)
  {
    if(head.indexOf('TOKENS') != -1 || head.indexOf('ALIGNMENT') != -1)
    {
      var tokens = document.getElementsByClassName(head);
      for (var j = 0; j < tokens.length; j++)
      {
        if (tokens[j].innerHTML == tokens[j].dataset.value)
        {
          var word = plotWord(tokens[j].dataset.value);
          tokens[j].innerHTML = word;
        }
      }
    }
    else
    {
    }
  }
}

function toggleSettings()
{
  var settings = document.getElementById('settingswitcher');
  if (settings.value == 'HIDE SETTINGS')
  {
    settings.value = 'SHOW SETTINGS';
    $('#settings').removeClass('active');
    $('#settings').addClass('inactive');
  }
  else
  {
    settings.value = 'HIDE SETTINGS';
    $('#settings').removeClass('inactive');
    $('#settings').addClass('active');
  }

}

function toggleHelp()
{
  var help = document.getElementById('help');
  $('#help').toggle('active');

}

function toggleDiv(divid)
{
  var divo = document.getElementById(divid);
  if(divo.style.display != 'none')
  {
    divo.style.display = 'none';
  }
  else
  {
    divo.style.display = 'block';
  }
}


function sortTable(event,head)
{
  if(CFG['sorted'] == 'th_'+head+'_0')
  {
    WLS['rows'].sort(function(x,y){return x-y});
    CFG['sorted'] = false;
  }
  else if (CFG['sorted'] == 'th_'+head+'_1')
  {
    var rows = WLS.rows.slice();

    WLS['rows'] = rows.sort(
        function(x,y)
        {
          var a = WLS[x][WLS.header.indexOf(head)];
          var b = WLS[y][WLS.header.indexOf(head)];
          var c = parseInt(a);
          var d = parseInt(b);

          if(!isNaN(c) && !isNaN(d))
          {
            return c - d;
          }
          else
          {
            return b.localeCompare(a);

            //if(a < b){return 1;}
            //else if(a == b){return 0;}
            //else{return -1;}
          }
        }
        );
    CFG['sorted'] = 'th_'+head+'_0';
  }
  else
  {
    var rows = WLS.rows.slice();

    WLS['rows'] = rows.sort(
        function(x,y)
        {
          var a = WLS[x][WLS.header.indexOf(head)];
          var b = WLS[y][WLS.header.indexOf(head)];
          var c = parseInt(a);
          var d = parseInt(b);

          if(!isNaN(c) && !isNaN(d))
          {
            return d - c;
          }
          else
          {
            return a.localeCompare(b);

            //if(a <= b){return -1;}
            //else if(a == b){return 0);
            //else{return 1;}
          }
        }
        );
    CFG['sorted'] = 'th_'+head+'_1';
  }
  showWLS(1);
}


window.onload = function() {
    undoManager = new UndoManager();
};

function editGroup(event,idx)
{
  event.preventDefault();
  if(idx == 0)
  {
    fakeAlert("This entry cannot be edited, since it is not related to any other entry.");
    return;
  }
  if(WLS.header.indexOf('ALIGNMENT') != -1)
  {
    var this_idx = WLS.header.indexOf('ALIGNMENT');
  }
  else if(WLS.header.indexOf('TOKENS') != -1)
  {
    var this_idx = WLS.header.indexOf('TOKENS');
  }
  else if(WLS.header.indexOf('IPA') != -1)
  {
    var this_idx = WLS.header.indexOf('IPA');
  }
  else if(WLS.header.indexOf('WORD') != -1)
  {
    var this_idx = WLS.header.indexOf('WORD');
  }
  else
  {
    fakeAlert('No phonetic entries were specified in the data.');
    return;
  }
  var editmode = document.createElement('div');
  editmode.id = 'editmode';
  editmode.className = 'editmode';

  var rows = WLS['etyma'][idx];
  var alms = [];
  var langs = [];
  var blobtxt = '';
  for(var i=0,r;r=rows[i];i++)
  {
    var alm = plotWord(WLS[r][this_idx]);
    var lang = WLS[r][CFG['_tidx']];
    alms.push('<td class="alm_taxon">'+lang+'</td>'+alm.replace('span','td','g'));
    blobtxt += r+'\t'+lang+'\t'+WLS[r][this_idx].replace(' ','\t','g')+'\n';
  }
  CFG['_alignment'] = blobtxt;

  var text = '<div class="edit_links">';
  text += '<p>This entry links to the following '+alms.length+' entries:</p>';
  text += '<div class="alignments"><table>';
  for(var i=0,alm;alm=alms[i];i++)
  {
    text += '<tr>'+alm+'</tr>';
  }
  text += '</table></div>';
  text += '<input class="submit" type="button" onclick="fakeAlert(\'This part is under construction.\')" value="EDIT" /> ';
  text += '<input class="submit" type="button" onclick="saveAlignment('+idx+')" value="EXPORT" /> ';
  text += '<input class="submit" type="button" onclick="$(\'#editmode\').remove();basickeydown(event);" value="CLOSE" /><br><br> ';
  text += '</div> ';
  document.body.appendChild(editmode);
  editmode.innerHTML = text;
  document.onkeydown = function(event){$('#editmode').remove(); document.onkeydown = function(event){basickeydown(event);};};
  //document.onclick = function(event){$('#editmode').remove(); document.onkeydown = function(event){basickeydown(event);};};
}

//function closeWindow(event,divid)
//{
//  $(divid).remove(); document.onkeydown = function(event){basickeydown(event);};}
//}
