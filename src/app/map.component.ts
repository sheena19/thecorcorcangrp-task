import {Component, NgZone, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DataService} from './data.service';
import {AgmMap, GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {Subscription} from 'rxjs';
import {DataModel} from './model';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./app.component.css']
})
export class MapComponent implements OnInit {

  public static geocoder: any;
  public location: Location = {
    lat: 40.783757,
    lng: -73.970420,
    zoom: 12,
    markers: []
  };
  private markers: Marker[] = [];
  @ViewChild(AgmMap) map: AgmMap;

  data: DataModel[] = [];
  private mapSub: Subscription;
  geocoder: any;

  constructor(public dataService: DataService,
              public mapsApiLoader: MapsAPILoader,
              private zone: NgZone,
              private wrapper: GoogleMapsAPIWrapper) {
    this.mapsApiLoader = mapsApiLoader;
    this.zone = zone;
    this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      MapComponent.geocoder = new google.maps.Geocoder();
      this.data = this.dataService.getData();
      // this.markers = [];
      this.data.forEach(item => {
        const address = {
          address: item.address + '  ' + item.city,
          id: item.id
        };
        this.findLocation(address.address, address.id);
      });
      this.location = {
        lat: 40.783757,
        lng: -73.970420,
        zoom: 12,
        markers: this.markers
      };
      this.map.triggerResize(true);
    });
  }

  ngOnInit() {
    this.mapsApiLoader.load().then(() => {
      MapComponent.geocoder = new google.maps.Geocoder();
      this.mapSub = this.dataService
        .getDataUpdatedListener()
        .subscribe((data: DataModel[]) => {
          this.data = data;
          // this.markers = [];
          this.data.forEach(item => {
            const address = {
              address: item.address + '  ' + item.city,
              id: item.id
            };
            this.findLocation(address.address, address.id);
          });
          this.location = {
            lat: 40.783757,
            lng: -73.970420,
            zoom: 12,
            markers: this.markers
          };
          this.map.triggerResize(true);
        });
    });
  }

  findLocation(address, id): any {
    // if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
    MapComponent.geocoder.geocode({
      'address': address
    }, (results, status) => {
      // console.log(address, results, status);
      if (status == google.maps.GeocoderStatus.OK) {
        // decompose the result
        if (results[0].geometry.location) {
          const marker: Marker = {
            id: id,
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
            draggable: false
          };
          this.location.viewport = results[0].geometry.viewport;
          if (this.markers.find((m => {
            return m.id === marker.id;
          })) === undefined) {
            this.markers.push(marker);
          }
        }
      }
    });
  }

  clickedMarker(label, id) {
    this.dataService.updateItem(id);
  }
}

interface Marker {
  id: number;
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  zoom: number;
  viewport?: Object;
  markers?: Marker[];
}
