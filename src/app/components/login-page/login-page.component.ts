import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {UserService} from "../../services/user.service";
import {StorageService} from "../../services/storage.service";

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

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private storageService: StorageService) { }

  ngOnInit(): void
  {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit(loginForm: FormGroup)
  {
    this.loginForm = loginForm;

    this.userService.loginUser(loginForm).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error;
        this.isLoginFailed = true;
        if (this.errorMessage === 'invalidCredentials')
        {
          loginForm.get('password')?.setErrors({ invalidCredentials: true });
        }
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
