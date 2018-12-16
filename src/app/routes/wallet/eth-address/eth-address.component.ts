import { Component,OnInit } from '@angular/core';

@Component({
    selector: 'eth-address',
    templateUrl: 'eth-address.component.html',
    styleUrls: ['eth-address.component.scss']
})
export class EthAddressComponent  implements OnInit{
  nestedTableData = [];
  innerTableData = [];

  ngOnInit() { 
    for (let i = 0; i < 3; ++i) {
    this.nestedTableData.push({
      key       : i,
      owner      : '张三'+i,
      username  : '1234567890'+i,
      createdAt : '2014-12-24 23:12:0'+i,
      expand    : false
      });
    }
  for (let i = 0; i < 3; ++i) {
    this.innerTableData.push({
      key       : i,
      name      : '以太坊账户'+i,
      address   : '1q2w3e4r5t6y7u8i9o'+i
    });
  }
}
}