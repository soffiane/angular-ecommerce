import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../model/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode:boolean = false;

  constructor(private productService: ProductService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Initial load of products
    this.activeRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  /**
   * Subscribe to the observable returned by getProductList()
   */
  listProducts() {
    //keyword est le paramètre de l'url et definit dans app-routing-module.ts
    this.searchMode = this.activeRoute.snapshot.paramMap.has('keyword');
    //recherche par mot clé
    if (this.searchMode) {   
      const keyword: string = this.activeRoute.snapshot.paramMap.get('keyword')!;
      // now search for the products using keyword
      this.productService.searchProducts(keyword).subscribe(
        data => {
          this.products = data;
        }
      );
    } else {
      this.handleListProducts();
    }
    
  }

  handleListProducts() {
     // Lire le categoryId de la route. 
    const hasCategoryId: boolean = this.activeRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol 
      //le ! serve a indiquer a typescript que l'on est sur que la valeur n'est pas nulle
      this.currentCategoryId = +this.activeRoute.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.activeRoute.snapshot.paramMap.get('name')!;
    }     
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    ); 
  }
}
