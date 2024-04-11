import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  loginTaken: boolean = false;


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void
  {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      login: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
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
        if (error.error === 'loginTaken')
        {
          registrationForm.get('login')?.setErrors({ loginTaken: true });
        }
        if (error.error === 'emailTaken')
        {
          registrationForm.get('email')?.setErrors({ emailTaken: true });
        }
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
