import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestiService } from './resti.service';

export * from './resti.service';
export * from './resti.call';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class NgResti {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgResti,
      providers: [RestiService]
    };
  }
}
