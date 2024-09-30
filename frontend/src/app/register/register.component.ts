import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';

  public apiUrl = environment.LOGIN_BASEURL;
  constructor(private http: HttpClient, private router: Router) { }

  register() {
    const url = `${this.apiUrl}/register`;
    this.http.post<{ message: string }>(url, {
      username: this.username,
      password: this.password,
      email: this.email
    })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response.message);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
        }
      });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
