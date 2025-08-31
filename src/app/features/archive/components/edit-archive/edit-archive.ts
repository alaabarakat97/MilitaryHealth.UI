import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '../../../../shared/services/file-upload';
import { ArchiveModel } from '../../models/archive.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-archive',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-archive.html',
  styleUrl: './edit-archive.scss'
})
export class EditArchive {
 @Input() archive!: ArchiveModel;

  fileForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService
  ) {
    this.fileForm = this.fb.group({});
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  save() {
    if (!this.selectedFile) return;

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        console.log('✅ الملف اترفع بنجاح:', res);

   
      },
      error: (err) => {
        console.error('❌ فشل رفع الملف:', err);
      }
    });
  }

  cancel() {
    this.selectedFile = null;
  }
}
