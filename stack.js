var d3 = require('d3')

var Stack = function(dataset, options) {

  var w = options.width || 960
  var h = options.height || 600
  var container = options.container || 'body'
  var colors = options.colors || d3.scale.category10()

  var stack = d3.layout.stack()
  stack(dataset)

  var xScale = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y
      })
    })])
    .range([0, h])

  var yScale = d3.scale.ordinal()
    .domain(d3.range(dataset[0].length))
    .rangeRoundBands([0, w], 0.05)

  var svg = d3.select(container)
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  var groups = svg.selectAll('g')
    .data(dataset)
    .enter()
    .append('g')
    .style('fill', function(d, i) {
      return colors(i)
    })

  var rects = groups.selectAll('rect')
    .data(function(d) { return d })
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return yScale(i)
    })
    .attr('y', function(d) {
      return xScale(d.y0)
    })
    .attr('height', function(d) {
      return xScale(d.y)
    })
    .attr('width', yScale.rangeBand())
}

module.exports = Stack