import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  isLoggedInSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  clean(): void
  {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void
  {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  public getUser(): any
  {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user)
    {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean
  {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user)
    {
      return true;
    }

    return false;
  }

  public isLoggedInObservable(): Observable<boolean>
  {
    return this.isLoggedInSubject.asObservable();
  }
}
