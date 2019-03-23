import { Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-post-view-dialog',
  templateUrl: './post-view-dialog.html',
  styleUrls: ['./post-view-dialog.css']
})
export class PostViewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PostViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) {}
}
