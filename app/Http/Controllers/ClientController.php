<?php

namespace App\Http\Controllers;

use App\Events\NotificationReservation;
use App\Models\CinemaHall;
use App\Models\Movies;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Show;
use App\Models\ShowSeat;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

use function PHPUnit\Framework\isEmpty;

class ClientController extends Controller
{
    public function getMovieShow()
    {

        $date = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $time = Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s');

        $item = Show::where([['start_time', '>', $time], ['date', '=', $date]])->orWhere('date', '>', $date)->get();
        $movie_id = [];
        foreach ($item as $show) {
            array_push($movie_id, $show->movie_id);
        }

        $movies = Movies::whereIn('id', $movie_id)->get();
        if (is_null($item)) {
            return response()->json([
                'status' => false,
                'message' => 'Not found',
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $movies,
        ]);
    }


    public function getShowWithMovieCinema(Request $request)
    {
        $date = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $time = Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s');

        $cinema_id = $request->cinema_id;
        $movie_id = $request->movie_id;
        $date_selected = $request->date_selected ?  $request->date_selected : null;

        $data = [];
        $cinema_hall = CinemaHall::selectRaw('cinema_hall.id')
            ->join('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')->where('cinema.id', $cinema_id)->get();

        $cinema_hall_id_list = [];
        foreach ($cinema_hall as $item) {
            array_push($cinema_hall_id_list, $item->id);
        };

        $date_show = Show::where('movie_id', $movie_id)
            ->whereIn('cinema_hall_id', $cinema_hall_id_list)
            ->where(function ($query) use ($date, $time) {
                $query->where([['start_time', '>', $time], ['date', '=', $date]])
                    ->orWhere('date', '>', $date);
            })
            ->groupBy('date')->get('date');


        if (!$date_selected) {
            foreach ($date_show as $d) {
                $temp = Show::selectRaw('id, cinema_hall_id, start_time')->where('movie_id', $movie_id)
                    ->where('date', $d->date)
                    ->whereIn('cinema_hall_id', $cinema_hall_id_list)->orderBy('start_time', 'asc');

                $temp = $temp
                    // ->where([['start_time', '>', $time], ['date', '=', $date]])
                    // ->orWhere('date', '>', $date)
                    ->get();
                array_push($data, [
                    'date' => $d->date,
                    'show' => $temp
                ]);
            };
        } else {
            if ($date == $date_selected) {
                $data = Show::selectRaw('id, cinema_hall_id, start_time')->where('movie_id', $movie_id)
                    ->where([['start_time', '>', $time], ['date', '=', $date]])
                    ->where('date', $date_selected)->whereIn('cinema_hall_id', $cinema_hall_id_list)
                    ->orderBy('start_time', 'asc')->get();
            } else {
                $data = Show::selectRaw('id, cinema_hall_id, start_time')->where('movie_id', $movie_id)
                    ->where('date', $date_selected)->whereIn('cinema_hall_id', $cinema_hall_id_list)
                    ->orderBy('start_time', 'asc')->get();
            }
        }



        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getShowDate()
    {
        $date = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $time = Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s');

        $date_show = Show::where([['start_time', '>', $time], ['date', '=', $date]])->orWhere('date', '>', $date)->groupBy('date')->get('date');
        $data = [];
        foreach ($date_show as $d) {
            $temp = Show::selectRaw('cinema.id , cinema.name')
                // ->where([['start_time', '>', $time], ['date', '=', $date]])
                // ->orWhere('date', '>', $date)->where('date', $d->date)
                ->where(function ($query) use ($date, $time) {
                    $query->where([['start_time', '>', $time], ['date', '=', $date]])
                        ->orWhere('date', '>', $date);
                })
                ->orderBy('start_time', 'asc');

            $result = $temp->join('cinema_hall', 'cinema_hall.id', '=', 'show.cinema_hall_id')
                ->join('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')
                ->groupBy('cinema.id', 'cinema.name')
                ->get();
            array_push($data, [
                'date' => $d->date,
                'cinema' => $result
            ]);
        };


        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getShowWithMovieId(Request $request)
    {
    }

    public function getMoviesWithCinemAndDate(Request $request)
    {
        $date_now = Carbon::now('Asia/Ho_Chi_Minh')->format('Y-m-d');
        $time = Carbon::now('Asia/Ho_Chi_Minh')->format('H:i:s');

        $cinema_id = $request->cinema_id;
        $date = $request->date;

        $cinema_hall = CinemaHall::selectRaw('cinema_hall.id')
            ->join('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')->where('cinema.id', $cinema_id)->get();

        $cinema_hall_id_list = [];
        foreach ($cinema_hall as $item) {
            array_push($cinema_hall_id_list, $item->id);
        };

        $movies = [];
        if ($date_now == $date) {
            $movies = Show::selectRaw('movies.title, movies.id')->where([['start_time', '>', $time], ['date', '=', $date]])
                ->whereIn('cinema_hall_id', $cinema_hall_id_list)
                ->join('movies', 'movies.id', '=', 'show.movie_id')
                ->groupBy('movies.title', 'movies.id')->get();
        } else {
            $movies = Show::selectRaw('movies.title, movies.id')->where('date', $date)
                ->whereIn('cinema_hall_id', $cinema_hall_id_list)
                ->join('movies', 'movies.id', '=', 'show.movie_id')
                ->groupBy('movies.title', 'movies.id')->get();
        }

        return response()->json([
            'status' => true,
            'data' => $movies,
        ]);
    }




    public function getInforShow($id)
    {
        $item = Show::where('id', $id)->with('cinema_hall')->first();
        if (is_null($item)) {
            return response()->json([
                'status' => false,
                'message' => 'Not found',
            ]);
        }
        return response()->json([
            'status' => true,
            'data' => $item,
        ]);
    }

    public function statistic(Request $request)
    {
        $data = $request->all();
        $time_start = $data['time_start'];
        $time_end =   $data['time_end'];
        // $cinema_id =   $data['cinema_id'];
        $amount = DB::select("SELECT SUM(amount) AS amount FROM payment as p, reservation as r WHERE p.created_at>'{$time_start}' AND p.created_at<'{$time_end}' AND  p.reservation_id = r.id AND r.status = N'Thanh toán'");

        $movie_count = DB::select("SELECT count(*) as movies FROM movies ");

        $cinema_count = DB::select("SELECT count(*) as cinema FROM cinema ");

        $users = DB::select("SELECT count(*) as users FROM users WHERE role_id <> 0 ");

        // if ($cinema_id == 0) {
        // } else {
        // }
        return response()->json([
            'status' => true,
            'data' => [
                "amount" => $amount[0]->amount,
                "movies" => $movie_count[0]->movies,
                "cinema" => $cinema_count[0]->cinema,
                "users" => $users[0]->users,
            ],
        ]);
    }

    public function revenueByDate(Request $request)
    {
        $data = $request->all();
        $time_start = $data['time_start'];
        $time_end =   $data['time_end'];
        // $cinema_id =   $data['cinema_id'];
        $amount = DB::select("SELECT SUM(amount) AS amount, DATE(p.created_at) as created_at FROM payment as p, reservation as r WHERE p.created_at>'{$time_start}' AND p.created_at<'{$time_end}' AND  p.reservation_id = r.id AND r.status = N'Thanh toán' GROUP BY DATE(p.created_at)");

        // if ($cinema_id == 0) {
        // } else {
        // }
        return response()->json([
            'status' => true,
            'data' => $amount
        ]);
    }


    public function cinemaHallOfCinema()
    {

        $cinema_hall = DB::select("SELECT COUNT(cinema_hall.id) as number_cinema_hall, cinema.name FROM cinema_hall, cinema WHERE cinema_hall.cinema_id = cinema.id GROUP BY cinema.id, cinema.name");
        return response()->json([
            'status' => true,
            'data' => $cinema_hall
        ]);
    }

    public function getInforReservation($order_id)
    {
        $reservation = Reservation::where('reservation.id', $order_id);

        $check = Reservation::where('id', $order_id)->first();
        if (!$check) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => "Không tìm thấy mã đặt vé!!!"
            ]);
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
                ->leftJoin('movies', 'movies.id', '=', 'show.movie_id')->get();

            $user =  Reservation::selectRaw('users.name, users.email, users.phone')
                ->where('reservation.id', $order_id)
                ->leftJoin('users', 'users.id', '=', 'reservation.user_id')->get();


            $data = [
                'seat' => $seat,
                'show_infor' => $show_infor,
                'user' => $user,
                'order_id' => $order_id,
                'reservation' => $check
            ];

            return response()->json([
                'status' => true,
                'data' => $data,
                'message' => "Tìm thấy thông tin đặt vé!!!"
            ]);
        }
        return response()->json([
            'status' => false,
            'data' => [],
            'message' => "Không tìm thấy mã đặt vé!!!"
        ]);
    }

