import { ContextMenuComponent } from './';
import { ContextMenuContentComponent } from './contextMenuContent.component';
import { ContextMenuInjectorService } from './contextMenuInjector.service';
import { Subject } from 'rxjs/Subject';
export interface IContextMenuClickEvent {
    contextMenu?: ContextMenuComponent;
    event: MouseEvent;
    parentContextMenu?: ContextMenuContentComponent;
    item: any;
}
export declare class ContextMenuService {
    private contextMenuInjector;
    isDestroyingLeafMenu: boolean;
    show: Subject<IContextMenuClickEvent>;
    triggerClose: Subject<ContextMenuContentComponent>;
    close: Subject<Event>;
    constructor(contextMenuInjector: ContextMenuInjectorService);
    destroyLeafMenu(): void;
}
