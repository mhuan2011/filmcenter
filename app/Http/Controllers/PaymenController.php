<?php

namespace App\Http\Controllers;

use App\Jobs\SendOrdermail;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Show;
use App\Models\ShowSeat;
use Exception;
use Illuminate\Http\Request;
use App\Mail\Reservation as MailReservation;
use Illuminate\Support\Facades\Mail;

class PaymenController extends Controller
{
    //mommo
    public function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt(
            $ch,
            CURLOPT_HTTPHEADER,
            array(
                'Content-Type: application/json',
                'Content-Length: ' . strlen($data)
            )
        );
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        //execute post
        $result = curl_exec($ch);
        //close connection
        curl_close($ch);
        return $result;
    }

    public function paymentWithMomo(Request $request)
    {
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

        $partnerCode = 'MOMOXWKV20220730';
        $accessKey = 'XQCN5ZsnSsOxR4td';
        $serectkey = 'QWPy60RiT3ad5bMAatwKhKIVjYU4nvDW';

        $orderId = $request->orderId; // Mã đơn hàng
        $orderInfo = 'Thanh toán qua MoMo';
        $amount = $request->amount;
        $ipnUrl = 'http://filmcenter.vn/';
        $redirectUrl = env('APP_URL') . '/payment/result';
        $extraData = 'tests';

        $requestId = time() . "";
        $requestType = "captureWallet";

        $rawHash = "accessKey=" . $accessKey . "&amount=" . $amount . "&extraData=" . $extraData . "&ipnUrl=" . $ipnUrl . "&orderId=" . $orderId . "&orderInfo=" . $orderInfo . "&partnerCode=" . $partnerCode . "&redirectUrl=" . $redirectUrl . "&requestId=" . $requestId . "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $serectkey);
        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Test",
            "storeId" => "MomoTestStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
        );
        // dd($data)
        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);  // decode json

        if ($jsonResult['resultCode'] == 41) {
            return response()->json([
                'status' => false,
                'message' => 'Momo Order Id exist!',
            ]);
        }

        if ($jsonResult['payUrl']) {
            return response()->json([
                'status' => true,
                'message' => 'Momo successfully!',
                'url' => $jsonResult['payUrl'],
            ]);
        }
        return response()->json([
            'status' => false,
            'message' => 'Momo Order exist!',
        ]);
    }

    public function paymentMomoSuccess(Request $request)
    {
        // $order = Order::where('momo_id', $request->orderId)->first();
        // $order->payment_status = 1;
        // $order->update();
        // return response()->json([
        //     'status' => true,
        //     'message' => 'Thanh toán thành công!',
        // ]);
    }

    //vnpay
    public function paymentWithVNpay(Request $request)
    {
        $fields = $request->validate([
            'orderId' => 'required|string',
            'amount' => 'required',
            'url' => 'required|string',
        ]);

        //config
        $vnp_TmnCode = "BE4E6IV6"; //Website ID in VNPAY System
        $vnp_HashSecret = "GNMZUTNBGARDLSUPKTZGSXRFMKHCHYMH"; //Secret key
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl =  env('APP_URL') . '/payment/result';
        $vnp_apiUrl = "http://sandbox.vnpayment.vn/merchant_webapi/merchant.html";
        $startTime = date("YmdHis");
        $expire = date('YmdHis', strtotime('+10 minutes', strtotime($startTime)));

        //create payment
        $vnp_TxnRef = $fields['orderId']; //Mã đơn hàng
        $vnp_OrderInfo = 'Thanh toan hoa don';
        $vnp_OrderType = 'billpayment';
        $vnp_Amount =  $fields['amount'] * 100;
        $vnp_Locale = 'vn';
        $vnp_BankCode = '';
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        //Add Params of 2.0.1 Version
        $vnp_ExpireDate = $expire;

        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
            "vnp_ExpireDate" => $vnp_ExpireDate,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        //var_dump($inputData);
        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret); //  
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00', 'message' => 'success', 'data' => $vnp_Url
        );
        // if (isset($_POST['redirect'])) {
        //     header('Location: ' . $vnp_Url);
        //     die();
        // } else {
        //     echo json_encode($returnData);
        // }


        return response($returnData, 200);
    }


    public function result(Request $request)
    {
        $data = $request->all();

        $method = $data['method'];
        $values = $data['values'];
        if ($method == 'vnpay') {

            $data = $data['values'];
            $inputData = array();
            $returnData = array();

            foreach ($data as  $value) {
                if (substr($value['key'], 0, 4) == "vnp_") {
                    $inputData[$value['key']] = $value['value'];
                }
            }

            $vnp_SecureHash = $inputData['vnp_SecureHash'];
            // unset($inputData['vnp_SecureHash']);
            ksort($inputData);
            $i = 0;
            $hashData = "";
            foreach ($inputData as $key => $value) {
                if ($i == 1) {
                    $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
                } else {
                    $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                    $i = 1;
                }
            }



            $secureHash = hash_hmac('sha512', $hashData, 'GNMZUTNBGARDLSUPKTZGSXRFMKHCHYMH');

            $vnpTranId = $inputData['vnp_TransactionNo']; //Mã giao dịch tại VNPAY
            $vnp_BankCode = $inputData['vnp_BankCode']; //Ngân hàng thanh toán
            $vnp_Amount = $inputData['vnp_Amount'] / 100; // Số tiền thanh toán VNPAY phản hồi

            $Status = 0; // Là trạng thái thanh toán của giao dịch chưa có IPN lưu tại hệ thống của merchant chiều khởi tạo URL thanh toán.
            $orderId = $inputData['vnp_TxnRef'];

            try {
                //Check Orderid    
                //Kiểm tra checksum của dữ liệu
                // if ($secureHash == $vnp_SecureHash) {
                if (true) {
                    //Lấy thông tin đơn hàng lưu trong Database và kiểm tra trạng thái của đơn hàng, mã đơn hàng là: $orderId            
                    //Việc kiểm tra trạng thái của đơn hàng giúp hệ thống không xử lý trùng lặp, xử lý nhiều lần một giao dịch
                    //Giả sử: $order = mysqli_fetch_assoc($result);   
                    $order = Reservation::where("id", $inputData['vnp_TxnRef'])->first();
                    if ($order != NULL) {
                        // if ($order["Amount"] == $vnp_Amount) //Kiểm tra số tiền thanh toán của giao dịch: giả sử số tiền kiểm tra là đúng. //$order["Amount"] == $vnp_Amount
                        // {
                        if ($order["status"] != NULL && $order["status"] == 'Chưa thanh toán') {
                            if ($inputData['vnp_ResponseCode'] == '00' || $inputData['vnp_TransactionStatus'] == '00') {
                                $Status = "Thanh toán"; // Trạng thái thanh toán thành công
                            } else {
                                $Status = "Không thành công"; // Trạng thái thanh toán thất bại / lỗi
                            }

                            $res = Reservation::where('id', $inputData['vnp_TxnRef'])->update(['status' => $Status]);
                            if ($res) {
                                $new = new Payment();
                                $new->amount = $vnp_Amount;
                                $new->methods = 'VnPay';
                                $new->reservation_id = $orderId;

                                $result = $new->save();

                                $user = Reservation::selectRaw('users.email')->join("users", 'users.id', '=', 'reservation.user_id')->where("reservation.id", $inputData['vnp_TxnRef'])->first();
                                if ($user) {
                                    $this->sendMail($user->email, "THONG TIN DON HANG");
                                }
                            }
                            //Trả kết quả về cho VNPAY: Website/APP TMĐT ghi nhận yêu cầu thành công                
                            $returnData['RspCode'] = '00';
                            $returnData['Message'] = 'Confirm Success';
                            $returnData['OrderID'] = $orderId;
                        } else {
                            $returnData['RspCode'] = '02';
                            $returnData['Message'] = 'Order already confirmed';
                        }
                        // } else {
                        //     $returnData['RspCode'] = '04';
                        //     $returnData['Message'] = 'invalid amount';
                        // }
                    } else {
                        $returnData['RspCode'] = '01';
                        $returnData['Message'] = 'Order not found';
                    }
                } else {
                    $returnData['RspCode'] = '97';
                    $returnData['Message'] = 'Invalid signature';
                }
            } catch (Exception $e) {
                $returnData['RspCode'] = '99';
                $returnData['Message'] = 'Unknow error';
                $returnData['Error'] = $e;
            }
            //Trả lại VNPAY theo định dạng JSON
            // echo json_encode($returnData);

        } else if ($method == 'momo') {

            $inputData = array();
            $returnData = array();

            foreach ($values as  $value) {
                $inputData[$value['key']] = $value['value'];
            }

            $Status = '';
            if ($inputData['resultCode'] == '0') {
                $Status = "Thanh toán"; // Trạng thái thanh toán thành công
            } else {
                $Status = "Không thành công"; // Trạng thái thanh toán thất bại / lỗi
                $res = Reservation::where('id', $inputData['orderId'])->update(['status' => $Status]);
                $returnData['RspCode'] = '99';
                $returnData['Message'] = 'Unknow error';
                return $returnData;
            }


            $res = Reservation::where('id', $inputData['orderId'])->update(['status' => $Status]);

            if ($res) {
                $new = new Payment();
                $new->amount = $inputData['amount'];
                $new->methods = 'Momo';
                $new->reservation_id = $inputData['orderId'];

                $result = $new->save();

                $user = Reservation::selectRaw('users.email')->join("users", 'users.id', '=', 'reservation.user_id')->where("reservation.id", $inputData['orderId'])->first();
                if ($user) {
                    $dataResult = $this->getInforReservation($inputData['orderId']);
                    $emailJob = new SendOrdermail($user->email,  $inputData['orderId'], $dataResult['user'][0]->name);
                    dispatch($emailJob);
                }
                $returnData['RspCode'] = '00';
                $returnData['Message'] = 'Confirm Success';
                $returnData['OrderID'] = $inputData['orderId'];
                $returnData['data'] = $dataResult;
                $returnData['mail'] = $user->email;
            } else {
                $returnData['RspCode'] = '99';
                $returnData['Message'] = 'Unknow error';
            }
            return $returnData;
        }
    }


    //
    public function sendMail($mail, $data)
    {
        // Mail::to($mail)->send(new MailReservation($data));
    }

    public function getInforReservation($order_id)
    {
        $reservation = Reservation::where('reservation.id', $order_id);

        $seat = $reservation->leftJoin('show_seat', 'show_seat.reservation_id', '=', 'reservation.id')->get();

        $show_id = ShowSeat::where('reservation_id', $order_id)->get('show_id')->first()['show_id'];

        $show_infor = Show::selectRaw('show.start_time, show.date, cinema.name as cinema_name, cinema.address as cinema_address, movies.title as movies_title')
            ->where('show.id', $show_id)
            ->leftJoin('cinema_hall', 'cinema_hall.id', '=', 'show.cinema_hall_id')
            ->leftJoin('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')
            ->leftJoin('movies', 'movies.id', '=', 'show.movie_id')->get();

        $user =  Reservation::selectRaw('users.name, users.email, users.phone')
            ->where('reservation.id', $order_id)
            ->leftJoin('users', 'users.id', '=', 'reservation.user_id')->get();
        $data = [
            'seat' => $seat,
            'show_infor' => $show_infor,
            'user' => $user,
            'order_id' => $order_id
        ];

        return $data;
    }


    public function paymentWithReservationId(Request $request)
    {
        $data = $request->all();
        try {
            $reservation_id = isset($data['reservation_id']) ? $data['reservation_id'] : "";
            if ($reservation_id) {
                $reservation = Reservation::find($reservation_id);
            }
        } catch (Exception $err) {
            return response()->json([
                "status" => false,
                "messgae" => "error" . $err
            ]);
        }
    }
}
