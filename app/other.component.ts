import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-other',
    template: `
        <StackLayout>
            <Label text="other"></Label>
        </StackLayout>
    `,
    styles : [`
    Label {
        border-width:1;
        border-color: red
    }
    `]
})
export class OtherComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}