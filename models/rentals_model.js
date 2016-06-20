var app = require("../app");
var db = app.get("db");

var Rental = function(movie_id, customer_id, created_date, due_date, returned = false, returned_date = null) {
  this.movie_id = movie_id;
  this.customer_id = customer_id;
  this.created_date = created_date;
  this.due_date = due_date;
  this.returned = returned;
  this.returned_date = returned_date;

};

Rental.getCheckedOut = function(title, callback) {
  // Not sure if this would return in an array or if we'd have to convert it to an array
  db.rentals.where("title=$1 AND returned=$2", [title, false], function(error, checked_out) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, checked_out);
    }
  })
}

Rental.getCurrentRentals = function(customer_id, callback) {
  db.rentals.where("customer_id=$1 AND returned=$2", [customer_id, false], function(error, checked_out) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, checked_out);
    }
  })
}

Rental.getPastRentals = function(customer_id, callback) {
  db.run("SELECT customer_id, created_date, movie_id, returned_date FROM rentals WHERE customer_id=$1 AND returned=$2 ORDER BY returned_date ASC", [customer_id, true], function(error, past_rentals) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, past_rentals);
    }
  })
}

Rental.getCustomers = function(movie_title, callback) {
  db.run("SELECT * FROM customers WHERE id=(SELECT customer_id FROM rentals WHERE movie_id=(SELECT id FROM movies WHERE title=$1) AND returned=false)", [movie_title], function(error, customers) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, customers);
    }
  })
}

Rental.getOverdue = function(callback) {
  var now = new Date().toISOString().split('T')[0];
  db.rentals.where("returned=$1 AND due_date<$2", [false, now], function(error, overdue) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, overdue);
    }
  })
}

Rental.prototype.getCheckout = function(movie_title, customer_id, callback) {
  var movie_id = db.run("SELECT id FROM movies WHERE title = movie_title")
  var created_date = new Date().toISOString().split('T')[0];
  var due_date = created_date.setDate(created_date.getDate()+7);

  var rental = Rental.new(movie_id, customer_id, created_date, due_date)

}


module.exports = Rental;
