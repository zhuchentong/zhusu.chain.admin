import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
    selector: '[ShowImgOrder]'
})
export class ShowImgOrderDirective {
    constructor(private elem: ElementRef, private renderer2: Renderer2) {}

    @HostListener('mouseenter')
    onMouseEnter() {
        let div_arrow_left = this.elem.nativeElement.querySelector('.arrow-left');
        if(div_arrow_left){
            div_arrow_left.style.display = 'block'
        }
        let div_arrow_right = this.elem.nativeElement.querySelector('.arrow-right');
        if(div_arrow_right){
            div_arrow_right.style.display = 'block'
        }
    }

    @HostListener('mouseleave')
    onMouseLeave() {
        let div_arrow_left = this.elem.nativeElement.querySelector('.arrow-left');
        if(div_arrow_left){
            div_arrow_left.style.display = 'none'
        }
        let div_arrow_right = this.elem.nativeElement.querySelector('.arrow-right');
        if(div_arrow_right){
            div_arrow_right.style.display = 'none'
        }
    }
}