const config = require('./env.json')

const faunadb = require('faunadb')
const q = faunadb.query;
const { Collection, CreateCollection, CreateIndex, Exists, If, Index } = q;
async function setup(faunaDBKey) {
  try {
    const faunadbClient = new faunadb.Client({ secret: faunaDBKey, keepAlive: true });
    await faunadbClient.query(If(Exists(Collection('users')), true, CreateCollection({ name: 'users' })));
    console.log('"users" collection created.')
    await faunadbClient.query(If(Exists(Collection('follows')), true, CreateCollection({ name: 'follows' })));
    console.log('"follows" collection created.')
    await faunadbClient.query(If(Exists(Index('follows_index')), true,
      CreateIndex(
        {
          name: 'follows_index',
          source: Collection('follows'),
          terms: [
            {
              field: ['data', 'from']
            },
            {
              field: ['data', 'to']
            }
          ],

          unique: true,

        }
      )));
    console.log('"follows_index" index created.');

    await faunadbClient.query(If(Exists(Index('followee_ref_by_follower_index')), true,
      CreateIndex(
        {
          name: 'followee_ref_by_follower_index',
          source: Collection('follows'),
          terms: [
            {
              field: ['data', 'to']
            }
          ],
          values: [
            {
              field: ['data', 'from']
            }
          ],
        }
      )));
    console.log('"followee_ref_by_follower_index" index created.');


    await faunadbClient.query(If(Exists(Index('follow_record_by_followee_index')), true,
      CreateIndex(
        {
          name: 'follow_record_by_followee_index',
          source: Collection('follows'),
          terms: [
            {
              field: ['data', 'to']
            }
          ],
        }
      )));
    console.log('"follow_record_by_followee_index" index created.');

    await faunadbClient.query(If(Exists(Index('follow_record_by_follower_index')), true,
      CreateIndex(
        {
          name: 'follow_record_by_follower_index',
          source: Collection('follows'),
          terms: [
            {
              field: ['data', 'from']
            }
          ],
        }
      )));
    console.log('"follow_record_by_follower_index" index created.');
  } catch (error) {
    console.error(error)
  }

}

setup(config.FAUNADB_SECRET_KEY).then(() => console.log('finished'))