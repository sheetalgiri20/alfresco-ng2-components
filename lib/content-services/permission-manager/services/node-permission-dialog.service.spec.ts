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

import { TestBed, async } from '@angular/core/testing';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { NodePermissionDialogService } from './node-permission-dialog.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { NodePermissionService } from './node-permission.service';

describe('NodePermissionDialogService', () => {

    let service: NodePermissionDialogService;
    let materialDialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let afterOpenObservable: Subject<any>;
    let nodePermissionService: NodePermissionService;

    setupTestBed({
        imports: [ContentTestingModule],
        providers: [NodePermissionService]
    });

    beforeEach(() => {
        let appConfig: AppConfigService = TestBed.get(AppConfigService);
        appConfig.config.ecmHost = 'http://localhost:9876/ecm';
        service = TestBed.get(NodePermissionDialogService);
        materialDialog = TestBed.get(MatDialog);
        afterOpenObservable = new Subject<any>();
        nodePermissionService = TestBed.get(NodePermissionService);
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
            afterOpen: () => afterOpenObservable,
            afterClosed: () => Observable.of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        });
    });

    it('should be able to create the service', () => {
        expect(service).not.toBeNull();
    });

    it('should be able to open the dialog showing node permissions', () => {
        service.openAddPermissionDialog('fake-node-id', 'fake-title');
        expect(spyOnDialogOpen).toHaveBeenCalled();
    });

    it('should throw an error if the update of the node fails', async(() => {
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(Observable.throw({error : 'error'}));
        spyOn(service, 'openAddPermissionDialog').and.returnValue(Observable.of({}));
        service.updateNodePermissionByDialog('fake-node-id', 'fake-title').subscribe(() => {
            Observable.throw('This call should fail');
        }, (error) => {
            expect(error.error).toBe('error');
        });
    }));

    it('should return the updated node', async(() => {
        spyOn(nodePermissionService, 'updateNodePermissions').and.returnValue(Observable.of({id : 'fake-node'}));
        spyOn(service, 'openAddPermissionDialog').and.returnValue(Observable.of({}));
        service.updateNodePermissionByDialog('fake-node-id', 'fake-title').subscribe((node) => {
            expect(node.id).toBe('fake-node');
        });
    }));

});
