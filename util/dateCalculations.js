const getPreviousDay=(dataString)=> {
    let date = new Date(dataString);
    date.setDate(date.getDate() - 1);
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const isDateInPast=(pastDate)=>{
    const date=new Date(pastDate)
    return date < Date.now()
}

const extractDayNumberAndTime=(appointmentDate)=>{
    let date={}
    const day=appointmentDate.slice(0,10);
    const time=appointmentDate.slice(11,16);
    date={
        day,
        time
    }
    return date
}

const getDayNameByDayHistory=(dateString)=>{
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

const getDayNumberBydayName=(dayName)=>{
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = daysOfWeek.indexOf(dayName);
    if (dayIndex === -1) {
        throw new Error(`Invalid day name: ${dayName}`);
    }
    return dayIndex;

}

const getNextDayApperance=(dataString,dayName)=>{
    const dayOfWeek=getDayNumberBydayName(dayName);
    const currentDate = new Date(dataString);
    const targetDay = (dayOfWeek + 7 - currentDate.getDay()) % 7+1;
    const nextDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + targetDay);
    const dayHistory = `${nextDay.getFullYear()}-${nextDay.getMonth() + 1}-${nextDay.getDate()}`;
    return dayHistory;
}

const getUpcomingDatesForMonth=(dayName)=>{
    let upcomingDays=[]
    let today=new Date();
    for(let i=0;i<4;i++){
        today=getNextDayApperance(today,dayName);
        // today=getPreviousDay(today);
        upcomingDays.push(today);
    }
    for (let i=0;i<4;i++){
        upcomingDays[i]=getPreviousDay(upcomingDays[i]);
    }
    return upcomingDays
}

module.exports={
    isDateInPast,
    extractDayNumberAndTime,
    getDayNameByDayHistory,
    getNextDayApperance,
    getUpcomingDatesForMonth,
}