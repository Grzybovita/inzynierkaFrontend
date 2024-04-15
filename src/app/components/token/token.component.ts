import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";

export enum TokenStatus {
  VALID,
  INVALID,
  EXPIRED,
  SENDING,
  SENT
}

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit{
  token = '';
  tokenStatus = TokenStatus;
  status : TokenStatus = 1;
  errorMessage = '';

  constructor(private authService: AuthService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;
    if(this.token){
      this.authService.verifyToken(this.token).subscribe(
        data => {
          this.status = TokenStatus[data.message as keyof typeof TokenStatus];
        }
        ,
        err => {
          this.errorMessage = err.error.message;
        }
      );
    }
  }

  resendToken(): void {
    this.status = TokenStatus.SENDING;
    this.authService.resendToken(this.token).subscribe(
      data => {
        this.status = TokenStatus.SENT;
      }
      ,
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

}
