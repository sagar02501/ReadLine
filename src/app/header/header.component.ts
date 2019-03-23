import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PostsService } from '../posts/posts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  listSearchSubject = new Subject();
  searchText;
  private authListenerSub: Subscription;
  isUserAuthenticated = false;
  isSidenav = false;
  constructor(private authService: AuthService, private postsService: PostsService) { }

  ngOnInit() {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      });

      this.listSearchSubject.pipe(debounceTime(500)).subscribe((e) => {
        this.onSearch();
      });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout(e?) {
    this.authService.logout();
    if (e) this.toggleSidenav();
  }

  searchList() {
    this.listSearchSubject.next();
  }

  onSearch() {
    if (this.searchText === '') {
      this.postsService.getPosts(6, 1, this.searchText);
    } else {
      this.postsService.getPosts(100, 1, this.searchText);
    }
  }

  toggleSidenav() {
    this.isSidenav = !this.isSidenav;
    const sidenav = document.getElementById("sidenav");
    if (this.isSidenav) {
      sidenav.style.width = "50vw";
    } else {
      sidenav.style.width = "0";
    }
  }

}
