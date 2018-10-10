import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {UtilsService} from '../../../common/utils/utils.service';
import { DesignIdeasPageLayoutComponent } from './designIdeasPageLayout';

describe('DesignIdeasPageLayoutComponent', () => {
  let component: DesignIdeasPageLayoutComponent;
  let fixture: ComponentFixture<DesignIdeasPageLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignIdeasPageLayoutComponent ],
      providers: [UtilsService]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.overrideComponent(DesignIdeasPageLayoutComponent, {
      set: {
        template: 'TODO'
      }})
      .createComponent(DesignIdeasPageLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
