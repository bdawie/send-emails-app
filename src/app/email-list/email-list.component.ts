import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { EmailService } from '../email-service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent implements OnInit,DoCheck {

  @Input() emails;
  isEmpty = false;
  showText = false;

  constructor(private emailService:EmailService) { }

  ngOnInit() {
    console.log(this.emails);
    if(this.emails.length === 0) this.isEmpty=true;
  }
  ngDoCheck(){
    if(this.emails.length !== 0) this.isEmpty=false;
    else{
      this.isEmpty=true;
    }

  }

  onDeleteEmail(email){
    this.emails.splice(this.emails.indexOf(email),1);
    this.emailService.deleteEmail(email);
  }

}
