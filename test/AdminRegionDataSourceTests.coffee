_ = require 'lodash'
assert = require('chai').assert

AdminRegionDataSource = require '../src/AdminRegionDataSource'

describe 'AdminRegionDataSource', ->
  before ->
    @dataSource = new AdminRegionDataSource("https://api.mwater.co/v3/")

  it "gets countries and then one in particular", (done) ->
    @dataSource.getSubAdminRegions null, 0, (error, items) =>
      assert not error

      canada = _.findWhere(items, { name: "Canada" })
      assert.equal canada.level, 0
      assert.equal canada.type, "Country"

      @dataSource.getSubAdminRegions canada.id, 1, (error, items) =>
        assert not error

        manitoba = _.findWhere(items, { name: "Manitoba" })
        assert.equal manitoba.level, 1
        assert.equal manitoba.type, "Province"

        # Get item
        @dataSource.getAdminRegionPath manitoba.id, (error, path) =>
          assert not error

          assert.equal path.length, 2
          assert.equal path[0].name, "Canada"
          assert.equal path[1].name, "Manitoba"

          done()

  it "finds point by lat lng", (done) ->
    @dataSource.findAdminRegionByLatLng 49.8844000, -97.1470400, (error, id) =>
      assert not error

      @dataSource.getAdminRegionPath id, (error, path) =>
        assert not error

        assert.equal path[1].name, "Manitoba"

        done()

