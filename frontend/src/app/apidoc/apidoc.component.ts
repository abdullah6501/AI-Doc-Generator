import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-apidoc',
  templateUrl: './apidoc.component.html',
  styleUrls: ['./apidoc.component.css']
})
export class ApidocComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isEditing = false;
  apiForm: FormGroup;
  languages = [
    { label: 'English', value: 'English' },
    // { label: 'Hindi', value: 'Hindi' },
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
  apiContent: string = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.apiForm = this.fb.group({
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
    const textareaElement = document.querySelector('.brd-textarea') as HTMLTextAreaElement;
    if (textareaElement) {
      this.apiContent = textareaElement.value; 
      console.log('Document saved:', this.apiContent);
    }
  }

  generateApiDocumentation() {
    this.spinner.show();

    const formData = {
      summary: this.apiForm.value.summary,
      language: this.apiForm.value.language
    };

    const url = `${this.apiUrl}/generate-api-doc`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        console.log('API Documentation generated:', response);
        this.apiContent = response.api_content;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating API Documentation:', error);
        this.spinner.hide();
      }
    );
  }

  downloadApiDocumentation() {
    if (this.apiContent) {
      const payload = { api_content: this.apiContent };
      const url = `${this.apiUrl}/download-api-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_api_${this.apiForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading API as Word:', error);
        }
      );
    } else {
      console.error('API content is empty. Generate the document first.');
    }
  }

  downloadQRDPDF(): void {
    if (!this.apiContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.apiContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });

    pdf.save(`generated_qrd_${this.apiForm.value.language}.pdf`);
  }
}