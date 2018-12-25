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

  constructor(private router: Router) {

  }
  
  clickExtraTemplate(type) {
    if (type === 'tag') {
      this.router.navigateByUrl(`/tag`);
    } 
  }
}
