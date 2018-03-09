
import { Injectable } from "@angular/core";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';
import io from 'socket.io-client';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type':'application/json'
    })
}; 

@Injectable()
export class EmailService{

    emailsUpdated = new Subject();
    socket = io();
    emails = [];
    constructor() {
        
    }

    sendEmail(emailOptions){
        this.socket.emit('email submit',emailOptions);
    }

    deleteEmail(email){
        this.socket.emit('email delete',email);
    }

    
}