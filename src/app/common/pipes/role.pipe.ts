import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: '_role' })
export class RolePipe implements PipeTransform {
  transform(status): string {
    let result = ''
    switch (status) {
        case 'ROLE_ADMIN':
            result = '管理员'
            break
        case 'ROLE_KF':
            result = '客服'
            break
        case 'ROLE_BUYER':
            result = '买家'
            break
        case 'ROLE_SELLER':
            result = '供应商'
            break
        default:
            result = '未知'
            break
    }
    return result;
}
}