import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from './../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../../auth/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import { PostViewDialogComponent } from './post/post-view-dialog';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  isLoading = false;
  totalPost = 0;
  postsPerPage = 6;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated = false;
  userId: string;
  noMoreContent = false;
  isFiltered = false;
  sortByString: string;
  order = 1;
  isRecentSelected = true;
  isPopularSelected = false;
  isTitleSelected = false;
  isAfterDelete = false;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage, '', this.sortByString, this.order);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe(
      (postData: {posts: Post[], postCount: number, isFiltered: boolean}) => {
        this.isLoading = false;
        this.totalPost = postData.postCount;
        this.isFiltered = postData.isFiltered;
        if (postData.posts.length > 0 && !this.isFiltered && !this.isAfterDelete) {
          this.posts = this.posts.concat(postData.posts);
          if (postData.posts.length < this.postsPerPage) {
            this.noMoreContent = true;
          }
        } else if (postData.posts.length <= 0 && !this.isFiltered && !this.isAfterDelete) {
          this.noMoreContent = true;
        } else {
          this.posts = postData.posts;
          this.isAfterDelete = false;
        }
      }
    );
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }
    );
  }

  sortBy(str: string) {
    this.sortByString = str;
    if (str === 'updatedAt') {
      this.isRecentSelected = true;
      this.isPopularSelected = false;
      this.isTitleSelected = false;
    }
    if (str === 'likes') {
      this.isRecentSelected = false;
      this.isPopularSelected = true;
      this.isTitleSelected = false;
    }
    if (str === 'title') {
      this.isRecentSelected = false;
      this.isPopularSelected = false;
      this.isTitleSelected = true;
    }

    this.order = this.order * -1;
    this.postsService.getPosts(this.postsPerPage, this.currentPage, '', this.sortByString, this.order);
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    // this.currentPage = pageData.pageIndex + 1;
    // this.postsPerPage = pageData.pageSize;
    this.currentPage = this.currentPage + 1;
    // this.postsPerPage = this.postsPerPage;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.isAfterDelete = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    },
    () => { this.isLoading = false; });
  }

  openDeleteDialog(postId: string) {
    const dialogRef = this.dialog.open(PostDeleteDialogComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
       if (result) {
         this.onDelete(postId);
       }
    });
  }

  openViewDialog(index: number) {
    const dialogRef = this.dialog.open(PostViewDialogComponent, {
      width: '550px',
      height: '90%',
      data: this.posts[index]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}


@Component({
  selector: 'app-post-delete-dialog',
  templateUrl: './post-delete-dialog.html'
})
export class PostDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PostDeleteDialogComponent>
    ) {}
}
