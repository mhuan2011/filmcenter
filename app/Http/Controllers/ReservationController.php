<?php

namespace App\Http\Controllers;

use App\Jobs\checkExpirePayment;
use App\Jobs\CheckReservation;
use App\Mail\Reservation as MailReservation;
use App\Models\Reservation;
use App\Models\Show;
use App\Models\ShowSeat;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ReservationController extends Controller
{
    public function reservation(Request $request)
    {
        $data = $request->all();
        try {
            $user_id = $data['user_id'];
            $seats = $data['reserveSeat'];
            $is_pay = isset($data['is_pay']) ? $data['is_pay'] : false;
            $now = Carbon::now();
            $unique_code = Carbon::now()->timestamp;

            // checl

            $c = false;
            foreach ($seats as $seat) {
                $check = ShowSeat::where('id', $seat)->first();
                if ($check->status == 1) {
                    $c = true;
                }
            }
            if ($c == true) {
                return response()->json([
                    'status' => false,
                    'message' => "Bạn chậm mất rồi! ghế bạn chọn đã được mua, bạn vui lòng chọn ghế khác!"
                ]);
            }

            // end check 
            $user = User::find($user_id);
            if ($user) {
                $new = new Reservation();
                $new->id = $unique_code;
                $new->status = "Chưa thanh toán";
                $new->user_id = $user_id;

                $result = $new->save();
                if ($result) {
                    foreach ($seats as $seat) {
                        $res = ShowSeat::where('id', $seat)->update(['reservation_id' => $unique_code, 'status' => 1]);
                    }
                }
                if ($is_pay) {
                    CheckReservation::dispatch($unique_code, $seats)->delay(Carbon::now('Asia/Ho_Chi_Minh')->addSeconds(600));
                }
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'reservation_id' => $unique_code,
                ],
                'message' => "Đặt vé thành công",
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }



    // huy ve
    public function cancleReservation(Request $request)
    {
        $data = $request->all();
        $id = isset($data['resevation_id']) ? $data['resevation_id'] : "";
        if ($id) {
            $show_id = ShowSeat::where("reservation_id", $id)->first()->show_id;

            if ($show_id) {
                $show  = Show::where("id", $show_id)->first();

                $date = $show->date;
                $start = $show->start_time;

                $date_now = date('Y-m-d');
                $time_now = date('h:i:s');


                $startTime = Carbon::parse($date_now);
                $finishTime = Carbon::parse($time_now);


                $check = $this->checkPaymenth($id);
                switch ($check) {
                    case 1: {
                            return response()->json([
                                'status' => false,
                                'message' => "Không thể hủy vé đã thanh toán !"
                            ]);
                        }
                        break;
                    case 2: {
                            return response()->json([
                                'status' => false,
                                'message' => "Vé không tồn tại!",
                                'code' => 1
                            ]);
                        }
                        break;
                }

                /* Ngày chiếu là ngày hiện tại */

                if ($date == $date_now) {
                    $time = $finishTime->diffInHours($start);
                    /* Nếu thời gian hiện tại trong khoảng 1h trước giờ chiếu */

                    if ($time < 1) {
                        return response()->json([
                            'status' => false,
                            'message' => "Không thể hủy vé trong trước thời gian chiếu 1 giờ !"
                        ]);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => "Ngoài thời gian xử lý !"
                        ]);
                    }
                } else {
                    // hủy vé
                    $ss = ShowSeat::where("reservation_id", $id)->get();
                    foreach ($ss as $s) {
                        if ($s) {
                            $s->status = 0;
                            $s->reservation_id = "";
                            $s->save();
                        }
                    }
                    $reserve = Reservation::find($id);
                    $reserve->status = "Đã hủy";
                    $reserve->save();

                    return response()->json([
                        'status' => true,
                        'message' => "Hủy vé thành công !"
                    ], 200);
                }
            }
        }
    }
    // Kiểm tra trạng thái thanh toán
    protected function checkPaymenth($reservation_id)
    {
        $reserve = Reservation::find($reservation_id);
        if ($reserve) {
            $status = $reserve->status;
            if ($status == "Thanh toán") return 1;
            if ($status == "Đã hủy") return 2;
            return 3;
        } else {
            dd(1);
            return 3;
        }
    }
}
