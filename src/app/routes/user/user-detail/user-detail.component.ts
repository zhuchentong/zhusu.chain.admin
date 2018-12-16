import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder
} from "@angular/forms";
import { UserService } from '../../../common/services/user.service';
import { EmitService } from '../../../common/services/emit.service';
@Component({
  selector: 'user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  @Input() userId: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();


  userType: any;  //ROLE_KF ROLE_BUYER ROLE_SELLER

  user_isVisible = false
  seller_isVisible = false
  modalTitle: string
  user:any

  statusMap: any;
  isShow:boolean;
  subject: any;
  constructor(private http: _HttpClient
    , private fb: FormBuilder
    , public _msg: NzMessageService
    , private activedRoute: ActivatedRoute
    , private _userService: UserService
    ,private _emitService: EmitService
    , private router: Router) {
    this.initUser()
    this.statusMap = { 'CREATED': '待审核', 'ACCEPTED': '已同意', 'REFUSED': '已拒绝' };
    this.isShow = false;
    this.subject = this._emitService.eventEmit.subscribe((value: any) => {
      if(value.type === 'userDetail'){
        this.isShow = true;
        this.userId = value.id
        this.getData();
      }
   });

  }

  ngOnInit() {
  }
 

  getData() {
    this._userService.getUser(this.userId).subscribe((res:any)=>{
      console.log(res)
      this.user = res;
    })
  }

  initUser() {
    this.user = {
      username: '',
      displayName: '',
      role: [],
      invitedBy: null, //邀请人
      //买家
      buyerPoint:'',  //买家信用分
      buyerRank:'',   //买家排名
      paymentRate: '', //付款及时率
      buyerBreachRate:'',// 买家违约率
  
      //卖家
      sellerPoint:'',  //供应商信用分
      sellerRank:'',  // 供应商排名
      deliveryRate:'',//供货及时率
      sellerBreachRate:'', //供应商违约率
      saleZones:null
    };
  }

  handleCancel(): void {
    this.initUser();
    this.isShow = false;
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }
}