function createTopoJson (url,datatype, fontsize) {

  if (typeof url == 'undefined') {
    url = 'json/aucou.json';
  }
  if (typeof datatype=='undefined') {
    datatype = 'ipa';
  }
  if (typeof fontsize == 'undefined') {
    fontsize = "15px";
  }

  var width = 600,
  height = 600;

  var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([7.0, 46.7])
    .scale(21500)
    .translate([width / 2, height / 2])
    .precision(.1);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  var DATA = {};

  d3.json("json/readme-swiss.json", function(error, swiss) {

    var tcantons = topojson.feature(swiss, swiss.objects.cantons);
    
    var cantons = {"type":"FeatureCollection","features":[]};
    for (c in tcantons.features) {
      if (['BE','VS','FR','NE','VD','JU','GE'].indexOf(tcantons.features[c].id) != -1) {
        cantons.features.push(tcantons.features[c]);
      }
    }

    console.log(cantons);

    var p1 = svg.append("path")
      .datum(cantons)
      .attr("class", "canton")
      .attr("d", path);

    var p2 = svg.append("path")
      .datum(topojson.mesh(swiss, swiss.objects.cantons, function(a, b) { return a !== b; }))
      .attr("class", "canton-boundary")
      .attr("d", path);

    svg.selectAll("text")
      .data(cantons.features);
    initiate(p1,p2);
  });

  /* put stuff in external function to avoid that it gets loaded
     before the topojson data has been initialized */

  function initiate(p1,p2) {
    var g = svg.append('g');

    d3.json(url, function(error, fra) {
      var points = [];
      for (key in fra) {
        if (key != 'french' && key != 'latin') {
          var tmp = {};
          tmp['id'] = key;
          tmp['name'] = fra[key]['taxon'];
          var latlon = projection([fra[key]['lat'],fra[key]['lon']]);
          tmp['lon'] = fra[key]['lat'];
          tmp['lat'] = fra[key]['lon'];
          tmp['word'] = fra[key][datatype];
          tmp['x'] = latlon[0];
          tmp['y'] = latlon[1];
        }
        points.push(tmp);
      }
      console.log(points);

      g.selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', function(d) {
          return projection ([d.lon,d.lat])[0];
        })
      .attr("cy", function(d) {
        return projection ([d.lon, d.lat])[1];
      })
      .attr("r",2)
        .style('fill','red')
        .attr('title',function(d){return d.word})
        ;

      g.selectAll('text')
        .data(points)
        .enter().append('text')
        .attr('transform', function(d) {return "translate(" + d.x+','+d.y+')';})
        .attr('id',function(d){return d.id;})
        .attr('class','textonmap')
        .attr('font-size', fontsize)
        .text(function(d) {return d.word;})
        .on('mouseover', function(d){
          svg.selectAll("text").sort(function(a,b) {
            if (a.id != d.id) { return -1;}
            else {return 1;}
          });
          $('#'+d.id).css('font-size','40px').css('fill','Crimson');
        })
        .on('mouseout',function(d){$('#'+d.id).css('font-size',fontsize).css('fill','black');})
      ;

      console.log(points);
var zoom = d3.behavior.zoom()
    .scaleExtent([1, 20]) /* added deeper scaling @lingulist */
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        p1.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        p2.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");


});
svg.call(zoom);

    });
  }

}
