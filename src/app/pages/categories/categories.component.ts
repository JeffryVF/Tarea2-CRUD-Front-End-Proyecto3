import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ICategory } from '../../interfaces';
import { CategoriesListComponent } from '../../components/categories/categories-list/categories-list.component';
import { CategoriesService } from '../../services/categories.service';
import { CategoriesFormComponent } from "../../components/categories/categories-form/categories-form.component";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    CategoriesListComponent,
    CategoriesFormComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public categoriesService: CategoriesService = inject(CategoriesService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('addCategoriesModal') public addCategoriesModal: any;
  public title: string = 'Categories';
  public categoriesForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
  })

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe(data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }

  constructor() {
    this.categoriesService.getAll();
  }

  saveCategory(item: ICategory) {
    this.categoriesService.save(item);
    this.modalService.closeAll();
  }

  updateCategory(item: ICategory) {
    this.categoriesService.update(item);
    this.modalService.closeAll();
  }

  callEdition(item: ICategory) {
    this.categoriesForm.controls['id'].setValue(item.id ? JSON.stringify(item.id) : '');
    this.categoriesForm.controls['name'].setValue(item.name ? item.name : '');
    this.categoriesForm.controls['description'].setValue(item.description ? item.description : '');
    this.modalService.displayModal('md', this.addCategoriesModal);
  }

  deleteCategory(item: ICategory) {
    this.categoriesService.delete(item);
  }

  openModal() {
    this.categoriesForm.reset();
    this.modalService.displayModal('md', this.addCategoriesModal);
  }
}
