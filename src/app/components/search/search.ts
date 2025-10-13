import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search implements OnInit {

  constructor(private router: Router) {   }

  doSearch(value: string) {
    // navigate to the route to display the search results handled by ProductListComponent
    console.log(`value=${value}`);
    this.router.navigateByUrl(`/search/${value}`);
  }

  ngOnInit(): void {  }

}
