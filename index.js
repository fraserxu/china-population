var d3 = require('d3')

var w = 960
var h = 600

var projection = d3.geo.mercator().center([105, 38]).scale(750).translate([w/2, h/2])
var path = d3.geo.path().projection(projection)
var color = d3.scale.quantize().range(['rgb(237,248,233)', 'rgb(186,228,179)',
  'rgb(116,196,118)', 'rgb(49,163,84)','rgb(0,109,44)'])

var svg = d3.select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h)

d3.csv('data/china_province_population.csv', function(data) {
  color.domain([ d3.min(data, function(d) { return d.value }), d3.max(data, function(d) { return d.value })])

  d3.json('data/china_provinces.json', function(json) {
    for (var i = 0; i < data.length; i++) {
      var dataProvince = data[i].id
      var dataValue = parseInt(data[i].value)
      for (var j = 0; j < json.features.length; j++) {
        var jsonProvince = json.features[j].id
        if (jsonProvince == dataProvince) {
          json.features[j].properties.value = dataValue
          break
        }
      }
    }

    svg.selectAll('path')
      .attr('class', 'province')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', function(d) {
        var value = d.properties.value
        if (value) {
          return color(value)
        } else {
          return '#ccc'
        }
      })
  })

})

