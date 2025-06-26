import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategory, IProduct } from '../../../interfaces';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Input() productsList: IProduct[] = [];
  @Input() categoriesList: ICategory[] = [];

  callSave() {
    let item: IProduct = {
      name: this.form.controls['name'].value,
      description: this.form.controls['description'].value,
      price: this.form.controls['price'].value,
      stock: this.form.controls['stock'].value,
      category: { "id": this.form.controls['category'].value }
    }

    if (this.form.controls['id'].value) {
      item.id = this.form.controls['id'].value;
    }
    if (item.id) {
      console.log(item)
      this.callUpdateMethod.emit(item);
    } else {
      this.callSaveMethod.emit(item);
    }

    this.form.reset();
  }
}