    public function getReserverionOfUser($id)
    {
        $user_id = isset($id) ? $id : null;
        if ($user_id) {
            $result = Reservation::where("user_id", $user_id)->with(['seat'])->orderBy('id', 'desc')->get();
            return response()->json([
                'status' => true,
                'data' => $result
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => "user not found!"
            ]);
        }
    }

    public function     tranferTicket(Request $request)
    {
        $data = $request->all();
        try {
            // user_id = $data['user_id'];
            $seats = $data['reserveSeat'];
            $reservation_id = $data['reservation_id'];
            $is_pay = isset($data['is_pay']) ? $data['is_pay'] : false;
            $now = Carbon::now();
            $unique_code = Carbon::now()->timestamp;

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
                    'message' => "Bạn chậm mất rồi! ghế bạn chọn đã được đặt, bạn vui lòng chọn ghế khác!"
                ]);
            }

            //check payment
            $payment = Payment::where("reservation_id", $reservation_id)->first();
            if ($payment) {
                return response()->json([
                    'status' => false,
                    'message' => "Vé đã thanh toán không thể đổi !!!"
                ]);
            }

            // check reservation
            $reservation = Reservation::find($reservation_id);
            if ($reservation) {
                // removw old seat
                $show_seat_old = ShowSeat::where("reservation_id", $reservation_id)->get();
                if ($show_seat_old) {
                    foreach ($show_seat_old as $seat) {
                        $seat->reservation_id = "";
                        $seat->status = 0;
                        $seat->save();
                    }
                }

                foreach ($seats as $seat) {
                    $res = ShowSeat::where('id', $seat)->update(['reservation_id' => $reservation_id, 'status' => 1]);
                }
            }
            return response()->json([
                'status' => true,
                'message' => "Đổi vé thành công !!!",
            ]);
        } catch (Exception $err) {
            return response()->json([
                'status' => false,
                'message' => "Error! " . $err
            ]);
        }
    }
}
