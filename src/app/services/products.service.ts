import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, IProduct, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends BaseService<ICategory> {
  protected override source: string = 'products';
  private productListSignal = signal<ICategory[]>([]);
  get products$() {
    return this.productListSignal;
  }
  public search: ISearch = {
    page: 1,
    size: 5
  }

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.productListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(product: IProduct) {
    this.add(product).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(product: IProduct) {
    this.edit(product.id, product).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(product: IProduct) {
    this.del(product.id).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
