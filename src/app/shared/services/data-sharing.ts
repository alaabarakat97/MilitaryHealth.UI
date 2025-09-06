// src/app/shared/data-sharing.service.ts

import { Injectable } from '@angular/core';
import { ArchiveModel } from '../../features/archive/models/archive.model';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private archiveData!: ArchiveModel;

  constructor() { }

  setArchiveData(archive: ArchiveModel) {
    this.archiveData = archive;
  }

  getArchiveData(): ArchiveModel  {
    return this.archiveData;
  }
}