import { Component, OnInit } from '@angular/core';
import { OrderHistoryService } from '../../services/order-history-service';
import { OrderHistory } from '../../model/order-history';

@Component({
  selector: 'app-order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrl: './order-history.css'
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  // sortDirection controls ordering by date: 'desc' (newest first) or 'asc' (oldest first)
  sortDirection: 'asc' | 'desc' = 'desc';
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.listOrderHistory();
  }
  listOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail')!);

    this.orderHistoryService.getOrderHistory(email).subscribe(data => {
      this.orderHistoryList = data._embedded.orders;
      // sort after loading
      this.sortOrderHistory();
    });
  }

  toggleDateSort() {
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    this.sortOrderHistory();
  }

  private sortOrderHistory() {
    if (!this.orderHistoryList) { return; }
    this.orderHistoryList.sort((a: OrderHistory, b: OrderHistory) => {
      const ta = new Date(a.dateCreated).getTime();
      const tb = new Date(b.dateCreated).getTime();
      return this.sortDirection === 'desc' ? tb - ta : ta - tb;
    });
  }

}
