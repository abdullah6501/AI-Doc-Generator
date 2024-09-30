import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-prd',
  templateUrl: './prd.component.html',
  styleUrls: ['./prd.component.css']
})
export class PrdComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isEditingPRD = false;
  prdForm: FormGroup;
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
  prdContent: string = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService) {
    this.prdForm = this.fb.group({
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



  toggleEditPRD() {
    this.isEditingPRD = !this.isEditingPRD;
    if (!this.isEditingPRD) {
      this.savePRDDocument();
    }
  }

  savePRDDocument() {
    console.log('PRD Document saved:', this.prdContent);
  }

  generatePRD() {
    this.spinner.show();

    const formData = {
      summary: this.prdForm.value.summary,
      language: this.prdForm.value.language,
    };

    const url = `${this.apiUrl}/generate-prd`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        this.prdContent = response.prd_content;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating PRD:', error);
        this.spinner.hide();
      }
    );
  }

  downloadPRD() {
    if (this.prdContent) {
      const payload = { prd_content: this.prdContent };
      const url = `${this.apiUrl}/download-prd-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_tpd_${this.prdForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading PRD as Word:', error);
        }
      );
    } else {
      console.error('TPD content is empty. Generate the document first.');
    }
  }


  downloadPRDPDF(): void {
    if (!this.prdContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.prdContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });

    pdf.save(`generated_prd_${this.prdForm.value.language}.pdf`);
  }

}