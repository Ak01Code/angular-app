import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // console.log('registerData', this.registerData);
    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        console.log('register successfull', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('register failed', err);
      },
    });
  }
}
