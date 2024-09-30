import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  email = '';
  password = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  success() {
    this.messageService.add({
      severity: 'success',
      summary: 'Login Successful',
      detail: 'You have been logged in successfully.',
      key: 'tl',
    });
  }

  logerr(): void {
    this.messageService.add({
      key: 't2',
      severity: 'warn',
      summary: 'Login Failed',
      detail: 'No token received. Login failed.'
    });
  }

  epasserr(): void {
    this.messageService.add({
      key: 't3',
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Invalid email or password.'

    });
  }

  login() {
    const url = `${this.apiUrl}/login`;
    this.http.post(url, { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('email', this.email);
            //           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful' })
            //           console.log('Login successful - showing toast');
            //           this.router.navigate(['/project']);
            //         } else {
            //           console.error('No token received, login failed.');
            //           this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No token received, login failed' });
            //           // alert('Login failed: No token received');
            //         }
            //       },
            //       error: (error: any) => {
            //         console.error('Login failed', error);
            //         alert('Login failed: Invalid email or password');
            //       }
            //     });
            // }
            this.success();

            setTimeout(() => {
              this.router.navigate(['/project']);
            }, 2000);
          } else {
            this.logerr();

            setTimeout(() => {
            }, 1000);

          }
        },
        error: (error: any) => {
          this.epasserr();

          setTimeout(() => {
          }, 1000);

        }
      });
  }


  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
