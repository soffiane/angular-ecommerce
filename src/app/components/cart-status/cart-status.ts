import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-status',
  standalone: false,
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.css'
})
export class CartStatus implements OnInit{

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { } 

  ngOnInit(): void {
    this.updateCartStatus();
  }

  //on subscribe aux observables du service pour obtenir les mises a jour
  updateCartStatus() {
   this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}
