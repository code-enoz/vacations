import Vacation from "../models/vacation"
import moment from 'moment'

export default class VacationUtils  {
public static getVacationIndex(compState: any, vacation : Vacation){
    let index = compState.vacations.map(function (vacationToFind : Vacation) {
        return vacationToFind.id;
    }).indexOf(vacation.id);
    return index;
}

public static fixDateFormat(date: string) {
    return moment(date, "YYYY-MM-DD").format("DD/MM/YYYY");
 }
}
