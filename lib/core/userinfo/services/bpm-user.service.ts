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
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { BpmUserModel } from '../models/bpm-user.model';
import 'rxjs/add/observable/throw';

/**
 *
 * BPMUserService retrieve all the information of an Ecm user.
 *
 */
@Injectable()
export class BpmUserService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Gets information about the current user.
     * @returns User information object
     */
    getCurrentUserInfo(): Observable<BpmUserModel> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.profileApi.getProfile())
            .map((data) => <BpmUserModel> data)
            .catch(err => this.handleError(err));
    }

    /**
     * Gets the current user's profile image as a URL.
     * @returns URL string
     */
    getCurrentUserProfileImage(): string {
        return this.apiService.getInstance().activiti.profileApi.getProfilePictureUrl();
    }

    /**
     * Throw the error
     * @param error
     */
    private handleError(error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }

}
