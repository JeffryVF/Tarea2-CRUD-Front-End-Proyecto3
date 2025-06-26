import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { ModalService } from "../../services/modal.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "../../services/product.service";
import { ProductListComponent } from "../../components/products/product-list/product-list.component";
import { IProduct } from "../../interfaces";
import { ProductFormComponent } from "../../components/products/product-form/product-form.component";
import { CategoriesService } from "../../services/categories.service";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    PaginationComponent,
    ModalComponent,
    ProductListComponent,
    ProductFormComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  public productService: ProductService = inject(ProductService);
  public categoryService: CategoriesService = inject(CategoriesService);
  public modalService: ModalService = inject(ModalService);
  public fb: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  public areActionsAvailable: boolean = false;
  public route: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('addProductsModal') public addProductsModal: any;
  public title: string = 'Products';
  public productForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    stock: ['', Validators.required],
    category: ['', Validators.required],
  })

  ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe(data => {
      this.areActionsAvailable = this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []);
    });
  }

  constructor() {
    this.productService.getAll();
    this.categoryService.getAll();
  }

  saveProduct(item: IProduct) {
    this.productService.save(item);
    this.modalService.closeAll();
  }

  updateProduct(item: IProduct) {
    this.productService.update(item);
    this.modalService.closeAll();
  }

  callEdition(item: IProduct) {
    this.productForm.controls['id'].setValue(item.id ? JSON.stringify(item.id) : '');
    this.productForm.controls['name'].setValue(item.name ? item.name : '');
    this.productForm.controls['description'].setValue(item.description ? item.description : '');
    this.productForm.controls['price'].setValue(item.price ? JSON.stringify(item.price) : '');
    this.productForm.controls['stock'].setValue(item.stock ? JSON.stringify(item.stock) : '');
    this.productForm.controls['category'].setValue(item.category?.id ? JSON.stringify(item.category.id) : '');
    this.modalService.displayModal('md', this.addProductsModal);
  }

  deleteProduct(item: IProduct) {
    this.productService.delete(item);
  }

  openModal() {
    this.productForm.reset();
    this.modalService.displayModal('md', this.addProductsModal);
  }
}
