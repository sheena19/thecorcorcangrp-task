import {DataService} from './data.service';
import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DataModel} from './model';

@Component({
  selector: 'app-data',
  templateUrl: 'data.component.html',
  styleUrls: ['./app.component.css']
})
export class DataComponent implements OnInit {

  item = '';
  private data: DataModel[] = [];
  private dataSub: Subscription;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    this.dataService.fetchData();
    this.dataSub = this.dataService
      .getDataUpdatedListener()
      .subscribe((data: DataModel[]) => {
        this.data = data;
      });
  }
}
