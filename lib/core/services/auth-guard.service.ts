/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate,
  CanActivateChild, RouterStateSnapshot, Router
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs/Observable';
import { AppConfigService } from '../app-config/app-config.service';
import { UserPreferencesService } from './user-preferences.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthenticationService,
                private router: Router,
                private userPreference: UserPreferencesService,
                private appConfig: AppConfigService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        const redirectUrl = state.url;
        return this.checkLogin(redirectUrl);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.canActivate(route, state);
    }

    checkLogin(redirectUrl: string): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        if (!this.authService.isOauth() || this.isOAuthWithoutSilentLogin() ) {
            this.authService.setRedirect({ provider: 'ALL', navigation: redirectUrl } );

            const pathToLogin = this.getRouteDestinationForLogin();
            this.router.navigate(['/' + pathToLogin]);
        }

        return false;
    }

    isOAuthWithoutSilentLogin() {
        return this.authService.isOauth() && this.userPreference.oauthConfig.silentLogin === false;
    }

    public getRouteDestinationForLogin(): string {
        return this.appConfig &&
               this.appConfig.get<string>('loginRoute') ?
                        this.appConfig.get<string>('loginRoute') : 'login';
    }
}
