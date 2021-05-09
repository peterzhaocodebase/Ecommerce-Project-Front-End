import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopulateDateService {

  constructor() { }

  getMonthsArray(sMonth:number):Observable<number[]>{
   
    let monthsArray:number[] = [];

    for(sMonth; sMonth<=12; sMonth++){
      monthsArray.push(sMonth);
    }
   
    return of(monthsArray);
  }
  getYearsArray():Observable<number[]>{
   
    let year:number = new Date().getFullYear();
    let yearsArray:number[] = [];
    let maxYear = year+10;
    for(year; year<=maxYear; year++){
      yearsArray.push(year);
    }
   
    return of(yearsArray);
  }
}

