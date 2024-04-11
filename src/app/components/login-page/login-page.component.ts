import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {UserService} from "../../services/UserService";

@Component({
  selector: 'app-login-page',
  standalone: true,
    imports: [
        FormsModule,
        MatButton,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatError,
        NgIf
    ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { }

  ngOnInit(): void
  {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit(loginForm: FormGroup)
  {
    this.loginForm = loginForm;

    this.userService.loginUser(loginForm)
      .then(response => {

        console.log('Login successful:', response);
      })
      .catch(error => {
        if (error.error === 'invalidCredentials')
        {
          loginForm.get('password')?.setErrors({ invalidCredentials: true });
        }
        console.error('Login error:', error);
      });

  }

}
