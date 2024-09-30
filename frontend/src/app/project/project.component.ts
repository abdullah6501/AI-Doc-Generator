import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent {
  email: string | null = '';
  isSidenavOpen = false;

  projectName = 'DocuForge AI';
  // projectDescription = 'DocuForge AI simplifies and accelerates document creation, enabling users to generate high-quality documents efficiently, improving both accessibility and effectiveness.';

  buttons = [
    { title: 'BRD', description: 'Business Requirements Document', route: '/brd' },
    { title: 'PRD', description: 'Product Requirements Document', route: '/prd' },
    { title: 'FRD', description: 'Functional Requirements Document', route: '/frd' },
    { title: 'User Manual', description: 'Comprehensive User Guide', route: '/usermanual' },
    { title: 'Technical Document', description: 'Technical Specification Documentation', route: '/techdoc' },
    { title: 'Quality Requirements', description: 'Quality Requirements Document', route: '/qualityreq' },
    { title: 'Market Requirements', description: 'Market Requirements Document', route: '/mrd' },
    { title: 'Test Plan', description: 'Test Plan Document', route: '/testplan' },
    { title: 'API Documentation', description: 'API Guidelines and Details', route: '/apidoc' }
  ];

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    if (!this.email) {
      this.router.navigate(['/login']);
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/home']);
  }

  goToHome(){
    this.router.navigate(['/home']);
  }
}
