export type TOrderRowNum = number | null;
export type TOrderDate = string | null;
export type TOrderId = number | null;
export type TOrderCard = string | null;
export type TOrderSumPayment = number | null;
export type TOrderStatus = string | null;
export type TOrderPostPayment = number | null;
export type TOrderScreenshot = string | null;
export type TOrderCompensation = number | null;

export interface IOrder {
  rowNum: TOrderRowNum;
  date: TOrderDate;
  orderId: TOrderId;
  card: TOrderCard;
  payoutAmount: TOrderSumPayment;
  status: TOrderStatus;
  postPayment: TOrderPostPayment;
  screenshot: TOrderScreenshot;
  compensation: TOrderCompensation;
}