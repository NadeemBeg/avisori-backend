const BookCall = require("../../models/bookCall");

exports.getAppointmentAdvisor = async (req, res) => {
    let upcomming = [];
    let completed = [];
    await BookCall.find({isDelete: false}).populate('userId','firstName lastName email').populate('categoryId', 'title').exec(async function(err, appointments){
        await appointments.map(async appointment => {
            let appointmentData = {
                id:  appointment._id,
                caseNumber: appointment.caseNumber,
                date: appointment.caseDate,
                time: appointment.caseTime,
                name: appointment.userId.firstName+' '+appointment.userId.lastName,
                area: appointment.categoryId.title,
                note: appointment.note,
                document: 1
            };
            if(appointment.status== 0 ){
               await upcomming.push(appointmentData);
            } else if(appointment.status== 1 ){
               await completed.push(appointmentData);
            }
        });
        let mainResult =  [
            {'upcomingAppointment': upcomming, 'completedAppointment' : completed }
        ];
        res.status(200).json({
            status: 1,
            message: "Get data Successfully.",
            data: mainResult
        });
    });
}

exports.myCases = async (req, res) => {
    let upcomming = [];
    let completed = [];
    await BookCall.find({isDelete: false}).populate('advisorId','firstName lastName email').populate('categoryId', 'title').exec(async function(err, appointments){
        await appointments.map(async appointment => {
            let appointmentData = {
                id:  appointment._id,
                caseNumber: appointment.caseNumber,
                date: appointment.caseDate,
                time: appointment.caseTime,
                advisorName: appointment.advisorId.firstName+' '+appointment.advisorId.lastName,
                note: appointment.note,
                area: appointment.categoryId.title
            };
            if(appointment.status== 0 ){
               await upcomming.push(appointmentData);
            } else if(appointment.status== 1 ){
               await completed.push(appointmentData);
            }
        });
        let mainResult =  [
            {'openCases': upcomming, 'closeCases' : completed }
        ];
        res.status(200).json({
            status: 1,
            message: "list cases Successfully.",
            data: mainResult
        });
    });
}

exports.updateNote = async (req, res) => {
// console.log(req.body);
    const {bookId,note} = req.body; // for get value in request 
    BookCall
    .updateOne({_id:bookId}, {note}) // for update
    .exec((error, data) => {
        if(error)
        {
            res.status(400).json({
                status: 0,
                message: "Enable to update",
                error
            })
        }
        res.status(201).json({
            status: 1,
            message: 'updated sucessfully',
        })
    })
}