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

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FileModel = require('./models/ACS/fileModel');
import FolderModel = require('./models/ACS/folderModel');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import Util = require('./util/util');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

import ErrorPage = require('./pages/adf/documentListErrorPage');

fdescribe('PERMISSION MESSAGE', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let errorPage = new ErrorPage();
    let acsUser = new AcsUserModel();
    let uploadedFolder;
    let privateSite;

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
        let siteName = `PRIVATE_TEST_SITE_${Util.generateRandomString()}`;
        let privateSiteBody: SiteBody = { visibility: 'PRIVATE' , title: siteName};

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

        uploadedFolder = await uploadActions.uploadFolder(this.alfrescoJsApi, folderOneModel.name, privateSite.entry.guid);

        done();
    });

    afterAll( async (done) => {
        // await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        // await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.guid);
        done();
    });

    it('1. Folder is not allowed when navigating via url', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
        expect(errorPage.getErrorCode()).toBe('403');
        expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    xit('2. Custom error message is showed', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.enableCustomPermissionMessage();
        // contentServicesPage.selectSite(privateSite.entry.guid);
        expect(errorPage.getErrorCode()).toBe('403');
        expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('3. Folder is not allowed when navigating via url', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        contentServicesPage.goToDocumentList();
        contentServicesPage.enableCustomPermissionMessage();
        browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
        expect(errorPage.getErrorCode()).toBe('Cris you don\'t have permissions');
    });

    xit('4. Folder is not allowed when navigating via url', () => {
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        navBar.changeLanguageTo('ITALIAN');
        contentServicesPage.goToDocumentList();
        contentServicesPage.enableCustomPermissionMessage();
        browser.get(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
        expect(errorPage.getErrorCode()).toBe('Cris you don\'t have permissions');
    });
});
