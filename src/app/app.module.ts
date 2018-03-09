import { EmailService } from './email-service';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailItemComponent } from './email-item/email-item.component';


@NgModule({
  declarations: [
    AppComponent,
    EmailListComponent,
    EmailItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  providers: [EmailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
