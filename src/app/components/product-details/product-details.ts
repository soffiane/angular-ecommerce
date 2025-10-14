import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../model/product';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {

  product!: Product;
  
  ngOnInit(): void {
      this.route.paramMap.subscribe(() => { 
        this.handleProductDetails();
      });
  }

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  handleProductDetails() {
    // get the "id" param string. convert string to a number using the "+" symbol 
    //le ?? 0 sert a indiquer a typescript que si la valeur est nulle on met 0
    const theProductId: number = +(this.route.snapshot.paramMap.get('id') ?? 0);

    this.productService.getProduct(theProductId).subscribe(
      data => {
        console.log('Product Details=' + JSON.stringify(data));
        this.product = data;
      } 
    );
  }

  

}
