import {
  Directive, ElementRef,
  Input, OnDestroy, OnInit, Host, HostBinding
} from '@angular/core';
import { ComponentLoaderFactory, PopoverConfig, PopoverDirective } from 'ngx-bootstrap';
import { NgxBootstrapProductTourService } from './ngx-bootstrap-product-tour.service';
import { IStep } from './ngx-bootstrap-product-tour.models';
import { NgxBootstrapProductTourStepService } from './ngx-bootstrap-product-tour-step/ngx-bootstrap-product-tour-step.service';
import { Router } from '@angular/router';

@Directive({
  selector: '[tourAnchor]'
})
export class NgxBootstrapPopoverDirective extends PopoverDirective {
  triggers = '';
}

@Directive({
  selector: '[tourAnchor]',
})

export class NgxBootstrapProductTourDirective implements OnInit, OnDestroy {
  protected _elementClass: string[] = [];
  @Input() public tourAnchor: string;

  @HostBinding('class.tour-step-backdrop')
  private backdropClass: boolean;

  constructor(private tourService: NgxBootstrapProductTourService,
    private tourStepTemplate: NgxBootstrapProductTourStepService,
    private element: ElementRef,
    @Host() public popoverDirective: NgxBootstrapPopoverDirective,
  ) { }

  public ngOnInit(): void {
    this.tourService.register(this.tourAnchor, this);
  }

  public ngOnDestroy(): void {
    this.tourService.unregister(this.tourAnchor);
  }

  public showTourStep(step: IStep): void {
    this.popoverDirective.popover = this.tourStepTemplate.template;
    this.popoverDirective.popoverTitle = step.title;
    this.popoverDirective.containerClass = step.containerClass ? step.containerClass : '';
    this.popoverDirective.placement = step.placement ? step.placement : 'top';
    this.popoverDirective.container = 'body';
    this.popoverDirective.triggers = '';
    if (step.orphan) {
      this.popoverDirective.containerClass += ' orphan';
    }

    if (step.backdrop && !step.orphan) {
      this.backdropClass = true;
    }
    this.popoverDirective.show();
    if (!step.preventScrolling) {
      (<HTMLElement>this.element.nativeElement).scrollIntoView({ behavior: 'instant', block: 'center', inline: 'nearest' });
    }
  }

  public hideTourStep(): void {
    this.backdropClass = false;
    this.popoverDirective.hide();
  }

  public isOpen(): boolean {
    return this.popoverDirective.isOpen;
  }
}
