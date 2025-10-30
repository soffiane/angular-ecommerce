export class Order {

    private totalPrice: number;
    private totalQuantity: number;

    constructor(totalPrice: number, totalQuantity: number) {
        this.totalPrice = totalPrice;
        this.totalQuantity = totalQuantity;
    }
}
