import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { HotelService } from '../../../common/services/hotel.service';
@Component({
  selector: 'hotel-list',
  templateUrl: 'hotel-list.component.html',
  styleUrls: ['hotel.component.scss']
})
export class HotelListComponent implements OnInit {
  hotelList: any[] = [];
  count: number;
  pageindex = 1;
  q: any = {
    offset: 0,
    max: 10
  };
  loading = true;
  constructor(private router: Router
    , private _msg: NzMessageService
    , private _HotelService: HotelService) {

  }
  ngOnInit() {
    this.getList();
  }
  getList() {
    this.loading = true;
    this._HotelService.getHotelList(this.q).subscribe((res: any) => {
      this.hotelList = res.hotelList;
      this.count = res.hotelCount;
      this.loading = false;
    });
  }
  // 进入新增/编辑界面
  edit(i) {
    this.router.navigateByUrl(`/hotel/edit/` + i.id);
  }
  pageIndexChange(pageindex: number) {
    this.q.offset = this.q.max * (pageindex - 1);
    this.getList();
  }

  deleteHotel(i) {
    this._HotelService.deleteHotel(i.id).subscribe(res => {
      this._msg.success(`删除成功！`);
      this.getList();
    });
  }
}
