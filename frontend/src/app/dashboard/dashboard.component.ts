import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isEditing = false;
  brdForm: FormGroup;
  brdContent: string = '';
  editedContent: string = '';
  languages = [
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Spanish', value: 'Spanish' },
    { label: 'French', value: 'French' },
    { label: 'German', value: 'German' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Korean', value: 'Korean' },
    { label: 'Portuguese', value: 'Portuguese' },
    { label: 'Russian', value: 'Russian' },
    { label: 'Chinese', value: 'Chinese' }
  ];

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.brdForm = this.fb.group({
      summary: ['', Validators.required],
      language: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/home']);
  }

  goHome() {
    this.router.navigate(['/project']); 
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.saveDocument();
    }
  }

  saveDocument() {
    this.brdContent = this.editedContent;
    console.log('Document saved:', this.brdContent);
  }

  generateBRD() {
    this.spinner.show();
    const formData = {
      summary: this.brdForm.value.summary,
      language: this.brdForm.value.language,
    };

    const url = `${this.apiUrl}/generate-brd`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        this.brdContent = response.brd_content;
        this.editedContent = this.brdContent;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating BRD:', error);
        this.spinner.hide();
      }
    );
  }

  downloadBRD() {
    if (this.brdContent) {
      const payload = { brd_content: this.brdContent };
      const url = `${this.apiUrl}/download-brd-doc`; 

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_brd_${this.brdForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading BRD as Word:', error);
        }
      );
    } else {
      console.error('BRD content is empty. Generate the document first.');
    }
  }

  downloadPDF(): void {
    if (!this.brdContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.brdContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });

    pdf.save(`generated_brd_${this.brdForm.value.language}.pdf`);
  }
}
