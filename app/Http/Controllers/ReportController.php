<?php

namespace App\Http\Controllers;

use App\Models\Cinema;
use App\Models\CinemaHall;
use App\Models\Show;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    //

    public function movies(Request $request)
    {
        $data = $request->all();
        try {
            $movie_id  = isset($data['movie_id']) ? $data['movie_id'] : "";
            if (!empty($movie_id)) {
                // lay doanh thu theo phim
                $total = Show::selectRaw("sum(show.price) as total")->where('movie_id', $movie_id)
                    ->join("show_seat", "show_seat.show_id", "=", "show.id")
                    ->join("payment", "payment.reservation_id", "=", "show_seat.reservation_id")
                    ->where('show_seat.reservation_id', '!=', "")
                    ->get();
                //  lay so suat chieu
                $show = Show::selectRaw("count(id) as total")->where('movie_id', $movie_id)->get();
                // lay ti le dat ve

                $booked = Show::selectRaw("count(show_seat.id) as booked")->where('movie_id', $movie_id)
                    ->leftJoin("show_seat", "show_seat.show_id", "=", "show.id")
                    ->where('show_seat.reservation_id', '!=', null)
                    ->get();

                $total_ticket = Show::selectRaw("count(show_seat.id) as total")->where('movie_id', $movie_id)
                    ->leftJoin("show_seat", "show_seat.show_id", "=", "show.id")
                    ->get();
                // lay ve huy

                return response(
                    [
                        'total_revenue' => $total[0]->total,
                        'show' => $show[0]->total,
                        'rate' => [
                            'book' => $booked[0]->booked,
                            'total' => $total_ticket[0]->total
                        ]
                    ],
                    200
                );
            }
        } catch (Exception $err) {
            return $err;
        }
    }

    public function cinema(Request $request)
    {
        $data = $request->all();
        try {
            $time_start = $data['time_start'];
            $time_end =   $data['time_end'];
            $cinemas =   isset($data['cinemas']) ? $data['cinemas'] : Cinema::all();

            $cinema = [];

            $time_start = (date('Y-m-d', strtotime($time_start)));
            $time_end = (date('Y-m-d', strtotime($time_end)));

            // loop list cinema
            foreach ($cinemas as $c) {
                if (!isset($c->id)) {
                    $c = Cinema::find($c);
                }

                $cinema_halls = CinemaHall::where('cinema_id',  $c->id)->get();
                $cinema_halls_query = "";

                if (!empty($cinema_halls)) {
                    foreach ($cinema_halls as $key => $ci) {
                        $cinema_halls_query = $cinema_halls_query . "cinema_hall.cinema_id = " . (string) $ci->id;
                        if ($key < count($cinema_halls) - 1) {
                            $cinema_halls_query = $cinema_halls_query . " OR ";
                        };
                    };
                };



                $result = DB::select("
                    select  count(show_seat.id) as total, `show`.price, cinema_hall.id  
                    from cinema_hall, `show`, show_seat
                    where `show`.cinema_hall_id = cinema_hall.id
                    AND show_seat.show_id = `show`.id
                    AND show_seat.reservation_id != ''
                    AND " . $cinema_halls_query . "
                    AND `show`.date <= '" . $time_end . "' AND  `show`.date >= '" . $time_start . "'
                    GROUP BY `show`.id, `show`.price, cinema_hall.id  
                ");

                $total = 0;
                if (!empty($result)) {
                    foreach ($result as $r) {
                        $total += $r->total * $r->price;
                    }
                }

                array_push($cinema, [
                    'id' => $c->id,
                    'name' => $c->name,
                    'total' => $total
                ]);
            }
            return response(
                $cinema,
                200
            );
        } catch (Exception $err) {
            return response(
                [
                    'message' => 'Have a error!',
                    'error' => $err
                ],
                200
            );
        }
    }
}
