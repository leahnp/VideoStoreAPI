var app = require("../../app");
var db = app.get("db");
var Customer = require('../../models/customers_model')



describe('#all', function () {

  it('should return an array of customers', function (done) {
    Customer.all(function (error, data) {
      expect(typeof data).toEqual('object')
      done()
    })
  })
})

describe('#sort', function () {

  it('should return an array of customers', function (done) {
    Customer.sort('name', 10, 2, function (error, data) {
      expect(typeof data).toEqual('object')
      done()
    })
  })

  it('should not sort by invalid column name', function (done) {
    Customer.sort('nemo', 10, 2, function (error, data) {
      expect(typeof data).toBeNull;
      done()
    })
  })
})
