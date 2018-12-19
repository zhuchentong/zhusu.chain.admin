import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder} from '@angular/forms';
import { UserService } from '../../../common/services/user.service';
import { EmitService } from '../../../common/services/emit.service';
@Component ({
  selector: 'user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  @Input() userId: any;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();


  userType: any;  // ROLE_KF ROLE_BUYER ROLE_SELLER

  modalTitle: string;
  user: any;

  isShow: boolean;
  subject: any;
  constructor(private http: _HttpClient
    , private fb: FormBuilder
    , public _msg: NzMessageService
    , private activedRoute: ActivatedRoute
    , private _userService: UserService
    , private _emitService: EmitService
    , private router: Router) {
    this.initUser();
    this.isShow = false;
    this.subject = this._emitService.eventEmit.subscribe((value: any) => {
      if (value.type === 'userDetail') {
        this.isShow = true;
        this.userId = value.id;
        this.getData();
      }
   });
  }

  ngOnInit() {
  }
 

  getData() {
    this._userService.getUser(this.userId).subscribe((res: any) => {
      console.log(res);
      this.user = res;
    });
  }

  initUser() {
    this.user = {
      username: '',
      displayName: '',
      role: []
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
