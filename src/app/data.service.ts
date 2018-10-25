import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Item} from './model';

@Injectable({providedIn: 'root'})
export class DataService {


  constructor(private http: HttpClient) {
  }

  dataUrl = 'assets/data.json';

  getData() {
    return this.http.get<Item[]>(this.dataUrl);
  }

}
