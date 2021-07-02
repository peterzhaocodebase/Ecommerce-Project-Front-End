import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import * as OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';
//const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthService) { 

    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo.png',
      features: {
        registration: true
      },
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes
      }
    });

  }

  ngOnInit(): void {

    // this.oktaSignin.remove();

    // this.oktaSignin.renderEl({
    //   el: '#okta-sign-in-widget'}, // this name should be same as div tag id in login.component.html
    //   (response) => {
    //     if (response.status === 'SUCCESS') {
    //       console.log("successful");
    //       this.oktaAuthService.signInWithRedirect();
    //       console.log("success logged in!");
    //     }
    //   },
    //   (error) => {
    //     throw error;
    //   }
    // );



    this.oktaSignin.showSignInToGetTokens({
      el: '#sign-in-widget',
      scopes: myAppConfig.oidc.scopes
    }).then(tokens => {
      // When navigating to a protected route, the route path will be saved as the `originalUri`
      // If no `originalUri` has been saved, then redirect back to the app root
      console.log("login step 1");

      // const originalUri = this.oktaAuthService.getOriginalUri();
      // if (originalUri === DEFAULT_ORIGINAL_URI) {
      //   this.oktaAuthService.setOriginalUri('/');
      // }

      // Remove the widget
      this.oktaSignin.remove();

      // In this flow the redirect to Okta occurs in a hidden iframe
      this.oktaAuthService.handleLoginRedirect(tokens);
    }).catch(err => {
      // Typically due to misconfiguration
      throw err;
    });



  }

}