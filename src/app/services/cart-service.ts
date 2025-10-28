import { Injectable } from '@angular/core';
import { CartItem } from '../model/cart-item';
import { Subject } from 'rxjs/internal/Subject';
import { BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  // Subject observables to publish cart changes to all the subscribers 
  //ReplaySubject permet de stocker une valeur et de la renvoyer aux nouveaux abonnés
  totalQuantity: Subject<number> = /*new Subject<number>();*/ new ReplaySubject<number>(0);
  totalPrice: Subject<number> =  /*new Subject<number>();*/ new BehaviorSubject<number>(0);

  constructor() {}

  addCartItem(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    //existingCartItem est l'élément du tableau cartItems qui correspond a l'élément que l'on veut ajouter
    //il peut etre undefined si on ne le trouve pas d'ou le pisteur " | undefined "
    let existingCartItem: CartItem | undefined = undefined; 

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id ); 
      //find equivaut a un for loop qui cherche l'élément et le retourne
      /**
       * for(let tempCartItem of this.cartItems) {
       *    if (tempCartItem.id === theCartItem.id) {
       *        existingCartItem = tempCartItem; 
       *       break;
       *   }
       */
      // check if we found it
      alreadyExistsInCart = (existingCartItem != undefined); 
    }
    if (alreadyExistsInCart) {
      // increment the quantity
      //le ! indique a typescript que existingCartItem n'est pas undefined a ce stade
      existingCartItem!.quantity++; 
    }
    else {
      // just add the item to the array
      this.cartItems.push(theCartItem); 
    }
    // compute cart total price and total quantity
    this.computeCartTotals(); 
  }

  computeCartTotals() {
    let totalPriceValue: number = 0; 
    let totalQuantityValue: number = 0;  
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.unitPrice * currentCartItem.quantity; 
      totalQuantityValue += currentCartItem.quantity; 
    }
    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue); 
    this.totalQuantity.next(totalQuantityValue); 
  }   
  
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--; 
    if (theCartItem.quantity == 0) {
      this.clearCartItem(theCartItem); 
    }
    else {
      this.computeCartTotals(); 
    }
  }

  clearCartItem(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == theCartItem.id);
    //if found remove the item from the array
    if (itemIndex > -1) {
      //splice method removes 1 item at the given index
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
  
}
