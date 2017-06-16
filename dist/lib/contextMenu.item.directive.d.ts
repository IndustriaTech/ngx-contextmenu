import { ContextMenuComponent } from './contextMenu.component';
import { EventEmitter, TemplateRef } from '@angular/core';
export declare class ContextMenuItemDirective {
    template: TemplateRef<{
        item: any;
    }>;
    subMenu: ContextMenuComponent;
    divider: boolean;
    enabled: boolean | ((item: any) => boolean);
    passive: boolean;
    visible: boolean | ((item: any) => boolean);
    execute: EventEmitter<{
        event: Event;
        item: any;
    }>;
    constructor(template: TemplateRef<{
        item: any;
    }>);
    evaluateIfFunction(value: any, item: any): any;
    triggerExecute(item: any, $event?: MouseEvent): void;
}
