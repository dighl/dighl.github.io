/* Utility functions for accessing concepticon data.
 *
 * author   : Johann-Mattis List
 * email    : mattis.list@lingulist.de
 * created  : 2014-08-16 20:34
 * modified : 2014-08-16 20:34
 *
 */

function showConcept(oid)
{
  var elm = document.getElementById(oid);
  var owid = elm.dataset.index;
  var url = 'http://concepticon.github.io/iframe.html?'+owid;
  var append_string = '<div id="concepticon_popup"><h4>OMEGAWIKI ID '+owid+'<span style="float:right;border:1px solid black;padding:3px;margin:3px;" onclick="'+"$('#concepticon_popup').remove();"+'">×</span></h4><iframe name="concepticon" id="ifr" src="'+url+'">NOIFRAMESUPPORT</iframe></div>';

  $('#'+oid).parent().append(append_string);
}

function prepareConceptPopup()
{
  /* function builds popups for spans which contain a concepticon ID */
  var spans = document.getElementsByClassName('concepticon');
  for(var i=0,span;span=spans[i];i++)
  {
    span.onclick = function()
    {
      showConcept(this.id);
    }
  }
}

prepareConceptPopup();
