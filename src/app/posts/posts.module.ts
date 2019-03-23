import { NgModule } from '@angular/core';
import { PostListComponent, PostDeleteDialogComponent } from './post-list/post-list.component';
import { PostViewDialogComponent } from './post-list/post/post-view-dialog';
import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';

@NgModule({
  declarations: [
    PostListComponent,
    PostDeleteDialogComponent,
    PostViewDialogComponent,
    PostCreateComponent,
    BannerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
  ],
  entryComponents: [PostDeleteDialogComponent, PostViewDialogComponent]
})
export class PostsModule { }
