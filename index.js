const express = require("express");
const dotenv = require("dotenv");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require('moment');




dotenv.config();

database.connect();

const routesAdmin = require("./routes/admin/index.route")
const routesClient = require("./routes/client/index.route");

  
const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))

app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash



app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

routesAdmin(app);
// 404 Not Found
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
  // res.redirect("/");
});

routesClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})