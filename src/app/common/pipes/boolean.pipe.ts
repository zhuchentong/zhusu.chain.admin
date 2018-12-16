import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: '_Boolean' })
export class BooleanPipe implements PipeTransform {
  transform(value): string {
    if (value) {
      
      return `√`;
    }else{
      return `×`;
    }
  }
}