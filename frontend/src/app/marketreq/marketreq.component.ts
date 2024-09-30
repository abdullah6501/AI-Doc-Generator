import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-marketreq',
  templateUrl: './marketreq.component.html',
  styleUrls: ['./marketreq.component.css']
})
export class MarketreqComponent implements OnInit {
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false; 
  isEditing = false;
  mrdForm: FormGroup;
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
  mrdContent: string = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private router: Router, 
    private fb: FormBuilder, 
    private http: HttpClient, 
    private cd: ChangeDetectorRef, 
    private spinner: NgxSpinnerService) {
    this.mrdForm = this.fb.group({
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
      this.mrdContent = textareaElement.value; 
      console.log('Document saved:', this.mrdContent);
    }
  }

  generateMRD() {
    this.spinner.show();
  
    const formData = {
      summary: this.mrdForm.value.summary,
      language: this.mrdForm.value.language,
    };
  
    const url = `${this.apiUrl}/generate-mrd`; 
    this.http.post(url, formData).subscribe(
      (response: any) => {
        this.mrdContent = response.mrd_content;
        this.spinner.hide();
      },
      error => {
        console.error('Error generating MRD:', error);
        this.spinner.hide();
      }
    );
  }
  
  downloadMRD() {
    if (this.mrdContent) {
      const payload = { mrd_content: this.mrdContent };
      const url = `${this.apiUrl}/download-mrd-doc`;

      this.http.post(url, payload, { responseType: 'blob' }).subscribe(
        (blob: Blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `generated_mrd_${this.mrdForm.value.language}.docx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
        },
        error => {
          console.error('Error downloading MRD as Word:', error);
        }
      );
    } else {
      console.error('TPD content is empty. Generate the document first.');
    }
  }
  
  downloadPDF(): void {
    if (!this.mrdContent) {
      alert('No content available to download.');
      return;
    }
  
    const pdf = new jsPDF();
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const lines: string[] = pdf.splitTextToSize(this.mrdContent, pdf.internal.pageSize.width - 2 * margin);
  
    let cursorY = margin;
  
    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        pdf.addPage();
        cursorY = margin;
      }
      pdf.text(line, margin, cursorY);
      cursorY += 10;
    });
  
    pdf.save(`generated_mrd_${this.mrdForm.value.language}.pdf`);
  }
}
