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
  var now = new Date();
  console.log(now)
  db.run("SELECT * FROM rentals WHERE returned=false AND due_date<?", function (error, overdues) {
    if (error) {
      callback(error, undefined);
    }
    console.log(overdues);  
    callback(null, overdues);
    

        // remove money from account
    //   db.run("UPDATE customers SET account_credit=account_credit-2.0 WHERE id=$1;", [id], function (error, movie_id = movie, account_balance_update) {
    //     if (error) {
    //       return callback(error);
    //     }

    //   // set date vars
    //   var now = new Date();
    //   var due = new Date(now);
    //   due.setDate(due.getDate() + 7);

    //   // save new rental (nested inside find)
    //   db.rentals.save({
    //     movie_id: movie_id.id,
    //     customer_id: id,
    //     created_date: now,
    //     due_date: due,
    //     returned: false
    //     // callback with rental info
    //   }, function (error, rental) {
    //     if (error) {
    //       return callback(error);
    //     }
    //     // pass rental back to controller
    //     return callback(null, rental);
    //   });
    // });
  });
}

Rental.getReturn = function(rental_id, callback) {
  db.rentals.update({
    id: rental_id,
    returned: true,
    returned_date: new Date()
    }, function(error, checked_out) {
    if(error) {
      callback(error, undefined);
    } else {
      callback(null, checked_out);
    }
  })
}

Rental.getCheckout = function(movie_title, id, callback) {
    // get movie id from movie table by title
  db.movies.findOne({
    title: movie_title
    // call back with movie id
  }, function (error, movie) {
    if (error) {
      return callback(error);
    } else if (!movie) {
      return callback(new Error("Movie not found"));
    }

        // remove money from account
      db.run("UPDATE customers SET account_credit=account_credit-2.0 WHERE id=$1;", [id], function (error, movie_id = movie, account_balance_update) {
        if (error) {
          return callback(error);
        }

      // set date vars
      var now = new Date();
      var due = new Date(now);
      due.setDate(due.getDate() + 7);

      // save new rental (nested inside find)
      db.rentals.save({
        movie_id: movie_id.id,
        customer_id: id,
        created_date: now,
        due_date: due,
        returned: false
        // callback with rental info
      }, function (error, rental) {
        if (error) {
          return callback(error);
        }
        // pass rental back to controller
        return callback(null, rental);
      });
    });
  });
}

module.exports = Rental;
