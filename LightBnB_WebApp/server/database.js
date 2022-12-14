require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;
  const values = [`${email}`];
  return pool
    .query(query, values)
    .then((result) => {
      const user = result.rows[0];

      if (!result.rows.length) {
        console.log("No user found with that email");
        return null;
      }
      return user;
    })
    .catch((err) => {
      console.log(err.message);
    });
  
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const query = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;
  const values = [`${id}`];
  return pool
    .query(query, values)
    .then((result) => {
      const user = result.rows[0];

      if (!result.rows.length) {
        console.log("No user found with that id");
        return null;
      }
      return user;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [`${user["name"]}`, `${user["email"]}`, `${user["password"]}`];
  return pool
    .query(query, values)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query = `
    SELECT reservations.*, properties.*
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;
  `;
  const values = [guest_id, limit];
  return pool
    .query(query, values)
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {

  // Create empty array to hold query parameters
  const queryParams = [];

  // Start to build query
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // Address WHERE for first filter and use AND for any that follow:
  let filter = `AND`;
  for (const i in queryString) {
    if (i === 0) {
      filter = `WHERE`;
    }
  }

  // If filter by owner
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `${filter} owner_id = $${queryParams.length} `;
  }

  // If filter by city
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `${filter} city LIKE $${queryParams.length} `;
  }

  //if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${filter} cost_per_night >= $${queryParams.length} `;
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${filter} cost_per_night <= $${queryParams.length} `;

  } else if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `${filter} cost_per_night >= $${queryParams.length} `;

  } else if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `${filter} cost_per_night <= $${queryParams.length} `;
  }

  // Add GROUP BY in correct position after where clauses
  queryString += `
  GROUP BY properties.id
  `;

  // If minimum rating, then add HAVING clause after GROUP BY
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(rating) >= $${queryParams.length} `;
  }

  // Add limit to end of query
  queryParams.push(limit);
  queryString += `
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const query = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,number_of_bedrooms, country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;
  const values = [
    `${property["owner_id"]}`,
    `${property["title"]}`,
    `${property["description"]}`,
    `${property["thumbnail_photo_url"]}`,
    `${property["cover_photo_url"]}`,
    `${property["cost_per_night"]}`,
    `${property["parking_spaces"]}`,
    `${property["number_of_bathrooms"]}`,
    `${property["number_of_bedrooms"]}`,
    `${property["country"]}`,
    `${property["street"]}`,
    `${property["city"]}`,
    `${property["province"]}`,
    `${property["post_code"]}`
  ];
  return pool
    .query(query, values)
    .then((result) => {
      console.log(result.row);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
exports.addProperty = addProperty;
