import { Injectable } from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import {strict} from 'assert';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  // @ts-ignore
  private user;
  authState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  // @ts-ignore
  userData$: BehaviorSubject<SocialUser | ResponseModel> = new BehaviorSubject<SocialUser | ResponseModel>(null);

  constructor(private authService: SocialAuthService,
              private http: HttpClient) {

    authService.authState.subscribe((user): void => {
      if (user != null) {
        this.auth = true;
        this.authState$.next(this.auth);
        this.userData$.next(user);
      }
    });
  }

  // Login User with Email and Password
  loginUser(email: string, password: string): void {
    // @ts-ignore
    this.http.post('${this.SERVER_URL}/auth/login', {email, password}).subscribe((data: ResponseModel): void => {
      this.auth = data.auth;
      this.authState$.next(this.auth);
      this.userData$.next(data);
    });
  }

  // Google Authentication
  googleLogin(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // Logout Method
  logout(): void{
    this.authService.signOut();
    this.auth = false;
    this.authState$.next(this.auth);
  }
}
export interface ResponseModel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userId: number;
}
