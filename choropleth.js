var d3 = require('d3')

var formatNumber = d3.format(",f")
var bodyNode = d3.select('body').node()

var Choropleth = function(json, options) {
  var container = options.container || 'body'
  var projection = options.projection
  var w = options.width || 960
  var h = options.height || 600
  var colorScale = options.colorScale
  var colors = options.colors
  var path = options.path
  var tooltip

  var svg = d3.select(container)
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  svg.selectAll('path')
    .attr('class', 'province')
    .data(json.features)
    .enter()
    .append('path')
    .attr('d', path)
    .style('fill', function(d) {
      var total = d.properties.total
      if (total) {
        return colorScale(total)
      } else {
        return '#ccc'
      }
    })
    .on('mouseover', function(d) {
      d3.select('body').selectAll('div.tooltip').remove()
      tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
    })
    .on('mousemove', function(d) {
      d3.select(this).transition().duration(300).style('opacity', 1)
      tooltip.transition().duration(300)
        .style('opacity', 1)

      var absoluteMousePos = d3.mouse(bodyNode)
      tooltip.text(d.properties.name + ' : ' + d.properties.total)
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
      return formatNumber(colorScale.invertExtent(d)[0])  + ' - ' + formatNumber(colorScale.invertExtent(d)[1])
    })
}

module.exports = Choropleth