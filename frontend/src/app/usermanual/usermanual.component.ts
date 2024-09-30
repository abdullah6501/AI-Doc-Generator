import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usermanual',
  templateUrl: './usermanual.component.html',
  styleUrls: ['./usermanual.component.css']
})
export class UsermanualComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isEditing = false;
  userManualForm: FormGroup;
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
  userManualContent: string = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.userManualForm = this.fb.group({
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
      this.userManualContent = textareaElement.value;
      console.log('Document saved:', this.userManualContent);
    }
  }

  generateUserManual() {
    this.spinner.show();

    const formData = {
      summary: this.userManualForm.value.summary,
      language: this.userManualForm.value.language,
    };

    const url = `${this.apiUrl}/generate-user-manual`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        this.userManualContent = response.user_manual_content;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating User Manual:', error);
        this.spinner.hide();
      }
    );
  }



  downloadUserManual() {
    if (this.userManualContent) {
      const payload = { user_manual_content: this.userManualContent };
      const url = `${this.apiUrl}/download-usermanual-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_usermanual_${this.userManualForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading usermanual as Word:', error);
        }
      );
    } else {
      console.error('User Manual content is empty. Generate the document first.');
    }
  }

  downloadPDF(): void {
    if (!this.userManualContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.userManualContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });

    pdf.save(`generated_user_manual_${this.userManualForm.value.language}.pdf`);
  }
}