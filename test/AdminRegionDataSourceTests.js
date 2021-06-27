// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// No longer used!
// _ = require 'lodash'
// assert = require('chai').assert

// AdminRegionDataSource = require '../src/AdminRegionDataSource'

// describe 'AdminRegionDataSource', ->
//   @timeout(10000)
  
//   before ->
//     @dataSource = new AdminRegionDataSource("https://api.mwater.co/v3/")
//   it "gets countries and then one in particular", (done) ->
//     @dataSource.getSubAdminRegions null, 0, (error, items) =>
//       assert not error, "getSubAdminRegions:" + error?.message

//       canada = _.findWhere(items, { name: "Canada" })
//       assert.equal canada.level, 0
//       assert.equal canada.type, "Country"

//       @dataSource.getSubAdminRegions canada.id, 1, (error, items) =>
//         assert not error, "getSubAdminRegions:" + error?.message

//         manitoba = _.findWhere(items, { name: "Manitoba" })
//         assert.equal manitoba.level, 1
//         assert.equal manitoba.type, "Province"

//         # Get item
//         @dataSource.getAdminRegionPath manitoba.id, (error, path) =>
//           assert not error, "getAdminRegionPath:" + error?.message

//           assert.equal path.length, 2
//           assert.equal path[0].name, "Canada"
//           assert.equal path[1].name, "Manitoba"

//           done()
//     return

//   it "finds point by lat lng", (done) ->
//     @dataSource.findAdminRegionByLatLng 49.8844000, -97.1470400, (error, id) =>
//       assert not error, "findAdminRegionByLatLng:" + error?.message

//       @dataSource.getAdminRegionPath id, (error, path) =>
//         assert not error, "getAdminRegionPath:" + error?.message

//         assert.equal path[1].name, "Manitoba"

//         done()
//     return

