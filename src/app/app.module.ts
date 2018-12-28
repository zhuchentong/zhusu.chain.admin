import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector } from '@angular/core';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule,
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DelonModule } from './delon.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { SimpleInterceptor } from '@delon/auth';
// angular i18n
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh';
registerLocaleData(localeZh);
// i18n
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
// third
import { UEditorModule } from 'ngx-ueditor';
import { NgxTinymceModule } from 'ngx-tinymce';
// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import { DatePipe } from '@angular/common';
import { RegularService } from './common/services/regular.service';
import { ChangeImgOrderService } from './common/services/change-img-order.service';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { HotelService } from './common/services/hotel.service';
import { UserService } from './common/services/user.service';
import { CityCascsdeService } from './common/city/city-cascsde.service';
import { PostService } from './common/services/post.service';
import { OssService } from './common/services/oss.service';
import { OrderService } from './common/services/order.service';
import { WalletService } from './common/services/wallet.service';
import { CommonService } from './common/services/common.service';
import { EmitService } from './common/services/emit.service';
import { EditorMdDirective } from './common/editor/editor-md.directive';
import { CommentService } from './common/services/comment.service';

// 加载i18n语言文件
export function I18nHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `assets/source/i18n/`, '.json');
}

export function StartupServiceFactory(
  startupService: StartupService,
): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent,
    EditorMdDirective],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    LMarkdownEditorModule,
    // i18n
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: I18nHttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    // thirds
    UEditorModule.forRoot({
      // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
      js: [
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`,
        `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`,
      ],
      options: {
        UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`,
      },
    }),
    NgxTinymceModule.forRoot({
      baseURL: '//cdn.bootcss.com/tinymce/4.7.4/',
    }),
    // JSON-Schema form
    JsonSchemaModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false },
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true,
    },
    DatePipe,
    RegularService,
    ChangeImgOrderService,
    HotelService,
    UserService,
    CityCascsdeService,
    PostService,
    OssService,
    OrderService,
    WalletService,
    CommonService,
    EmitService,
    CommentService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
