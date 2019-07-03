import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { oauth } from 'midgard-core';
import { Router } from '@angular/router';
import { OAuthService } from '../../../midgard/modules/oauth/oauth.service';
import { HttpService } from '../../../midgard/modules/http/http.service';
import { loadAuthUser } from '../../../midgard/state/authuser/authuser.actions';
import { select, Store } from '../../../midgard/modules/store/store';
import * as config from '../../../../config.json';
import {FormValidationHelper} from '../../../midgard/modules/form/form.validation.helper';

@Component({
  selector: 'mg-login',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

  loginForm: FormGroup;
  error: string;
  appEntryPoint = (config as any).appEntryPoint;
  errors = {};
  errorMessages = {
    username: 'please fill your username',
    password: 'please fill your password',
  };

  constructor(
    private formBuilder: FormBuilder,
    private formHelper: FormValidationHelper,
    private oauthService: OAuthService,
    private httpService: HttpService,
    private router: Router,
    private store: Store<any>
  ) { }
  ngOnInit() {
    this.initForm();
    this.loginForm.valueChanges.subscribe(val => {
      this.errors = this.formHelper.validateForm(this.loginForm, this.errorMessages);
    });
    // navigate to the main root if the user has valid access token
    if (this.oauthService.hasValidAccessToken()) {
      this.router.navigate([this.appEntryPoint]);
    }
  }

  /**
   * intialises the login form
   */
  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  /**
   * authenticates the user to the app and saves the token and the user data to local storage
   */
  authenticate() {
    this.router.navigate(['/admin-panel/main']);

    // this.oauthService.authenticateWithPasswordFlow(this.loginForm.value).subscribe( token => {
    //     this.oauthService.setAccessToken(token.data);
    //     this.store.dispatch(loadAuthUser());
    //   },
    //   err => {
    //     this.error = 'Your username or password is incorrect';
    //   });
  }
}