import { Pipe, PipeTransform } from '@angular/core';
import { CityCascsdeService } from '../city/city-cascsde.service';


@Pipe({ name: '_zones' })
export class ZonesPipe implements PipeTransform {

  showDate:any[]=[]
  constructor(private _cityService: CityCascsdeService) {

  }
  transform(value): any {
    this.showDate = [];
    if(value === undefined) {
      return ""
    }
    if (value.length === 0) {
      return "全国"
    }else{
      let code = this._cityService.getCode(value);
      let provinceList = this._cityService.getCityCascsde()
      code.forEach((c:String)=>{
        let cityList = []
        let areaList = []
        if(c.length === 2) {
        this.showDate.push(provinceList.find(p => p.code === c).name)

        }else if(c.length === 4) {
          let province = provinceList.find(p => p.code === c.substring(0,2)).name
          cityList = provinceList.find(p => p.code === c.substring(0,2)).children
          let city =  cityList.find(city => city.code === c).name
          this.showDate.push(province+'-'+city)
        }else if(c.length === 6) {
          let province = provinceList.find(p => p.code === c.substring(0,2)).name
          cityList = provinceList.find(p => p.code === c.substring(0,2)).children
          let city =  cityList.find(city => city.code === c.substring(0,4)).name
          areaList = cityList.find(city => city.code === c.substring(0,4)).children
          let area = areaList.find(a=> a.code === c).name
          this.showDate.push(province+'-'+city+'-'+area)
        }
      })
      return this.showDate
    }
  }
}