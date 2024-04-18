import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {
  private inputClearedSource = new Subject<number>();
  inputCleared$ = this.inputClearedSource.asObservable();

  clearInput(clearedValue: number | undefined): void {
    if (clearedValue)
    {
      this.inputClearedSource.next(clearedValue);
    }
    else
    {
      this.inputClearedSource.next(0);
    }
  }
}
