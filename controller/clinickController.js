const Clinick = require('../models/clinickModule');
const ResDates = require('../models/reservedDatesModel');
const Appointment = require('../models/appointmentModel');
const dateCalc = require('../util/dateCalculations');

const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const config = require('config');
const { default: mongoose } = require('mongoose');
// const { time } = require('console');
const jwtSCRT = config.get('env_var.jwtScreteKey');

// with doctorId as params
const getAllClinic=async(req,res)=>{
    try{
        let clinics=await Clinic.find({doctor:req.params.doctorId}).exec();
        if(clinics.length==0){
            return res.status(200).json({message:"No clinic was added yet"});
        }
        res.status(200).json({clinics});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error"});
    }
}

//with doctorId from jwt
const getAllClinicks = async (req, res) => {
  try {
    //replcable with /:id of the user
    const tokenPayload = jwt.verify(req.header('x-auth-token'), jwtSCRT);
    if (tokenPayload.userType.toUpperCase() === 'DOCTOR') {
      let clinicks = await Clinick.find({ doctor: tokenPayload.userId })
        .select(' -doctor -reservedDates')
        .exec();
      if (clinicks.length == 0) {
        return res.status(204).json({ message: 'No clinick was added yet' });
      }
      res.status(200).json(clinicks);
    } else {
      return res.status(401).json({ message: 'UNAUTHORIZED ACTION' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getClinickById = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid clinic id' });
    }

    // const clinicBefore = await Clinick.findById(req.params.id);

    // const resDate = await ResDates.find({ clinicId: req.params.id })
    //   .select('-_id day time')
    //   .exec();

    // console.log(resDate);

    // const clkReservedDates = await Clinick.findByIdAndUpdate(req.params.id, {
    //   reservedDates: resDate,
    // }).exec();

    const clinick = await Clinick.findById(req.params.id)
      .populate({
        path: 'doctor',
        select: 'name',
      })
      // .select("-_id -__v")
      .exec();
    if (!clinick) {
      return res.status(400).json({ message: 'Bad request' });
    }

    clinick.reservedDates = await createReservedDatesRecord(
      clinick._id,
      clinick.openDates
    );

    res.status(200).json(clinick);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addClinick = async (req, res) => {
  try {
    //replcable with /:id of the user
    const tokenPayload = jwt.verify(req.header('x-auth-token'), jwtSCRT);

    const {
      phone,
      clinicName,
      location,
      specialization,
      price,
      openDates,
      rating,
      about,
    } = req.body;

    let clinick = new Clinick({
      doctor: tokenPayload.userId,
      clinicName,
      phone,
      location,
      specialization,
      price,
      openDates,
      rating,
      about,
    });
    await clinick.save();
    // await createReservedDatesRecord(clinick._id, clinick.openDates);

    res.status(200).json(clinick);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateClinick = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid clinic id' });
    }
    const { phone, location, specialization, price, openDates } = req.body;

    const clinick = await Clinick.findByIdAndUpdate(
      req.params.id,
      {
        phone,
        location,
        specialization,
        price,
        openDates,
      },
      { returnOriginal: false }
    ).exec();
    if (!clinick) {
      return res.status(400).send('Bad reqest');
    }
    res.status(200).json(clinick);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deletClinick = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid clinic id' });
    }

    const clinick = await Clinick.findByIdAndDelete(req.params.id).exec();
    if (!clinick) {
      return res.status(400).json({ message: 'Bad request' });
    }
    res.status(200).json({
      message: 'Clinick was deleted successfully',
      clinick,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllClinicks,
  getClinickById,
  addClinick,
  updateClinick,
  deletClinick,
};

const createReservedDatesRecord = async (clinicId, dates) => {
  const { days, time } = dates;
  //test--------
  console.log(days, time);
  //-------------------------------

  const appointments = await Appointment.find({ clinicId }).exec();

  let times = time.map((time) => {
    let isReserved = false;
    appointments.forEach((appointment) => {
      appointment.time = appointment.appointmentDate.split(' ')[1];
      if (
        appointment.status == 'PENDING' ||
        appointment.status == 'COMPLETED'
      ) {
        if (appointment.time == time) {
          isReserved = true;
        }
      }
    });
    return isReserved;
  });

  let upcomingDays = [];
  days.forEach((day) => {
    upcomingDays.push(
      dateCalc.getUpcomingDatesForNUmberOfWeeks(5, day.toLowerCase())
    );
  });
  //test-----------------
  console.log(upcomingDays);
  //----------------------------
  let datesRecord = [];
  upcomingDays.forEach(async (days) => {
    days.forEach(async (day) => {
      datesRecord.push({
        clinicId,
        day,
        time: times,
      });
      // await datesRecord.save();
      console.log('Dates Saved successfully');
    });
  });

  return datesRecord;
};

//This function will check for all dates that have been passed,
//clean the db and update with the new date
// async function updateReservedDatesRecord() {
//   // const today = new Date().toISOString().substring(0, 10);
//   // const today = new Date().toISOString().substring(0, 10);
//   //tracing the week offset issue
//   const cairoTimezone = 'Africa/Cairo';
//   const today = moment().tz(cairoTimezone).format('YYYY-MM-DD');
//   console.log(today);

//   const passedDates = await ResDates.find({
//     day: { $lt: today },
//   });

//   // console.log(passedDates.day,'passedDates')

//   if (!passedDates.length == 0) {
//     passedDates.forEach(async (date) => {
//       console.log(date.day, 'date');
//       const day = date.day;
//       //get the time array in falsey values
//       const falsytime = date.time.map((time) => {
//         return false;
//       });
//       //get the day name
//       const dayName = dateCalc.getDayNameByDayHistory(day);
//       //get the day in the next month
//       const replaceDate = dateCalc.getUpcomingDatesForNUmberOfWeeks(
//         6,
//         dayName.toLowerCase()
//       )[5];

//       await ResDates.create({
//         clinicId: date.clinicId,
//         day: replaceDate,
//         time: falsytime,
//       });
//       // console.log("Date created successfully", .day);
//     });
//     await ResDates.deleteMany({
//       day: { $lt: today },
//     });
//     // console.log("Date deleted successfully", oldDateRecord);
//   } else {
//     console.log('no dates is passed', passedDates);
//   }

//   setTimeout(updateReservedDatesRecord, 24 * 60 * 60 * 1000);
// }

// updateReservedDatesRecord();
