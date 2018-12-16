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
import { UserService } from '../../../common/services/user.service';

@Component({
    selector: 'order-fee',
    templateUrl: 'order-fee.component.html',
    styleUrls: ['order-fee.component.scss']
})
export class OrderFeeComponent implements OnInit{
  
 
  orderFeeList: any[]=[]
  count:number;
  pageindex = 1
  q = {
    max: 10,
    offset: 0,
    sellerId: null,
    isPaid: null
  }
  statusList:any[]=[]
  constructor(private http: _HttpClient
    , public _msg: NzMessageService
    , private activedRoute: ActivatedRoute
    , private _orderService: OrderService
    , private _userService: UserService){
      this.statusList = [
        { label: '全部', value: '' },
        { label: '已支付', value: true },
        { label: '未支付', value: false }
    ];
  }
  userList:any[]=[];
  ngOnInit() { 
    this.getSellerList()
    this.activedRoute.queryParams.subscribe(params => {
        console.log(params);
        if(params.sellerId){
          this.q.sellerId = parseInt(params.sellerId)
        }
      });
      this.q.isPaid = false
      this.getData();
  }
  
  selectStatus() {
    this.pageindex = 1
    this.q.offset = 0
    this.getData();
  }
  getData(){
  if(!this.q.sellerId){
      this.q.sellerId = ''
   }
   this._orderService.getOrderFeeList(this.q).subscribe((res:any)=>{
    this.orderFeeList = res.orderFeeList
    this.count = res.orderFeeCount
   });
  }

  pageIndexChange(pageindex: number) {
    this.q.offset = this.q.max * (pageindex - 1)
    this.getData()
  }

  confirm(orderfee) {
    this._orderService.confirmOrderFee(orderfee.id).subscribe(res=>{
      this._msg.success(`确认成功！`);
      this.getData();
    });
  }

  getSellerList() {
    this._userService.getUserList({offset:0,max:100,role:'ROLE_SELLER'}).subscribe((res:any)=>{
      this.userList = [];
      res.userList.forEach(user => {
        this.userList.push({label: user.displayName+"【"+user.username+"】",value: user.id})
      });
    });
  }
}