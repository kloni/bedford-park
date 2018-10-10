import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {UtilsService} from '../../../common/utils/utils.service';
import { TimelessIconsPageLayoutComponent } from './timelessIconsPageLayout';

describe('TimelessIconsPageLayoutComponent', () => {
  let component: TimelessIconsPageLayoutComponent;
  let fixture: ComponentFixture<TimelessIconsPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelessIconsPageLayoutComponent ],
      providers: [UtilsService]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.overrideComponent(TimelessIconsPageLayoutComponent, {
      set: {
        template: 'TODO'
      }})
      .createComponent(TimelessIconsPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
