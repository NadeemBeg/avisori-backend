require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


//My routes
const getIntroData = require("./routes/getIntroData");
const addMoreInfo = require("./routes/addMoreInfo");
const signIn = require("./routes/signIn");
const cardDetail = require("./routes/cardDetail");
const category = require("./routes/category");
const message = require("./routes/message"); 
const faq = require("./routes/faq");
const appointment = require("./routes/appointment");
const home = require("./routes/home");
const country = require("./routes/country");
const bookCall = require("./routes/bookCall");
const availability = require("./routes/availability");
const uploadDocument = require("./routes/uploadDocument");
const company = require("./routes/company");
const cms = require("./routes/cms");
const manageDocument = require("./routes/manageDocument");
const ContactRoutes = require('./routes/contactsUs');
const appointmentAdminRoutes = require('./routes/admin/appointment');
const userAdminRoutes = require('./routes/admin/user');
const companyAdminRoutes = require('./routes/admin/company');
const documentAdminRoutes = require('./routes/admin/document');
const languageAdminRoutes = require('./routes/admin/language');
const subCategoryAdminRoutes = require('./routes/admin/subCategory');
const availablityAdminRoutes = require('./routes/admin/availablity');
const advisorTypeAdminRoutes = require('./routes/admin/advisorType');
const bankIdRoute = require('./cert/bank'); 
//DB Connection mongoose.createConnection()

//DB Connection

mongoose
  .connect("mongodb+srv://nadeem_beg:%23JsDepart@cluster0.49igw.mongodb.net/avisori-backend?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    createIndex:true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(cors());
// app.use(basicAuth);
function auth(req, res, next){
  console.log("req.path",req.path);
  var a = (req.path).toString();
  if (a.indexOf('/uploads/') > -1) {
    console.log("true");
    return next();
  } else {
    console.log("false");
  }
  var authHearder =  req.headers.authorization;
  console.log("authHearder11111",authHearder);
  if(!authHearder){
    var err = new Error("You are not authenticated!");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status =401;
    return next(err);
  }
  var auth = new Buffer(authHearder.split(' ')[1], 'base64').toString().split(':');
  var userName = auth[0];
  var password = auth[1];
  if(userName === "avisori" && password ==="avisori"){
    console.log("YES");
    next();
  }
  else{
    var err = new Error("You are not authenticated!");
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status =401;
    return next(err);
  }
}
// app.use(auth);

// static urls 

// manage docs
app.use('/docs', express.static('./uploads/manageDocuments'));
app.use('/profile', express.static('./uploads/profilePics'));
app.use('/companyLogo', express.static('./uploads/companyLogo'));

//My Routes
app.use("/api", getIntroData);
app.use("/api", addMoreInfo);
app.use("/api", signIn);
app.use("/api", cardDetail);
app.use("/api", category);
app.use("/api", message);
app.use("/api", faq);
app.use("/api", appointment);
app.use("/api", home);
app.use("/api", country);
app.use("/api", bookCall);
app.use("/api", availability);
app.use("/api", uploadDocument);
app.use("/api", company);
app.use("/api", cms);
app.use("/api", manageDocument);
app.use("/api", ContactRoutes);
app.use('/api', bankIdRoute);
app.use('/uploads/images', express.static('uploads/images'));
app.use('/uploads/documents', express.static('uploads/documents')); 

// admin routes
app.use('/admin/api/',appointmentAdminRoutes);
app.use('/admin/api/',userAdminRoutes);
app.use('/admin/api/',documentAdminRoutes);
app.use('/admin/api/',companyAdminRoutes);
app.use('/admin/api/',languageAdminRoutes);
app.use('/admin/api/',subCategoryAdminRoutes);
app.use('/admin/api/',availablityAdminRoutes);
app.use('/admin/api/',advisorTypeAdminRoutes);

// app.use(express.static('image'));

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(process.env.PORT || 8000, () => {
  console.log(`app is running at`,port);
});
