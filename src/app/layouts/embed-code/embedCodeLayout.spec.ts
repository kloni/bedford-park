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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmbedCodeLayoutComponent } from './embedCodeLayout';
import { UtilsService } from '../../common/utils/utils.service';
import { FormattedTextPipe } from "app/common/formattedtext/formatted-text.pipe";
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { TypeEmbedCodeComponent } from './../../components/embed-code/typeEmbedCodeComponent';
import { Observable } from 'rxjs/Rx';

declare var __karma__: any;

describe('EmbedCodeLayoutComponent', () => {
  let component: EmbedCodeLayoutComponent;
  let fixture: ComponentFixture<EmbedCodeLayoutComponent>;
  let rContextMock: any = {
    id: 15,
    elements:
    {
      text: {
        height: '100',
        width: '100'
      }
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmbedCodeLayoutComponent, FormattedTextPipe],
      providers: [UtilsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    __karma__.config.testGroup = '';
    fixture = TestBed.createComponent(EmbedCodeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to initialze snippet element', () => {
    const tmp = document.createElement('snippet');

    component.snippetElem = { "nativeElement": tmp };

    component.ngAfterViewInit();


  });

  it('should be able to resize iFrame', () => {

    component.snippetElem = { "nativeElement": { "contentDocument": { "documentElement": { "scrollHeight": "90" } } } };

    component.resizeIFrame();

    expect(component.iframeHeight).toContain("90");
    expect(component.iframeWidth).toContain("100");

  });

  it('should be able to subscribe to observables', () => {

    component.renderingContext = rContextMock;
    expect(component.iframeHeight).toContain("100");
    expect(component.iframeWidth).toContain("100");
  });

});
