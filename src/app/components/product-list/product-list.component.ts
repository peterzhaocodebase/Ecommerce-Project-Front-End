import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number;
  previousCategoryId: number;
  currentCategoryName: string;
  searchMode: boolean;
  theKeyword: string;
  previousKeyword: string;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 12;
  theTotalElements: number = 0;

  constructor(private productService: ProductService,
              private cartService: CartService, 
              private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  updatePageSize(pageSize:number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  // handleSearchProducts() {

  //   const searchword = this.route.snapshot.paramMap.get('keyword');
  //   this.theKeyword = searchword;

  //   // now search for the products using keyword
  //   this.productService.searchProducts(searchword).subscribe(
  //     data => {
  //       this.products = data;
  //     }
  //   )
  // }

  handleSearchProducts() {

    const searchword = this.route.snapshot.paramMap.get('keyword');
    this.theKeyword = searchword;

    if(this.previousKeyword != this.theKeyword){
      this.previousKeyword= this.theKeyword;
      this.thePageNumber=1;
      }

    // now search for the products using keyword
    this.productService.SearchProductPaginate(this.thePageNumber - 1,
      this.thePageSize, searchword).subscribe(
        this.processResult()
    )
  }


  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');

    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId != this.currentCategoryId){
    this.previousCategoryId= this.currentCategoryId;
    this.thePageNumber=1;
    }

    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId)
      .subscribe(this.processResult());
    
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // transform theProduct into theCartItem by using constructor
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
