import { Component, OnInit, OnDestroy } from '@angular/core';
import { zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { getTimeDistance, yuan } from '@delon/util';
import { _HttpClient } from '@delon/theme';
import { URL } from '../../common/url';
import { format } from 'date-fns';
@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less'],
})
export class WorkplaceComponent implements OnInit, OnDestroy {

  constructor(private http: _HttpClient, public msg: NzMessageService) { }

  data = {
    visitData: []
  };

  hotelCount = 0;  // 商品数
  orderCount = 0 ; // 订单数
  salerCount = 0 ;  // 供应商数
  userCount = 0 ;  // 用户数

  postCount = 0;
  postList: any[] = [];
  orderFeeList: any[] = [];
  sellerApplicationList: any[] = [];
  orderFeeCount = 0;
  sellerApplicationCount = 0;
  ngOnInit() {
    const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
    const beginDay = new Date().getTime();
    for (let i = 0; i < fakeY.length; i += 1) {
      this.data.visitData.push({
        x: format(new Date(beginDay + 1000 * 60 * 60 * 24 * i), 'YYYY-MM-DD'),
        y: fakeY[i],
      });
    }
    zip(
      this.http.get(URL.POST, { offset: 0, max: 5, status: 'DRAFT' }),
      this.http.get(URL.SELLERAPPLICATION, { offset: 0, max: 5 }),
      this.http.get(URL.USER, { offset: 0, max: 1 }),
      this.http.get(URL.HOTEL, { offset: 0, max: 1 }),
      this.http.get(URL.USER, { offset: 0, max: 1, role: 'ROLE_SELLER' }),
      this.http.get(URL.ORDER, { offset: 0, max: 1 })
    ).subscribe(([postRes, sellerApplicationRes, userRes, hotelRes, salerRes, orderRes]: [any, any, any, any, any, any]) => {
      this.postList = postRes.postList;
      this.postCount = postRes.postCount;
      this.sellerApplicationList = sellerApplicationRes.sellerApplicationList;
      this.sellerApplicationCount = sellerApplicationRes.sellerApplicationCount;
      this.userCount = userRes.userCount;
      this.hotelCount = hotelRes.hotelCount;
      this.salerCount = salerRes.userCount;
      this.orderCount = orderRes.orderCount;
    });

  }
  ngOnDestroy(): void { }
}
