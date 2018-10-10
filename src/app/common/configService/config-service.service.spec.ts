/*******************************************************************************
 * Copyright IBM Corp. 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
import { TestBed, inject } from '@angular/core/testing';

import { ConfigServiceService } from './config-service.service';
import {HttpModule, Http} from '@angular/http';
import {WchInfoService} from 'ibm-wch-sdk-ng';

describe('ConfigServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
          ConfigServiceService,
          {
              provide: WchInfoService, useClass: MockWchInfoService
          }
      ]
    });
  });

  it('should be created', inject([ConfigServiceService], (service: ConfigServiceService) => {
    expect(service).toBeTruthy();
  }));
});

export class MockWchInfoService{
    apiUrl: URL;
    deliveryUrl: URL;
    isPreviewMode: boolean;
    baseUrl?: URL;
    constructor(){}
}