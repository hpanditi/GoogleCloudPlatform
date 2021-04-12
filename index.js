// Imports the Google Cloud client library
const {Spanner} = require('@google-cloud/spanner');

// Instantiates a client
const spanner = new Spanner();

// Your Cloud Spanner instance ID
const instanceId = 'test-instance';

// Your Cloud Spanner database ID
const databaseId = 'example-db';

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.get = async (req, res) => {
  // Gets a reference to a Cloud Spanner instance and database
  const instance = spanner.instance(instanceId);
  const database = instance.database(databaseId);

  // The query to execute
  const query = {
    sql: 'SELECT * FROM Albums',
  };

  // Execute the query
  try {
    const results = await database.run(query);
    const rows = results[0].map(row => row.toJSON());
    rows.forEach(row => {
      res.write(
        `SingerId: ${row.SingerId}, ` +
          `AlbumId: ${row.AlbumId}, ` +
          `AlbumTitle: ${row.AlbumTitle}\n`
      );
    });
    res.status(200).end();
  } catch (err) {
    res.status(500).send(`Error querying Spanner: ${err}`);
  }
};
