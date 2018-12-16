import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar class="mr-sm"  nzSize="small" nzIcon="anticon anticon-user" ></nz-avatar>
      {{settings.user.email}}
    </div>
    <div nz-menu class="width-sm">
      <!-- <div nz-menu-item (click)="gotoprofile()"><i class="anticon anticon-user mr-sm"></i>个人中心</div>
       <li nz-menu-divider></li> -->
      <div nz-menu-item (click)="logout()"><i class="anticon anticon-setting mr-sm"></i>退出系统</div>
    </div>
  </nz-dropdown>
  `,
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  logout() {
    sessionStorage.removeItem('currentUser')
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }
  gotoprofile(){
    this.router.navigateByUrl('/profile')
  }
}
