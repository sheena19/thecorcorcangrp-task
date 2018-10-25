import {DataService} from './data.service';
import {Item, OpenHouse} from './model';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-data',
  template: '<mat-card *ngFor="let item of data" style="width: 400px; margin: 5px auto;" id={{item.id}}>\n' +
    '    <div>\n' +
    '      <p class="address">{{item.address}}</p>\n' +
    '      <p class="price" *ngIf="item.transaction ==  \'Sale\'">\n' +
    '        $ {{item.price}}\n' +
    '      </p>\n' +
    '      <p class="price" *ngIf="item.transaction ==  \'Rent\'">\n' +
    '        $ {{item.price}} per month\n' +
    '      </p>\n' +
    '    </div>\n' +
    '    <div style="clear: both;"></div>\n' +
    '    <div class="transaction">\n' +
    '      {{item.transaction}}\n' +
    '    </div>\n' +
    '    <div class="openhouse">\n' +
    '      {{item.openhouses}}\n' +
    '    </div>\n' +
    '  </mat-card>',
  styleUrls: ['./app.component.css']
})
export class DataComponent implements OnInit {

  private data = [];

  private months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Nov.', 'Dec.'];

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.getData()
      .subscribe((items: Item[]) => {
        items.forEach(item => {
          const element = {
            isSelected: false,
            id: item.Listing.ID,
            address: item.Property.Address.StreetNumber + ' ' + item.Property.Address.StreetName,
            transaction: item.Listing.Transaction,
            price: item.Listing.Price,
            openhouses: this.getUpcomingOpenHouse(item.Listing.OpenHouses)
          };
          this.data.push(element);
        });
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
}
