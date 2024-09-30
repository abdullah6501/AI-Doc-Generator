import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  email: string | null = null;
  dropdownOpen: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  // ngOnInit(): void {
  //   this.email = localStorage.getItem('email');
  //   if (!this.email) {
  //     this.router.navigate(['/login']);  
  //   }
  // }

  goToDocuGenPage() {
    const token = localStorage.getItem('token'); 
    console.log('Token:', token);
    if (token) {
      this.router.navigate(['/project']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  login() {
    this.router.navigate(['/login']); 
  }

  register() {
    this.router.navigate(['/register']); 
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    const isClickInside = targetElement.closest('.dropdown');

    if (!isClickInside) {
      this.dropdownOpen = false;
    }
  }
}