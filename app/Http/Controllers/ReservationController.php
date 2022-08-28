<?php

namespace App\Http\Controllers;

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

            $now = Carbon::now();
            $unique_code = $now->format('YmdHisu');

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
                CheckReservation::dispatch($unique_code, $seats)->delay(Carbon::now('Asia/Ho_Chi_Minh')->addSeconds(600));
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'reservation_id' => $unique_code,
                ],
                'message' => "Reservation complete",
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }
}
