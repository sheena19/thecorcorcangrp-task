import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DataModel, Item, OpenHouse} from './model';
import {Subject} from 'rxjs';
import {google, Marker} from '@agm/core/services/google-maps-types';
import {MapComponent} from './map.component';

@Injectable({providedIn: 'root'})
export class DataService {

  private data: DataModel[] = [];
  private months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Nov.', 'Dec.'];
  private dataUpdated = new Subject();

  constructor(private http: HttpClient) {
  }

  dataUrl = 'assets/data.json';

  getDataUpdatedListener(){
    return this.dataUpdated.asObservable();
  }

  getData(){
    return this.data;
  }

  fetchData() {
    this.http.get<Item[]>(this.dataUrl)
      .subscribe((items: Item[]) => {
        items.forEach(item => {
          const element: DataModel = {
            isSelected: false,
            id: item.Listing.ID,
            address: item.Property.Address.StreetNumber + ' ' + item.Property.Address.StreetName,
            city: item.Property.Address.City,
            transaction: item.Listing.Transaction,
            price: item.Listing.Price,
            openhouses: this.getUpcomingOpenHouse(item.Listing.OpenHouses)
          };
          this.data.push(element);
        });
        this.dataUpdated.next([...this.data]);
      });
  }

  private getUpcomingOpenHouse(openhouses: OpenHouse[]): string {
    let s;
    const nextOpenHouses = [];
    const now = new Date();
    for (let i = 0; i < openhouses.length; i++) {

      const date = openhouses[i].Date.split('/');
      const time = openhouses[i].StartTime.split(':');

      const newDate = new Date(Number(date[2]), Number(date[1]), Number(date[0]), Number(time[0]), Number(time[1]));

      if (newDate >= now) {
        nextOpenHouses.push([newDate, openhouses[i]]);
      }
    }
    nextOpenHouses.sort((x, y) => {
      return x[0] - y[0];
    });
    s = this.months[nextOpenHouses[0][0].getMonth()] + ' ' + this.formatDate(nextOpenHouses[0][0].getDate().toString()) + ' - '
      + this.getHourAMPM(nextOpenHouses[0][1].StartTime) + ' to ' + this.getHourAMPM(nextOpenHouses[0][1].EndTime);

    return s;
  }

  private getHourAMPM(time): string {
    time = time.split(':');
    let hours = parseInt(time[0]);
    const min = time[1];
    if (hours < 12) {
      return hours + ':' + min + ' AM';
    } else {
      hours = hours - 12;
      return hours.toString() + ':' + min.toString() + ' PM';
    }
  }

  private formatDate(date): string {
    switch (date[1]) {
      case '1':
        return date + 'st';
      case '2':
        return date + 'nd';
      case '3':
        return date + 'rd';
      default:
        return date + 'th';
    }
  }

  updateItem(id){
    // console.log(id);
    const updatedData = [];
    this.data.forEach(element=>{
      if(element.id === id){
        element.isSelected = true;
      } else {
        element.isSelected = false;
      }
      updatedData.push(element);
    });
    this.data = updatedData;
    this.dataUpdated.next([...this.data]);
  }

}
