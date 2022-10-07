const express = require('express');
const colors = require('colors')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')

// @des :: Custom import files
const schema = require('./schema/schema')
const connectDb = require('./config/db')

const PORT = process.env.PORT || 5000;
const app = express();
// connectDb();

// @des :: initilize GraphQl Entry points
app.use('/graphql', graphqlHTTP({
    // schema: DrMamun
    schema,
    graphiql: process.env.NODE_ENV === 'development',
}));

app.listen(PORT, console.log(`Server running on PORT ${PORT}`))

