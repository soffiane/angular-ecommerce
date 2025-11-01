import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../model/cart-item';

@Component({
  selector: 'app-cart-detail',
  standalone: false,
  templateUrl: './cart-detail.html',
  styleUrl: './cart-detail.css'
})
export class CartDetail implements OnInit {

  cartItems : CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  ngOnInit(): void {
   this.loadCartItems();
  }

  constructor(private cartService: CartService) { 
    
  }


  loadCartItems() {
    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to the cart totalPrice and totalQuantity observables to get latest values
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    //compute totals based on the current cart items
    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addCartItem(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem)
  }

  remove(theCartItem: CartItem) {
    this.cartService.clearCartItem(theCartItem);
  }
}
