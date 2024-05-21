import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {UserService} from "../../services/user.service";
import {NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

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
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {

  registrationForm: FormGroup | undefined;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private router: Router,
              ) {}

  ngOnInit(): void
  {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  onSubmit(registrationForm: FormGroup)
  {
    this.registrationForm = registrationForm;

    this.userService.registerUser(registrationForm).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']);
        this.snackBar.open(`Successfully register new account for ${registrationForm.get('username')?.value}, you can now log in`, 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      },
      error: err => {
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
        if (this.errorMessage === 'usernameTaken')
        {
          registrationForm.get('username')?.setErrors({ usernameTaken: true });
        }
        if (this.errorMessage === 'emailTaken')
        {
          registrationForm.get('email')?.setErrors({ emailTaken: true });
        }
        this.snackBar.open('Please fix all form validation errors', 'Close', {
          duration: 3000,
          verticalPosition: 'bottom',
        });
      }
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
