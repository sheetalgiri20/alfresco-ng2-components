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

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';
import TestConfig = require('./test.config');

import fs = require('fs');
import path = require('path');

let buildNumber = process.env.TRAVIS_BUILD_NUMBER;
let saveScreenshot = process.env.SAVE_SCREENSHOT;

describe('Save screenshot at the end', () => {

    beforeAll(async (done) => {
        let uploadActions = new UploadActions();

        if (saveScreenshot === 'true') {
            if (!buildNumber) {
                buildNumber = Date.now();
            }

            let alfrescoJsApi = new AlfrescoApi({
                provider: 'ECM',
                hostEcm: TestConfig.adf.url
            });

            alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            let folder = await alfrescoJsApi.nodes.addNode('-my-', {
                'name': 'Screenshot-e2e-' + buildNumber,
                'nodeType': 'cm:folder'
            }, {}, {});

            let files = fs.readdirSync(path.join(__dirname, '../e2e-output/screenshots'));

            for (const fileName of files) {

                let pathFile = path.join(__dirname, '../e2e-output/screenshots', fileName);
                let file = fs.createReadStream(pathFile);

                await  alfrescoJsApi.upload.uploadFile(
                    file,
                    '',
                    folder.entry.id,
                    null,
                    {
                        'name': file.name,
                        'nodeType': 'cm:content'
                    }
                );

            }
        }

        done();
    });

    fit('screenshot need it', () => {
        expect(true).toEqual(true);
    });
});
