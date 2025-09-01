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

  constructor(
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private archiveService: ArchiveService,
    private modalService: NgbModal,
    private toastr: ToastrService
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
    this.modalService.dismissAll();
  }
  getFileUrl(path: string) {
    return `${environment.apiUrl}/${path}`;
  }

  getFileName(path: string) {
    return path.split('/').pop() || 'ملف';
  }
}