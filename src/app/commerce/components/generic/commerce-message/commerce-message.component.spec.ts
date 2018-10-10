import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommerceMessageComponent } from './commerce-message.component';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

declare var __karma__: any;
describe('CommerceMessageComponent', () => {
  let component: CommerceMessageComponent;
  let fixture: ComponentFixture<CommerceMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommerceMessageComponent ],
      imports: [TranslateModule.forRoot({
        loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }}),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommerceMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
