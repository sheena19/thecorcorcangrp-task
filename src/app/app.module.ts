import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import {MatCardModule} from '@angular/material';
import { AppComponent } from './app.component';
import {DataService} from './data.service';
import {DataComponent} from './data.component';

@NgModule({
  declarations: [
    AppComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
