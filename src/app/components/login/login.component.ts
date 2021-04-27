import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {SocialAuthService} from 'angularx-social-login';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // @ts-ignore
  email: string ;
  // @ts-ignore
  password: string ;
  constructor(private authService: SocialAuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      console.log('reached');
      if (authState){
        this.router.navigateByUrl(this.route.snapshot.queryParams[`returnUrl`] || '/profile');
      }
      else {
        this.router.navigateByUrl('/login');
      }
    });

  }

  // tslint:disable-next-line:typedef
  signInWithGoogle() {
    this.userService.googleLogin();
  }

  // tslint:disable-next-line:typedef
  login(form: NgForm) {
    const  email: string = this.email;
    const  password: string = this.password;
    if (form.invalid){
      return;
    }
    form.reset();
    this.userService.loginUser(email, password);
  }
}
