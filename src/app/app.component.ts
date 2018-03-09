import { EmailService } from './email-service';
import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import {Subscription} from 'rxjs';


import io from "socket.io-client";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck,OnDestroy{
 
  showEmailModal = false;
  myFormGroup:FormGroup;
  socket = io();
  emails= [];
  private emailSubscription = new Subscription();

  isCollapse = false;

  constructor(private emailService:EmailService){}

  ngOnInit(){
    this.createFormGroup();

    this.socket.on('get emails',(emails)=>{
      this.emails = emails;
    });
    
  }
  ngDoCheck(){
  }

  onCreateEmail(){
    this.showEmailModal=true;
  }
  onCloseEmailForm(){
    this.showEmailModal=false;
  }
  onEmailSubmit(){
    const emailOptions = {
      recipient : this.myFormGroup.value.recipient,
      subject: this.myFormGroup.value.subject,
      emailText:this.myFormGroup.value.emailText
    }
    this.emails.push(emailOptions);
    this.emailService.sendEmail(emailOptions);
    this.myFormGroup.reset();
    this.showEmailModal=false;

  }

  createFormGroup(){
    this.myFormGroup = new FormGroup({
      recipient : new FormControl('',[
        Validators.email,
        Validators.required]),
      subject: new FormControl('',Validators.required),
      emailText: new FormControl('',Validators.required)
    });
  }
  ngOnDestroy(){
  }
}
