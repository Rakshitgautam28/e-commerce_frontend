import { Component, OnInit } from '@angular/core';
import {SocialAuthService, SocialUser} from 'angularx-social-login';
import {Router} from '@angular/router';
import {ResponseModel, UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myUser: any;

  constructor(private authService: SocialAuthService,
              private router: Router,
              private userService: UserService) { }

  // @ts-ignore
  ngOnInit(): void {
    this.userService.userData$
      .pipe(
        map(user => {
          if (user instanceof SocialUser){
            // @ts-ignore
            return {... user};
          }
          else{
            return user;
          }
        })
    ).subscribe((data: ResponseModel | SocialUser ) => {
      this.myUser = data;
    });
  }
  logout(): void{
    this.userService.logout();
  }

}
