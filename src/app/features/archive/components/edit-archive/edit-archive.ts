import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadService } from '../../../../shared/services/file-upload';
import { ArchiveModel } from '../../models/archive.model';
import { CommonModule } from '@angular/common';
import { ArchiveService } from '../../services/archive';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-archive',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-archive.html',
  styleUrl: './edit-archive.scss'
})
export class EditArchive {
  @Input() archive!: ArchiveModel;
  @Output() archiveUpdated = new EventEmitter<any>();

  fileForm: FormGroup;
  selectedFile: File | null = null;
previewUrl: string | null = null;
  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private archiveService: ArchiveService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.fileForm = this.fb.group({});
  }

  // onFileSelected(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFile = input.files[0];
  //   }
  // }
  ngOnInit() {
  if (this.archive?.digitalCopy && this.isImage(this.archive.digitalCopy)) {
    this.previewUrl = this.getFileUrl(this.archive.digitalCopy);
  }
}
isImage(filePath: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  return imageExtensions.includes(extension);
}
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
    // Create a temporary URL to preview the selected image
    if (this.selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.previewUrl = null; // Clear the preview if a non-image file is selected
    }
  }
}
  save() {
    if (!this.selectedFile) return;

    this.fileUploadService.uploadFile(this.selectedFile).subscribe({
      next: (res: { path: string; succeeded: boolean }) => {
        if (res.succeeded) {
          const updateData = { digitalCopy: res.path };
          this.archiveService.updateArchive(this.archive.archiveID, updateData).subscribe({
            next: (updateRes) => {
              this.toastr.success("تم تحديث الأرشيف بنجاح");
              this.archiveUpdated.emit(updateRes);
              this.selectedFile = null;
              this.modalService.dismissAll();
            },
            error: (err) => {
              this.toastr.error("فشل تحديث الأرشيف");
            }
          });
        } else {
          this.toastr.error("فشل تحديث الأرشيف");
        }
      },
      error: (err) => {
        this.toastr.error("فشل تحديث الأرشيف");
      }
    });
  }

  cancel() {
    this.selectedFile = null;
  this.previewUrl = null;
  this.modalService.dismissAll();
  }
  getFileUrl(path: string) {
    return `${environment.apiUrl}/${path}`;
  }

  getFileName(path: string) {
    return path.split('/').pop() || 'ملف';
  }
}