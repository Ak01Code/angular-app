import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.toastr.success('Login Successfull', 'Success');
        localStorage.setItem('token', res?.access_token);
        this.router.navigate(['/event']);
      },
      error: (err) => {
        console.log('login failed', err);
        this.toastr.error(err?.error?.message, 'Error');
      },
    });
  }
}
