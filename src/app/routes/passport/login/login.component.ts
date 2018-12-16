import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { URL} from '../../../common/url';
import { _HttpClient } from '@delon/theme';
import {
  SocialService,
  SocialOpenType,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { OssService } from '../../../common/services/oss.service'

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;

  constructor(
    private http: _HttpClient,
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    private ossService: OssService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private startupSrv: StartupService,
  ) {
    this.form = fb.group({
      userName: ['13572209183', [Validators.required, Validators.minLength(5)]],
      password: ['admin', Validators.required]
    });
    modalSrv.closeAll();
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }

  count = 0;
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } 

    this.http.post(URL.LOGIN, { username:this.userName.value,password:this.password.value }).subscribe(         
      (res:any)=> {
         setTimeout(() => {
           this.loading = false;
         }, 500);
         
         
        this.reuseTabService.clear();
        // 设置Token信息
        this.tokenService.set({
          token: res.access_token,
          name:  res.displayName,
          roles: res.roles,
          email: res.username,
          id: 10000,
          time: +new Date(),
        });
        console.log(res)
        sessionStorage.setItem('currentUserId',res.userId)
        //获取OSS SecurityToken
        this.ossService.getSecurityToken().subscribe((res:any)=>{
          console.log(res)
          sessionStorage.setItem('accessKeyId',res.accessKeyId)
          sessionStorage.setItem('dir',res.dir)
          sessionStorage.setItem('expire',res.expire)
          sessionStorage.setItem('host',res.host)
          sessionStorage.setItem('policy',res.policy)
          sessionStorage.setItem('signature',res.signature)
          sessionStorage.setItem('cdnUrl',res.cdnUrl)
        })
        sessionStorage.setItem('userId',res.userId);
        sessionStorage.setItem('token',res.access_token);
      // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
         this.startupSrv.load().then(() => this.router.navigate(['/home']));
       },
       error =>{
         console.log('oops', error)
         this.error = `账户或密码错误`
         this.loading = false;
       });
  }

  

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
