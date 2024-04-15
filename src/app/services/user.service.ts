import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";

const REGISTER_API = 'http://localhost:8080/api/auth/signup';
const LOGIN_API = 'http://localhost:8080/api/auth/signin';
const LOGOUT_API = 'http://localhost:8080/api/auth/signout';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  public registerUser(formData: FormGroup): Observable<any>
  {
    const requestBody = {
      email: formData.get('email')?.value,
      username: formData.get('username')?.value,
      password: formData.get('password')?.value
    };

    return this.http.post(REGISTER_API, requestBody, httpOptions);
  }

  public loginUser(formData: FormGroup): Observable<any>
  {
    const requestBody = {
      username: formData.get('username')?.value,
      password: formData.get('password')?.value
    };

    return this.http.post(LOGIN_API, requestBody, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(LOGOUT_API, { }, httpOptions);
  }
}
