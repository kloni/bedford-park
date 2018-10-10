import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { LoggerOptions } from './logger.options';
import { CategoryViewService } from "../services/rest/search/categoryView.service";
import { Logger } from "angular2-logger/core";
import { CategoryService } from "../services/category.service";
import { ActivePageService } from 'ibm-wch-sdk-ng';
import { Router } from "@angular/router";
import { MockRouter } from 'mocks/angular-class/router';
import { CommonTestModule } from "app/commerce/common/common.test.module";

declare var __karma__: any;

describe('LoggerOptions', () => {

    let loggerOptions: any;
    let logger: Logger;
    let categoryService: CategoryService;

    beforeEach(() => {

        // use mock service for dependency
        TestBed.configureTestingModule({
            imports: [ CommonTestModule, HttpClientModule, HttpModule, TranslateModule.forRoot({
              loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
             ],
            providers: [
                Logger,
                CategoryService,
                CategoryViewService,
                LoggerOptions,
                ActivePageService, 
                { provide: Router, useClass: MockRouter }
            ]
        });
        __karma__.config.testGroup = '';
    });

    beforeEach(inject([LoggerOptions, Logger, CategoryService], (_loggerOptions: LoggerOptions, _logger: Logger, _categoryService: CategoryService) => {

        loggerOptions = _loggerOptions;
        logger = _logger;
        categoryService = _categoryService;
        __karma__.config.testGroup = "";
    }));

    it('should instantiate', () => {

        // instatiation test case
        expect(loggerOptions).toBeTruthy();

    });

    it('expect output from logger to show that Search Service is invoked', async(() => {

        __karma__.config.testGroup = "";

        //use spy to see if logger.debug() is called when SearchService.invokeService is called via categoryService
        spyOn(logger, 'debug');
        categoryService.top("1", "10201").then(response => {
            expect(logger.debug).toHaveBeenCalled();
        });

    }))

    it('expect output from logger to show that Search Service handles error', async(() => {

        //change __karma__.config.testGroup to make categoryService to get incorrect mock data and force error for catch block path
        __karma__.config.testGroup = "test";

        //use spy to see if logger.info() is called when SearchService.handleError() is called via categoryService
        spyOn(logger, 'info');
        categoryService.top("1", "10201").then(response => {
            fail();
        }).catch(err => {
            expect((logger.info)).toHaveBeenCalled();
        })

    }))

});
