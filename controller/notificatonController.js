const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const jwt = require("jsonwebtoken");
const config = require("config");
const { default: mongoose } = require("mongoose");
const { not } = require("ajv/dist/compile/codegen");
const { getCiphers } = require("crypto");
const jwtSCRT = config.get("env_var.jwtScreteKey");

const getAllPatientNotification = async (req, res) => {
    try {
        const tokenPayload = jwt.verify(req.header("x-auth-token"), jwtSCRT);

        const appointments = await Appointment.find({
            patient: tokenPayload.userId,
        })
            .populate({
                path: "clinick",
                select: "-reservedDates -openDates",
                populate: {
                    path: "doctor",
                    select: "name",
                },
            })
            .exec();

        // setting customResponse
        //test---------------------------------
        // console.log(appointments.map((appointment)=>{
        //     return appointment.appointmentDate
        // }))
        // const notifications=await Notification.findOne({appointmentId:appointment._id}).exec();
        // console.log(customResponseList)
        // console.log(customResponseList.length)
        //test---------------------------------
        const customResponseList = await getNotificationByAppointmentId(
            appointments
        );

        if (customResponseList.length == 0) {
            return res.status(204).json({ message: "no notification" });
        }
        res.status(200).json(customResponseList);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addNotification = async (appointmentId) => {
    try {
        let notification = new Notification({
            appointmentId,
            typeOfNotification: "NEW",
        });
        await notification.save();
        console.log("Notification added successfully", notification);
    } catch (err) {
        console.log(err);
    }
};

const deleteNotification = async (req, res) => {
    try {
        //id validation
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid clinic id" });
        }

        const notification = await Notification.findByIdAndDelete(
            req.params.id
        ).exec();
        if (!notification) {
            return res.status(400).json({ message: "Bad request" });
        }
        res.status(200).json({
            message: "Clinick was deleted successfully",
            notification,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    // getAllDoctorNotification,
    getAllPatientNotification,
    addNotification,
    deleteNotification,
};

const getNotificationByAppointmentId = async (appointments) => {
    let customResponseList = [];
    let customResponse = {};
    for (let i = 0; i < appointments.length; i++) {
        //test-----------------------------
        // console.log(appointment)
        //test-----------------------------
        const notification = await Notification.findOne({
            appointmentId: appointments[i]._id,
        }).exec();
        customResponse.clinicName = appointments[i].clinick.clinicName;
        customResponse.doctorName = appointments[i].clinick.doctor.name;
        customResponse.sepcialization = appointments[i].clinick.specialization;
        customResponse.appointmentDate = appointments[i].appointmentDate;
        customResponse.bookingTime = appointments[i].bookingTime;
        customResponse.typeOfNotification = notification.typeOfNotification;
        customResponseList.push(customResponse);
        customResponse = {};
    }
    return customResponseList;
};
