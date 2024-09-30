import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-techdoc',
  templateUrl: './techdoc.component.html',
  styleUrls: ['./techdoc.component.css']
})
export class TechdocComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  isTechDocEditing = false;
  techDocForm: FormGroup;
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
  techDocContent: string = '';
  editedTechDocContent: string = '';


  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.techDocForm = this.fb.group({
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

  toggleTechDocEdit() {
    this.isTechDocEditing = !this.isTechDocEditing;
    if (!this.isTechDocEditing) {
      this.saveTechnicalDocument();
    }
  }

  saveTechnicalDocument() {
    this.techDocContent = this.editedTechDocContent;
    console.log('Technical Document saved:', this.techDocContent);
  }

  generateTechnicalDocument() {
    this.spinner.show();
    const formData = {
      summary: this.techDocForm.value.summary,
      language: this.techDocForm.value.language,
    };

    const url = `${this.apiUrl}/generate-technical-document`;
    this.http.post(url, formData).subscribe(
      (response: any) => {
        console.log('Response:', response); 
        this.techDocContent = response.tech_doc_content; 
        if (!this.techDocContent) {
          console.error('Technical Document content is undefined');
        }
        this.editedTechDocContent = this.techDocContent; 
        this.spinner.hide();
      },
      error => {
        console.error('Error generating Technical Document:', error);
        this.spinner.hide();
      }
    );
  }

  downloadTechnicalDocument() {
    if (this.techDocContent) {
      const payload = { tech_doc_content: this.techDocContent };
      const url = `${this.apiUrl}/download-tech-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_techdoc_${this.techDocForm.value.language}.docx`;
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
      console.error('Techdoc content is empty. Generate the document first.');
    }
  }

  downloadTechDocPDF(): void {
    if (!this.techDocContent) {
      alert('No content available to download.');
      return;
    }

    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.techDocContent, pdf.internal.pageSize.width - 2 * margin);

    let cursorY = margin;

    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10; 
    });

    pdf.save(`generated_technical_doc_${this.techDocForm.value.language}.pdf`);
  }

}