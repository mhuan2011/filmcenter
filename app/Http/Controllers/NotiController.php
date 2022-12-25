<?php

namespace App\Http\Controllers;

use App\Events\NotificationReservation;
use App\Events\PusherEvent;
use App\Jobs\checkExpirePayment;
use App\Mail\NotiCancleTicket;
use App\Mail\NotiExpirePayment;
use App\Models\Reservation as ModelsReservation;
use App\Models\Show;
use App\Models\ShowSeat;
use Carbon\Carbon;
use Exception;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class NotiController extends Controller
{
    //
    public function index()
    {
        try {
            event(new NotificationReservation('hello world'));
            return response()->json(
                [
                    "status" => "ok",
                    "message" => "send data successfull !!"
                ]
            );
        } catch (Exception $err) {
            return response()->json(
                [
                    "status" => "faild",
                    "message" => "send data error !!" . $err
                ]
            );
        }
    }

    public function check()
    {

        // checkExpirePayment::dispatch(18)->delay(0);

        $user = ShowSeat::where('show_id',  20)
            ->leftJoin('reservation', 'reservation.id', 'show_seat.reservation_id')
            ->leftJoin('users', 'users.id', 'reservation.user_id')
            ->where('show_seat.reservation_id', "!=", "")
            ->where('reservation.status', "=", "Chưa thanh toán")
            ->groupBy(['show_seat.show_id', 'users.email', 'reservation.id'])
            ->get(['users.email', 'reservation.id']);

        $result = [];

        foreach ($user as $u) {
            $infor = $this->getInforReservation($u->id);
            array_push($result, [
                'user' => $u,
                'data' => $infor,
                'reservation_id' => $u->id
            ]);
        };


        foreach ($result as $r) {
            try {
                Mail::to($r['user']->email)->send(new NotiExpirePayment($r['data']['seat'], $r['data']['show_infor'], $r['reservation_id']));
            } catch (Exception $err) {
            }
        };
        return response()->json(
            [
                "message" => "check expire success!",
                "status" => true,
                "code" => 200
            ]

        );
    }

    public function getInforReservation($order_id)
    {
        $reservation = ModelsReservation::where('reservation.id', $order_id);

        $check = ModelsReservation::where('id', $order_id)->first();
        if (!$check) {
            return [];
        }

        if ($reservation) {
            // $seat = $reservation->leftJoin('show_seat', 'show_seat.reservation_id', '=', 'reservation.id')
            //     ->get();

            $seat = DB::select("SELECT *  FROM show_seat as ss, reservation as r, seat as s WHERE r.id = " . $order_id . " AND ss.seat_id = s.id AND r.id = ss.reservation_id");

            $show_id = ShowSeat::where('reservation_id', $order_id)->get('show_id')->first()['show_id'];

            $show_infor = Show::selectRaw('show.id, movies.id as movie_id, show.price, cinema.id as cinema_id, show.start_time, show.date, cinema.name as cinema_name, cinema.address as cinema_address, movies.title as movies_title, cinema_hall.name as screen')
                ->where('show.id', $show_id)
                ->leftJoin('cinema_hall', 'cinema_hall.id', '=', 'show.cinema_hall_id')
                ->leftJoin('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')
                ->leftJoin('movies', 'movies.id', '=', 'show.movie_id')->get()->toArray();;
            $data = [
                'seat' => $seat,
                'show_infor' => $show_infor[0],
            ];

            return $data;
        }
        return [];
    }



    // 
    public function cancle()
    {
        $id = 20;
        $show = ShowSeat::where('show_id', $id)
            ->join('reservation', 'reservation.id', 'show_seat.reservation_id')
            ->leftJoin('users', 'users.id', 'reservation.user_id')
            ->where('reservation.status', 'Chưa thanh toán')
            ->groupBy('show_seat.reservation_id', 'users.email', 'users.name')
            ->get(['users.email', 'show_seat.reservation_id', 'users.name']);




        if (!empty($show)) {
            foreach ($show as $s) {
                $r = Reservation::find($s->reservation_id);
                if ($r) {
                    $r->status = 'Hết hạn';
                    $r->save();
                }
                ShowSeat::where('reservation_id', $s->reservation_id)->update([
                    'reservation_id' => '',
                    'status' => '0'
                ]);
                try {
                    Mail::to($s->email)->send(new NotiCancleTicket($s->reservation_id));
                } catch (Exception $err) {
                }
            }
        };

        return response()->json(
            [
                "message" => "cancle success!",
                "status" => true,
                "code" => 200
            ]

        );
    }
}
