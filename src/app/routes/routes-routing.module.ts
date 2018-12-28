import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages

import { WorkplaceComponent } from './dashboard/workplace.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';

import { CallbackComponent } from './callback/callback.component';
import { Exception403Component } from './exception/403.component';
import { Exception404Component } from './exception/404.component';
import { Exception500Component } from './exception/500.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ProfileComponent } from './profile/profile.component';
import { HotelComponent } from './hotel/hotel/hotel.component';
import { PostComponent } from './post/post.component';
import { SysOrderComponent } from './orders/sys-order/sys-order.component';
import { EthAddressComponent } from './wallet/eth-address/eth-address.component';
import { WalletComponent } from './wallet/wallet/wallet.component';
import { TagComponent } from './hotel/tag/tag.component';
import { HotelEditComponent } from './hotel/hotel/edit/hotel-edit.component';
import { SettingsComponent } from './settings/settings.component';
import { CommentComponent } from './comment/comment.component';
const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: WorkplaceComponent },
      { path: 'user', component: UserComponent, data: { title: '用户' } },
      { path: 'role', component: RoleComponent, data: { title: '角色' } },
      { path: 'profile', component: ProfileComponent },
      { path: 'hotel', component: HotelComponent },
      { path: 'hotel/edit/:id', component: HotelEditComponent, data: { title: '酒店/民宿' } },
      { path: 'post', component: PostComponent },
      { path: 'sysorder', component: SysOrderComponent },
      { path: 'eth-address', component: EthAddressComponent, data: { title: '平台钱包' } },
      { path: 'tag', component: TagComponent, data: { title: '标签管理' } },
      { path: 'wallet', component: WalletComponent, data: { title: '钱包' } },
      { path: 'settings', component: SettingsComponent, data: { title: '系统设置' } },
      { path: 'comment', component: CommentComponent, data: { title: '评论管理' } }
    ],
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'pro-login' },
      }
    ],
  },
  { path: '403', component: Exception403Component },
  { path: '404', component: Exception404Component },
  { path: '500', component: Exception500Component },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
