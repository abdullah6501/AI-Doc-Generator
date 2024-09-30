import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-testplan',
  templateUrl: './testplan.component.html',
  styleUrls: ['./testplan.component.css']
})
export class TestplanComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isEditing = false;
  tpdForm: FormGroup;
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
  tpdContent: string = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.tpdForm = this.fb.group({
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
      this.tpdContent = textareaElement.value;
      console.log('Document saved:', this.tpdContent);
    }
  }

  generateTPD() {
    this.spinner.show();

    const formData = {
      summary: this.tpdForm.value.summary,
      language: this.tpdForm.value.language,
    };

    const url = `${this.apiUrl}/generate-tpd`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        this.tpdContent = response.tpd_content;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating TPD:', error);
        this.spinner.hide();
      }
    );
  }

  downloadTPDWord() {
    if (this.tpdContent) {
      const payload = { tpd_content: this.tpdContent };
      const url = `${this.apiUrl}/download-tpd-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_tpd_${this.tpdForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading TPD as Word:', error);
        }
      );
    } else {
      console.error('TPD content is empty. Generate the document first.');
    }
  }

  downloadTPDPDF(): void {
    if (!this.tpdContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.tpdContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });

    pdf.save(`generated_qrd_${this.tpdForm.value.language}.pdf`);
  }
}