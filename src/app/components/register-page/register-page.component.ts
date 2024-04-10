import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/UserService";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {

  registrationForm: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit(): void
  {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator // Apply custom validator to form group
    });
  }

  onSubmit(registrationForm: FormGroup)
  {
    this.registrationForm = registrationForm;

    this.userService.registerUser(registrationForm)
      .then(response => {

        console.log('Registration successful:', response);
      })
      .catch(error => {

        console.error('Registration error:', error);
      });
  }

  passwordMatchValidator(form: FormGroup)
  {
    const password = form.get('password')?.value;
    const repeatPassword = form.get('repeatPassword')?.value;

    if (password !== repeatPassword)
    {
      form.get('repeatPassword')?.setErrors({ passwordMismatch: true });
    }
    else
    {
      form.get('repeatPassword')?.setErrors(null);
    }
  }

}
