import { CONTEXT_MENU_OPTIONS } from './contextMenu.options';
import { ContextMenuService } from './contextMenu.service';
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, Optional, Renderer, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
var ContextMenuContentComponent = (function () {
    function ContextMenuContentComponent(_contextMenuService, changeDetector, elementRef, options, renderer) {
        this._contextMenuService = _contextMenuService;
        this.changeDetector = changeDetector;
        this.elementRef = elementRef;
        this.options = options;
        this.renderer = renderer;
        this.menuItems = [];
        this.autoFocus = false;
        this.useBootstrap4 = false;
        this.isShown = false;
        this.isOpening = false;
        this.mouseLocation = { left: '0px', top: '0px' };
        this.subscription = new Subscription();
        if (options) {
            this.autoFocus = options.autoFocus;
            this.useBootstrap4 = options.useBootstrap4;
        }
    }
    ContextMenuContentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isOpening = true;
        setTimeout(function () { return _this.isOpening = false; }, 400);
        if (this.menuItems) {
            // Declarative context menu
            setTimeout(function () {
                if (_this.menuItems.length > 0) {
                    _this.showMenu();
                }
                else {
                    _this.hideMenu();
                }
                setTimeout(function () {
                    var menuWidth = _this.menuElement ? _this.menuElement.nativeElement.clientWidth : 100;
                    var menuHeight = _this.menuElement ? _this.menuElement.nativeElement.clientHeight : 100;
                    var bodyWidth = _this.event.view.document.body.clientWidth;
                    var bodyHeight = _this.event.view.document.body.clientHeight;
                    var distanceFromRight = bodyWidth - (_this.event.clientX + menuWidth);
                    var distanceFromBottom = bodyHeight - (_this.event.clientY + menuHeight);
                    var isMenuOutsideBody = false;
                    if (distanceFromRight < 0 && _this.event.clientX > bodyWidth / 2) {
                        _this.mouseLocation.marginLeft = '-' + menuWidth + 'px';
                        if (_this.parentContextMenu) {
                            _this.mouseLocation.marginLeft = '-' + (menuWidth + _this.parentContextMenu.menuElement.nativeElement.clientWidth) + 'px';
                        }
                        isMenuOutsideBody = true;
                    }
                    if (distanceFromBottom < 0 && _this.event.clientY > bodyHeight / 2) {
                        _this.mouseLocation.marginTop = '-' + menuHeight + 'px';
                        isMenuOutsideBody = true;
                    }
                    if (isMenuOutsideBody) {
                        _this.showMenu();
                    }
                });
            });
        }
        else {
            this.hideMenu();
        }
        this.mouseLocation = {
            left: this.event.clientX + 'px',
            top: this.event.clientY + 'px',
        };
        this.menuItems.forEach(function (menuItem) {
            _this.subscription.add(menuItem.execute.subscribe(function () { return _this.hideMenu(undefined, true); }));
        });
    };
    ContextMenuContentComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.autoFocus) {
            setTimeout(function () { return _this.focus(); });
        }
    };
    ContextMenuContentComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    ContextMenuContentComponent.prototype.focus = function () {
        if (this.autoFocus) {
            this.menuElement.nativeElement.focus();
        }
    };
    ContextMenuContentComponent.prototype.stopEvent = function ($event) {
        $event.stopPropagation();
    };
    Object.defineProperty(ContextMenuContentComponent.prototype, "locationCss", {
        get: function () {
            return {
                'position': 'fixed',
                'display': this.isShown ? 'block' : 'none',
                left: this.mouseLocation.left,
                marginLeft: this.mouseLocation.marginLeft,
                marginTop: this.mouseLocation.marginTop,
                top: this.mouseLocation.top,
            };
        },
        enumerable: true,
        configurable: true
    });
    ContextMenuContentComponent.prototype.clickedOutside = function () {
        if (!this.isOpening) {
            this.hideMenu();
        }
    };
    ContextMenuContentComponent.prototype.isMenuItemEnabled = function (menuItem) {
        return this.evaluateIfFunction(menuItem.enabled);
    };
    ContextMenuContentComponent.prototype.isMenuItemVisible = function (menuItem) {
        return this.evaluateIfFunction(menuItem.visible);
    };
    ContextMenuContentComponent.prototype.evaluateIfFunction = function (value) {
        if (value instanceof Function) {
            return value(this.item);
        }
        return value;
    };
    ContextMenuContentComponent.prototype.isDisabled = function (link) {
        return link.enabled && !link.enabled(this.item);
    };
    ContextMenuContentComponent.prototype.showMenu = function () {
        this.isShown = true;
        this.changeDetector.markForCheck();
    };
    ContextMenuContentComponent.prototype.hideMenu = function (event, hideAll) {
        if (this.isShown === true) {
            this._contextMenuService.close.next(event);
        }
        if (hideAll) {
            this._contextMenuService.triggerClose.next(undefined);
        }
        this.isShown = false;
        this.changeDetector.markForCheck();
    };
    ContextMenuContentComponent.prototype.openSubMenu = function (menuItem, event) {
        this._contextMenuService.triggerClose.next(this);
        if (!menuItem.subMenu) {
            return;
        }
        var rect = event.target.getBoundingClientRect();
        var newEvent = Object.assign({}, event, { clientX: rect.right, clientY: rect.top, view: event.view });
        this._contextMenuService.show.next({
            contextMenu: menuItem.subMenu,
            item: this.item,
            event: newEvent,
            parentContextMenu: this,
        });
    };
    ContextMenuContentComponent.prototype.onMenuItemSelect = function (menuItem, event) {
        event.preventDefault();
        this.openSubMenu(menuItem, event);
        if (!menuItem.subMenu) {
            menuItem.triggerExecute(this.item, event);
        }
    };
    return ContextMenuContentComponent;
}());
export { ContextMenuContentComponent };
ContextMenuContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'context-menu-content',
                styles: [
                    ".passive {\n       display: block;\n       padding: 3px 20px;\n       clear: both;\n       font-weight: normal;\n       line-height: @line-height-base;\n       white-space: nowrap;\n     }",
                    ".hasSubMenu:after {\n      content: \"\u25B6\";\n      float: right;\n    }",
                ],
                template: "<div class=\"dropdown ngx-contextmenu\" tabindex=\"0\">\n        <ul #menu [ngStyle]=\"locationCss\" class=\"dropdown-menu\" tabindex=\"0\">\n        <li *ngFor=\"let menuItem of menuItems\" [class.disabled]=\"!isMenuItemEnabled(menuItem)\"\n            [class.divider]=\"menuItem.divider\" [class.dropdown-divider]=\"useBootstrap4 && menuItem.divider\"\n            [attr.role]=\"menuItem.divider ? 'separator' : undefined\">\n          <span *ngIf=\"!menuItem.divider && !menuItem.passive\" [class.dropdown-item]=\"useBootstrap4\"\n            [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\" [class.hasSubMenu]=\"!!menuItem.subMenu\"\n            (click)=\"onMenuItemSelect(menuItem, $event)\" (mouseenter)=\"openSubMenu(menuItem, $event)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </span>\n\n          <span (click)=\"stopEvent($event)\" (contextmenu)=\"stopEvent($event)\" class=\"passive\"\n                *ngIf=\"!menuItem.divider && menuItem.passive\" [class.dropdown-item]=\"useBootstrap4\"\n                [class.disabled]=\"useBootstrap4 && !isMenuItemEnabled(menuItem)\">\n            <ng-template [ngTemplateOutlet]=\"menuItem.template\" [ngOutletContext]=\"{ $implicit: item }\"></ng-template>\n          </span>\n        </li>\n      </ul>\n    </div>\n  ",
            },] },
];
/** @nocollapse */
ContextMenuContentComponent.ctorParameters = function () { return [
    { type: ContextMenuService, },
    { type: ChangeDetectorRef, },
    { type: ElementRef, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [CONTEXT_MENU_OPTIONS,] },] },
    { type: Renderer, },
]; };
ContextMenuContentComponent.propDecorators = {
    'menuItems': [{ type: Input },],
    'item': [{ type: Input },],
    'event': [{ type: Input },],
    'parentContextMenu': [{ type: Input },],
    'menuElement': [{ type: ViewChild, args: ['menu',] },],
    'clickedOutside': [{ type: HostListener, args: ['document:click',] }, { type: HostListener, args: ['document:contextmenu',] },],
    'hideMenu': [{ type: HostListener, args: ['window:scroll',] }, { type: HostListener, args: ['window:resize',] },],
};
//# sourceMappingURL=contextMenuContent.component.js.map