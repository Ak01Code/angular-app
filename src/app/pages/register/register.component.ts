import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    // console.log('registerData', this.registerData);
    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.toastr.success('User Register Successfull', 'Success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('register failed', err);
        this.toastr.error(err?.error?.message, 'Error');
      },
    });
  }
}
