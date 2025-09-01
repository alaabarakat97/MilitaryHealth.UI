import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '../../../../shared/services/file-upload';
import { ArchiveModel } from '../../models/archive.model';
import { CommonModule } from '@angular/common';
import { ArchiveService } from '../../services/archive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-edit-archive',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-archive.html',
  styleUrl: './edit-archive.scss'
})
export class EditArchive {
  archive!: ArchiveModel;
  fileForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private archiveService: ArchiveService,
    private modalService: NgbModal,
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
      next: (res: { path: string; succeeded: boolean }) => {
        const updateData = { digitalCopy: res.path };
        this.archiveService.updateArchive(this.archive.archiveID, updateData).subscribe(
          {
            next: (updateRes) => {
              console.log('✅ تم تحديث الأرشيف بنجاح:', updateRes);
              this.selectedFile = null; // إعادة تعيين الملف
              this.modalService.dismissAll();
            },
            error: (err) => {
            console.error('❌ فشل تحديث الأرشيف:', err);
          }
          },
            
        )
      },
      error: (err) => {
        console.error('❌ فشل رفع الملف:', err);
      }
    });
  }

  cancel() {
    this.selectedFile = null;
     this.modalService.dismissAll();
  }
}
