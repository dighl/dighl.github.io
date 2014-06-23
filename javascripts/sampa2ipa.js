/* code forked from PhonVerter by */
var equiv = [
  'p͡f', 'p_f',
  'b͡v', 'b_v',
  'ʨ', 't_s\\',
  'ʥ', 'd_z\\',
  'ʣ', 'd_z',
  'ʤ', 'd_Z',
  'ʧ', 't_S',
  'ʦ', 't_s',
  '͡', '&#41;',
  'ɛ', 'E', 'ɑ', 'A', 'ɔ', 'O', 'ø', '2', 'œ', '9', 'ɶ', '&', 'ɒ', 'Q', 'ʌ', 'V', 
  'ɤ', '7', 'ɯ', 'M', 'ɪ', 'I', 'ʏ', 'Y', 'æ', '{', 'ʊ', 'U', 'ɨ', '1', 'ʉ', '}', 
  'ɘ', '@\\', 'ɵ', '8', 'ə', '@', 'ɜ', '3', 'ɞ', '3\\', 'ɐ', '6', '̪', '_d', '̠', '_-', 
  'ʈ', 't`', 'ɖ', 'd`', 'ɟ', 'j\\', 'g', 'g', 'ɢ', 'G\\', 'ʔ', '?', '̥', '_0', 'ɱ', 
  'F', 'ɳ', 'n`', 'ɲ', 'J', 'ŋ', 'N', 'ɴ', 'N\\', 'ʙ', 'B\\', 'ʀ', 'R', 'ɾ', '4', 
  'ɽ', 'r`', 'ɸ', 'p\\', 'β', 'B', 'θ', 'T', 'ð', 'D', 'ʃ', 'S', 'ʒ', 'Z', 'ʂ', 's`', 
  'ʐ', 's`', 'ç', 'C', 'ʝ', 'j\\', 'ɣ', 'G', 'χ', 'X', 'ʁ', 'R', 'ħ', 'X\\', 'ʕ', '?\\', 
  'ɦ', 'h\\', 'ɬ', 'K', 'ɮ', 'K\\', '̞', '_o', 'ɹ', 'r\\', 'ɻ', 'r\\`', 'ɰ', 'M\\', 
  'ɭ', 'l`', 'λ', 'L', 'ʟ', 'L\\', 'ʘ', 'O\\', 'ǀ', '|\\', 'ǃ', '!\\', 'ǂ', '=\\',
  'ɓ', 'b_<', 'ɗ', 'd_<', 'ʄ', 'j\_<', 'ɠ', 'g_<', 'ʛ', 'G\_<', 'ʼ', '_>', 'ʍ', 'W', 
  'ɥ', 'H', 'ʢ', '<\\', 'ɕ', 's\\', 'ɺ', 'l\\', 'ʜ', 'H\\', 'ʡ', '>\\', 'ʑ', 'z\\', 
  'ɧ', 'x\\', 'ː', ':', 'ˑ', ':\\', 'ˑ', '.', '̩', '_=', '̩', '=', '̃', '~', '̃', '_~', 
  'ˈ', '"', 'ˌ', '%', ' ̈', '_"', '̟', '_+', '̠', '_-', 'ˇ', '_/', '̥', '_0', 'ˤ', '_?\\', 
  'ˆ', '_\\', '̯', '_^', '̚', '_}', '̘', '_A', '̺', '_a', '᷅', '_B_L', '̏', '_B', '̜', '_c', '̪', 
  '_d', '̴', '_e', '̂', '_F', 'ˠ', '_G', '᷄', '_H_T', '́', '_H', 'ʲ', '_j', '̰', '_k', '̀', '_L', 
  'ˡ', '_l', '̄', '_M', '̻', '_m', '̼', '_N', 'ʰ', '_h', 'ⁿ', '_n', '̹', '_O', 
  '̞', '_o', '̙', '_q', '᷈', '_R_F', '̌', '_R', '̝', '_r', '̋', '_T', '̤', '_t', '̬', '_v', 'ʷ', '_w', '̆', '_X', '̽', '_x'
  ];
var equiv2 = new Array();

for (var i=0; i<equiv.length; i++) {
	equiv2[i] = equiv[i].replace(/\\/g, '\\\\'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\?/g, '\\?'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\|/g, '\\|'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\+/g, '\\+'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\-/g, '\\-'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\{/g, '\\{'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\}/g, '\\}'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\=/g, '\\='); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\</g, '\\<'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\>/g, '\\>'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\./g, '\\.'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\,/g, '\\,'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\:/g, '\\:'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\;/g, '\\;'); // evita potenziali errori creati dai simboli SAMPA
	equiv2[i] = equiv2[i].replace(/\^/g, '\\^'); // evita potenziali errori creati dai simboli SAMPA
}


/* general function for conversion of sampa string to ipa */
function sampa2ipa(ipa_string)
{		
  var ipa = ipa_string;
  ipa = ipa.replace(')','&#41;');
  ipa = ipa.replace('(','&#40;');
  var reg = '';
  	
	// cerca se c'é un equivalente
	for (var i=1; i<=equiv2.length; i=i+2) {
		reg = new RegExp (equiv2[i], 'g');
		ipa = ipa.replace(reg, equiv2[i-1]);
	}
		
  return (ipa);
}

/* specific function for nice conversion of ipa stuff using autosuggest-like stuff */
function make_sampa(field_id, start, stop, outstart, outstop)
{
  if(typeof start == 'undefined')
  {
    start = "/x ";
  }
  if(typeof stop == 'undefined')
  {
    stop = " x/";
  }

  if(typeof outstop == 'undefined')
  {
    outstop = '';
  }
  if(typeof outstart == 'undefined')
  {
    outstart = '';
  }

  var fid = document.getElementById(field_id);
  var text = fid.value;
  var rego = new RegExp(start+".+?"+stop,"g");
  var sampas = text.match(rego);
  if(typeof sampas == null)
  {
    return;
  }
  for(var i=0,word;word=sampas[i];i++)
  {
    text = text.replace(word, outstart + sampa2ipa(word.slice(start.length,word.length-stop.length))+outstop );
  }
  
  fid.value = text;
}
