import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

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

  getCountryArray():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountry>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStatesArray(theCountryCode:string):Observable<State[]>{
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseState>(searchUrl).pipe(
      map(response => response._embedded.states)
    );
  }
}

interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}

