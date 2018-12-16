import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { URL } from '../../../common/url'
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl
} from "@angular/forms";
import { zip } from 'rxjs';
import { OrderService } from '../../../common/services/order.service';


@Component({
    selector: 'order-claim',
    templateUrl: 'order-claim.component.html',
    styleUrls: ['order-claim.component.scss']
})
export class OrderClaimComponent {
    orderClaimList: any[]=[]
    count:number;
    pageindex = 1
    q = {
      max: 10,
      offset: 0
    }
  
    constructor(private http: _HttpClient
      , public _msg: NzMessageService
      , private activedRoute: ActivatedRoute
      , private _orderService: OrderService){
    }
    
    ngOnInit() { 
      this.getData();
    }
    
    getData(){
     this._orderService.getOrderClaimList().subscribe((res:any)=>{
      this.orderClaimList = res
     });
    }
  
    pageIndexChange(pageindex: number) {
      this.q.offset = this.q.max * (pageindex - 1)
      this.getData()
    }
}
