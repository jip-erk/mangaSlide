import faunadb from 'faunadb'

const client = new faunadb.Client({
  secret: 'fnAEx2-oyTAAzSs9w34ZxhgcHaF92wHc74N_1QZs',
  domain: 'db.eu.fauna.com',
})
// console.log(process.env.FAUNA_SECRET_KEY)
const q = faunadb.query
export { client, q }
