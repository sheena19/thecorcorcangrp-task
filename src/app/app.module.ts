import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';

import {AppComponent} from './app.component';
import {DataService} from './data.service';
import {DataComponent} from './data.component';
import {MapComponent} from './map.component';

@NgModule({
  declarations: [
    AppComponent,
    DataComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA59cgWZTWSCgdgRXZ6NobW12_wmKL8A9k'
    }),
    NgbModule
  ],
  providers: [
    DataService,
    GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
