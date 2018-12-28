import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';
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
import { TxLogComponent } from './wallet/tx-log/tx-log.component';
import { WalletComponent } from './wallet/wallet/wallet.component';
import { TagComponent } from './hotel/tag/tag.component';
import { HotelEditComponent } from './hotel/hotel/edit/hotel-edit.component';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { Token } from '@angular/compiler';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { PostDialogComponent } from './post/post-dialog/post-dialog.component';
import { SettingsComponent } from './settings/settings.component';

const COMPONENTS = [
  WorkplaceComponent,
  // passport pages
  UserLoginComponent,
  CallbackComponent,
  Exception403Component,
  Exception404Component,
  Exception500Component,
  UserComponent,
  RoleComponent,
  ProfileComponent,
  HotelComponent,
  PostComponent,
  SysOrderComponent,
  EthAddressComponent,
  TxLogComponent,
  WalletComponent,
  HotelEditComponent,
  TagComponent,
  UserDetailComponent,
  PostDialogComponent,
  SettingsComponent
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule, LMarkdownEditorModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule { }
