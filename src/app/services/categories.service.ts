import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService<ICategory> {
  protected override source: string = 'categories';
  private categoriesSignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categoriesSignal;
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
        this.categoriesSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(category: ICategory) {
    this.add(category).subscribe({
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

  update(category: ICategory) {
    this.edit(category.id, category).subscribe({
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

  delete(category: ICategory) {
    this.del(category.id).subscribe({
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
