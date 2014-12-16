var d3 = require('d3')

var tooltip
var w = 960
var h = 600
var formatNumber = d3.format(".0f")
var bodyNode = d3.select('body').node()

var colors = ['rgb(237,248,233)', 'rgb(186,228,179)',
  'rgb(116,196,118)', 'rgb(49,163,84)','rgb(0,109,44)']
var projection = d3.geo.mercator().center([105, 38]).scale(750).translate([w/2, h/2])
var path = d3.geo.path().projection(projection)
var color = d3.scale.quantize().range(colors)

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

    // choropleth
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
      .on('mouseover', function(d) {
        d3.select('body').selectAll('div.tooltip').remove()
        tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style("opacity", 0)
      })
      .on('mousemove', function(d) {
        d3.select(this).transition().duration(300).style('opacity', 1)
        tooltip.transition().duration(300)
          .style('opacity', 1)

        var absoluteMousePos = d3.mouse(bodyNode)
        tooltip.text(d.properties.name + ' : ' + d.properties.value)
          .style('left', (absoluteMousePos[0] + 10) + 'px')
          .style('top', (absoluteMousePos[1] - 25) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition().duration(300)
          .style('opacity', 0.8)
        tooltip.transition().duration(300)
          .remove()
      })

    // legend
    var legend  = svg.selectAll('g.legend')
      .data(colors)
      .enter()
      .append('g')
      .attr('class', 'legend')

    var ls_w = 20, ls_h = 20

    legend.append('rect')
      .attr('x', 20)
      .attr('y', function(d, i) { return h - (i*ls_h) - 2*ls_h })
      .attr('width', ls_w)
      .attr('height', ls_h)
      .style('fill', function(d) {
        return d
      })

    legend.append('text')
      .attr('x', 50)
      .attr('y', function(d, i){ return h - (i*ls_h) - ls_h - 4})
      .text(function(d, i){
        return formatNumber(color.invertExtent(d)[0])  + ' - ' + formatNumber(color.invertExtent(d)[1])
      })

  })

})

