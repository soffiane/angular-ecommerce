import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../model/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../model/cart-item';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  previousKeyword: string = "";
  currentCategoryName: string = "";
  searchMode: boolean = false;

  //new pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  //cart
  

  constructor(private productService: ProductService, private cartService: CartService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Initial load of products
    this.activeRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  /**
   * Subscribe to the observable returned by getProductList()
   */
  listProducts() {
    //keyword est le paramètre de l'url et definit dans app-routing-module.ts
    this.searchMode = this.activeRoute.snapshot.paramMap.has('keyword');
    //recherche par mot clé
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }
  handleSearchProducts() {
    const keyword: string = this.activeRoute.snapshot.paramMap.get('keyword')!;
    //si on change de keyword, on repart a la page 1
    if (this.previousKeyword != keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;
    // now search for the products using keyword
    this.productService.searchProductsPaginate(keyword, this.thePageNumber - 1, this.thePageSize).subscribe(
      this.processResults()
    );
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
    //check if we have a different category than previous
    //Note: Angular will reuse a component if it is currently being viewed
    //if we have a different category id than previous
    //then set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.currentCategoryId,
      this.thePageNumber - 1,
      this.thePageSize).subscribe(
        this.processResults()
      );
  }

  processResults() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(product: Product) {
    const theCartItem = new CartItem(product);
    console.log(`Adding to cart: ${theCartItem.name}, ${theCartItem.unitPrice}`);
    //ajout de l'élément au service de gestion du panier
    this.cartService.addCartItem(theCartItem);
  }
  /*this.productService.getProductList(this.currentCategoryId).subscribe(
    data => {
      this.products = data;
    }
  ); 
}*/
}
