import { Component, HostListener } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'header-storage',
  template: `
  <i class="anticon anticon-tool"></i>
  {{ 'clear-local-storage' | translate}}
  `,
  host: {
    '[class.d-block]': 'true',
  },
})
export class HeaderStorageComponent {
  constructor(
    private confirmServ: NzModalService,
    private messageServ: NzMessageService,
  ) {}

  @HostListener('click')
  _click() {
    this.confirmServ.confirm({
      nzTitle: '确定清除缓存？',
      nzOnOk: () => {
        localStorage.clear();
        this.messageServ.success('清除缓存完成!');
      },
    });
  }
}
