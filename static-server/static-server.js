const express = require('express');

module.exports = (app) => {
  // https://www.npmjs.com/package/express-static
  app.use('/web', express.static(`${__dirname}/../../docker/compose/web`));
};
