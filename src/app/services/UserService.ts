import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public async registerUser(formData: FormGroup): Promise<any>
  {
    const requestBody = {
      email: formData.get('email')?.value,
      login: formData.get('login')?.value,
      password: formData.get('password')?.value,
      phoneNumber: formData.get('phoneNumber')?.value
    };

    return this.http.post('http://localhost:8080/register', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();
  }

  public async loginUser(formData: FormGroup): Promise<any>
  {
    const requestBody = {
      login: formData.get('login')?.value,
      password: formData.get('password')?.value
    };

    return this.http.post('http://localhost:8080/login', requestBody, {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();
  }
}
