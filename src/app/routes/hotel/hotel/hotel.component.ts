import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotelListComponent } from './hotel-list.component';
@Component({
  selector: 'hotel',
  templateUrl: 'hotel.component.html',
  styleUrls: ['hotel.component.scss']
})
export class HotelComponent {
  @ViewChild('onSaleComponent')
  onSaleComponent: HotelListComponent;
  @ViewChild('downSaleComponent')
  downSaleComponent: HotelListComponent;

  constructor(private router: Router) {

  }

  selectTab(event) {
    if (event === 'on') {
      this.onSaleComponent.tabData(true);
      this.onSaleComponent.hotelList = [];
      this.onSaleComponent.count = 0;
    } else {
      this.downSaleComponent.hotelList = [];
      this.downSaleComponent.count = 0;
      this.downSaleComponent.tabData(false);
    }
  }
  clickExtraTemplate(type) {
    if (type === 'tag') {
      this.router.navigateByUrl(`/tag`);
    } 
  }
}
