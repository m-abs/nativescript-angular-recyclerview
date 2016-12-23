import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-items',
    templateUrl: 'items.component.html',
    styles : [`
        .item {
            border-width: 1;
            border-color: black;
            min-height: 100;
        }
    `]
})
export class ItemsComponent implements OnInit {

    public listItems: any[] = [];

    constructor() {
        for (let i = 0; i < 11; i++) {
            this.listItems.push(i);
        }
    }

    ngOnInit() { }
}