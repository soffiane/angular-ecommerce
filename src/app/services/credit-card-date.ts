import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../model/country';
import { State } from '../model/state';

@Injectable({
  providedIn: 'root'
})
export class CreditCardDate {

  private contriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.contriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCardExpiryMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];
    //les 12 mois de l'année
    for (let month = startMonth; month <= 12; month++) {
      months.push(month);
    }
    //on renvoie un observable de la liste des mois
    return of(months);
  }

  getCreditCardExpiryYears(): Observable<number[]> {
    let years: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    //l'année en cours + les 10 années suivantes
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return of(years);
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
