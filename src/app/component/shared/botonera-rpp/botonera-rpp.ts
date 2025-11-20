import { Component, EventEmitter, Input, Output } from '@angular/core';
import { rpp } from '../../../environment/environment';

@Component({
    selector: 'app-botonera-rpp',
    imports: [],
    templateUrl: './botonera-rpp.html',
    styleUrl: './botonera-rpp.css',
})
export class BotoneraRpp {

    @Input() numRpp: number = 5;
    @Input() options: number[] = rpp;
    @Output() rppChange = new EventEmitter<number>();

    setRpp(n: number) {
        this.numRpp = n;
        this.rppChange.emit(this.numRpp);
        return false;
    }

}
