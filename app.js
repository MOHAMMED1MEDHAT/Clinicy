require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const express = require('express');
const authJwt = require('./util/jwt');
// const dateCalc = require("./util/dateCalculations");
const errorHandler = require('./middleware/errorHandlerMw');
const app = express();

//test---------------
// console.log(dateCalc.getNextDayApperance("2023-05-2","monday"));
// console.log(dateCalc.isDateInPast("2023-04-25"));
// console.log(dateCalc.getUpcomingDatesForNUmberOfWeeks(5,dateCalc.getDayNameByDayHistory("2023-04-28"))[3]);
// const moment = require('moment-timezone');
// const cairoTimezone = 'Africa/Cairo';
// const currentDate = moment().tz(cairoTimezone).format('YYYY-MM-DD');
// console.log(currentDate);
// let today=new Date().toISOString().substring(0,10);
// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const EgyTimeZone='Africa/Cairo';
// const todayAtEgypt=today.toLocaleString("en-US",{timeZone:timezone});
// console.log(timezone);
// console.log(todayAtEgypt)
// const data={
//     days:[
//         "Monday",
//         "sunday",
//         "friday"
//     ],
//     time:[
//         "12:30",
//         "1:30",
//         "2:30",
//         "3:30"
//     ]
// }
// console.log(JSON.stringify(data));
//test-------------------

process.on('uncaughtException', (exception) => {
  console.log('uncaught Exception' + exception);
});
process.on('unhandledRejection', (exception) => {
  console.log('uncaught async Exception' + exception);
});

mongoose
  .connect(process.env.ATLAS_CONNECTION_STRING, {
    // .connect(process.env.LOCAL_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'clinicky',
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => console.log('error occured' + err));

//adding a CSP to secure from XSS
// app.use(helmet.contentSecurityPolicy({
// }));
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', "default-src 'self'");
//     next();
// });

//for testing the server
app.get('/api/v1/monitor', (req, res) => {
  res.status(200).end();
});

//middlewares
app.use(cors());
app.options('*', cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const searchRouter = require('./routes/search');
const profileRouter = require('./routes/profile');
const notificationRouter = require('./routes/notification');
// const mainPageRouter=require("./routes/mainpage")
const appointmentRouter = require('./routes/appointment');
const clinickRouter = require('./routes/clinick');

app.use('/api/user/signup', userRouter); //test done
app.use('/api/user', authRouter); //test done
app.use('/api/search', searchRouter); //test done
app.use('/api/profile', profileRouter); //test done
// app.use("/api/mainPage",mainPageRouter);
app.use('/api/appointments', appointmentRouter); // test done
app.use('/api/clinicks', clinickRouter); //test done
app.use('/api/notification', notificationRouter); //test done

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening ....!!! on port:${port}`);
});

/*TODO:
1- secure the api using the express jwt package and the jwt helper module --->(Done)
2- patient id in the clinic recored must be checked to be a patient or a doctoer ---> (Done)
3- Special clinics Adding for employees 
*/
