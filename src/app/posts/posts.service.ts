import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number, isFiltered: boolean }>();
  url = environment.apiUrl + '/posts/';

  constructor(public http: HttpClient, public router: Router) { }

  getPosts(postsPerPage: number, currentPage: number, searchText?: string, sortBy?: string, order: number = 1) {
    let queryParams;
    let fromSearch = false;
    if (searchText) {
      queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}&search=${searchText}`;
      fromSearch = true;
    } else {
      queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}&sort=${sortBy}&order=${order}`;
      if (searchText === '') {
        fromSearch = true;
      }
    }

    this.http.get<{message: string, posts: any, maxPosts: number}>(this.url + queryParams)
    .pipe(map((res) => {
        return { posts: res.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator,
            likes: post.likes
          };
        }), maxPosts: res.maxPosts};
    }))
    .subscribe(
      (transformedPostData) => {
          this.posts = transformedPostData.posts;
          this.postsUpdated.next({posts: [...this.posts],
            postCount: transformedPostData.maxPosts,
            isFiltered: fromSearch});
      }
    );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(this.url + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>(this.url, postData)
    .subscribe(
      (res) => {
        // const post: Post = {id: res.post.id, title: title, content: content, imagePath: res.post.imagePath};
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
      let postData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
       postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http.put(this.url + id, postData)
      .subscribe(res => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id, title: title, content: content, imagePath: ''
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {

    return this.http.delete(this.url + postId);

    // this.http.delete(this.url + postId)
    //   .subscribe(
    //     () => {
    //       const updatedPosts = this.posts.filter(post => post.id !== postId);
    //       this.posts = updatedPosts;
    //       this.postsUpdated.next([...this.posts]);
    //     }
    //   );
  }
}
