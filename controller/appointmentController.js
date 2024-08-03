const Appointment = require('../models/appointmentModel');
const Notification = require('../controller/notificatonController');
const Clinic = require('../models/clinickModule');
const ReservedDate = require('../models/reservedDatesModel');
const dateCalc = require('../util/dateCalculations');

const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { log } = require('console');
const jwtSCRT = config.get('env_var.jwtScreteKey');

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate({
        path: 'patinet',
        select: 'name',
      })
      .populate({
        path: 'clinick',
        select: 'location',
        populate: {
          path: 'doctor',
          select: 'name ',
        },
      })
      .exec();
    if (appointments.length == 0) {
      return res.status(204).json({ message: 'you have no appointments' });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPatientAppointments = async (req, res) => {
  const tokenPayload = jwt.verify(req.header('x-auth-token'), jwtSCRT);
  try {
    const appointments = await Appointment.find({
      patient: tokenPayload.userId,
    })
      .populate({
        path: 'patient',
      })
      .populate({
        path: 'clinick',
        select: '-openDates -reservedDates',
        populate: {
          path: 'doctor',
          select: 'name ',
        },
      })
      .exec();
    if (appointments.length == 0) {
      return res.status(204).json({ message: 'you have no appointments' });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllClinickAppointmentsByClinickId = async (req, res) => {
  try {
    //id validation
    const clinic = await Clinic.findById(req.params.clinicId).exec();
    if (!clinic) {
      return res.status(400).json({ message: 'invalid clinic id' });
    }

    const appointments = await Appointment.find({
      clinick: req.params.clinicId,
    })
      .populate({
        path: 'patient',
        select: 'name',
      })
      .populate({
        path: 'clinick',
        select: '-reservedDates -openDates',
        populate: {
          path: 'doctor',
          select: 'name',
        },
      })
      .exec();
    if (appointments.length == 0) {
      return res.status(204).json({ message: 'No appointments was added yet' });
    }
    res.status(200).json(appointments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getAppointmentById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate({
        path: 'patient',
      })
      .populate({
        path: 'clinick',
        select: '-reservedDates -openDates',
        populate: {
          path: 'doctor',
          select: 'name',
        },
      })
      .exec();
    if (!appointment) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addAppointment = async (req, res) => {
  try {
    const tokenPayload = jwt.verify(req.header('x-auth-token'), jwtSCRT);
    const { clinick, appointmentDate, bookingTime, status } = req.body;
    const clinic = await Clinic.findById(clinick).exec();
    if (!clinic) {
      return res.status(400).json({ message: 'invalid clinic ID' });
    }

    let appointment = new Appointment({
      patient: tokenPayload.userId,
      clinick,
      appointmentDate,
      bookingTime,
      status,
    });
    await appointment.save();

    await UpdateAppointmentDate(true, appointment._id);

    await Notification.addNotification(appointment._id);

    res.status(200).json({
      message: 'appointment was saved successfully',
      appointment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAppointmentByPatient = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    const { patient, clinick, appointmentDate, bookingTime, status } = req.body;
    const clinic = await Clinic.findById(clinick).exec();
    if (!clinic) {
      return res.status(400).json({ message: 'invalid clinic id' });
    }

    await UpdateAppointmentDate(false, req.params.appointmentId);

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      {
        patient,
        clinick,
        appointmentDate,
        bookingTime,
        status,
      },
      { returnOriginal: false }
    ).exec();
    if (!appointment) {
      return res.status(400).json({ message: 'Bad request' });
    }
    if (appointment.status === 'CANCELED') {
      await UpdateAppointmentDate(false, appointment._id);
    } else {
      await UpdateAppointmentDate(true, appointment._id);
    }
    res.status(200).json({ message: 'updated successfully', appointment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAppointmentByClinick = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    const { report, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      {
        report,
        status,
      },
      { returnOriginal: false }
    ).exec();

    if (!appointment) {
      return res.status(400).json({ message: 'Bad request' });
    }

    res.status(200).json({ message: 'updated successfully', appointment });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deleteAppointment = async (req, res) => {
  try {
    //id validation
    if (!mongoose.isValidObjectId(req.params.appointmentId)) {
      return res.status(400).json({ message: 'Invalid appointment id' });
    }

    await UpdateAppointmentDate(false, req.params.appointmentId);

    const appointment = await Appointment.findByIdAndDelete(
      req.params.appointmentId
    ).exec();
    if (!appointment) {
      return res.status(400).json({ message: 'Bad request' });
    }
    res.status(200).json({
      message: 'appointment was deleted successfully',
      appointment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllAppointments,
  getAllClinickAppointmentsByClinickId,
  getAllPatientAppointments,
  getAppointmentById,
  addAppointment,
  updateAppointmentByClinick,
  updateAppointmentByPatient,
  deleteAppointment,
};

const UpdateAppointmentDate = async (flag, appointmentId) => {
  const appointment = await Appointment.findById(appointmentId).exec();

  //get the day and time of the appointment
  const { day, time } = dateCalc.extractDayNumberAndTime(
    appointment.appointmentDate
  );

  //get the clinic which the appointment is in
  const clkTime = await Clinic.findById(appointment.clinick).exec();

  //get the time which the appointment is signed to in the clinic
  const idxOfTime = clkTime.openDates.time.indexOf(time);
  //get the reserved dates to update it
  const resDate = await ReservedDate.findOne({
    clinicId: appointment.clinick,
    day,
  }).exec();
  
  const timeUpdated = resDate?.time;
  log('timeUpdated', timeUpdated,resDate,appointment.clinick,day,time);
  //set the reserved dates to the flag
  timeUpdated[idxOfTime] = flag;

  //update the reserved dates of the clinic
  const reservedDate = await ReservedDate.findOneAndUpdate(
    { clinicId: appointment.clinick, day },
    {
      time: timeUpdated,
    }
  ).exec();
  //test-------------------
  console.log('Update', appointment, 'to be', flag);
};
