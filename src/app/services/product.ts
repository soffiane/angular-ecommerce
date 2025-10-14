import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../model/product';
import { ProductCategory } from '../model/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  /**
   * RxJS for Reactive Extensions for JavaScript
   * https://rxjs.dev/guide/overview
   * RxJS is a library for composing asynchronous and event-based programs by using observable sequences.
   * It provides one core type, the Observable, satellite types (Observer, Schedulers, Subjects, etc.)
   * and operators inspired by Array.prototype methods (map, filter, reduce, etc.) to allow handling
   * asynchronous events as collections.
   * @returns an observable of product array
   */
  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }


  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl)
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseCategories>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseCategories {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
