function createTopoJson (url) {

  var width = 960,
  height = 600;

  var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.3, 46.8])
    .scale(16000)
    .translate([width / 2, height / 2])
    .precision(.1);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);


  d3.json("json/readme-swiss.json", function(error, swiss) {



    var tcantons = topojson.feature(swiss, swiss.objects.cantons);
    
    var cantons = {"type":"FeatureCollection","features":[]};
    for (c in tcantons.features) {
      if (['BE','VS','FR','NE','VD','JU','GE'].indexOf(tcantons.features[c].id) != -1) {
        cantons.features.push(tcantons.features[c]);
      }
    }

    console.log(cantons);

    svg.append("path")
      .datum(cantons)
      .attr("class", "canton")
      .attr("d", path);

    svg.append("path")
      .datum(topojson.mesh(swiss, swiss.objects.cantons, function(a, b) { return a !== b; }))
      .attr("class", "canton-boundary")
      .attr("d", path);

    svg.selectAll("text")
      .data(cantons.features);
    initiate();
  });

  /* put stuff in external function to avoid that it gets loaded
     before the topojson data has been initialized */

  function initiate() {
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
          tmp['word'] = fra[key]['ipa'];
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
      .attr("r",5)
        .style('fill','red')
        .attr('title',function(d){return d.word})
        ;

      g.selectAll('text')
        .data(points)
        .enter().append('text')
        .attr('transform', function(d) {return "translate(" + d.x+','+d.y+')';})
        .text(function(d) {return d.word;});

      console.log(points);
    });
  }
}
