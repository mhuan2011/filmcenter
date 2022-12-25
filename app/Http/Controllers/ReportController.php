<?php

namespace App\Http\Controllers;

use App\Models\Cinema;
use App\Models\CinemaHall;
use App\Models\Movies;
use App\Models\Show;
use App\Models\ShowSeat;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;
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
                        $cinema_halls_query = $cinema_halls_query . "cinema_hall.cinema_id = " . (string) $c->id;
                        if ($key < count($cinema_halls) - 1) {
                            $cinema_halls_query = $cinema_halls_query . " OR ";
                        };
                    };
                };
                if ($cinema_halls_query) $cinema_halls_query .= " AND ";


                $query = "select  count(show_seat.id) as total, `show`.price, cinema_hall.id  
                from cinema_hall, `show`, show_seat, reservation
                where `show`.cinema_hall_id = cinema_hall.id
                AND show_seat.show_id = `show`.id
                AND cinema_id = " . $c->id . "
                AND reservation.id = show_seat.reservation_id
                AND reservation.`status` = 'Thanh toán'
                AND " . $cinema_halls_query . " `show`.date <= '" . $time_end . "' AND  `show`.date >= '" . $time_start . "'
                GROUP BY `show`.id, `show`.price, cinema_hall.id ";

                $result = DB::select($query);
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

    public function detail(Request $request)
    {
        $data = $request->all();
        try {
            $type = isset($data['type']) ? $data['type'] : 0;
            $end_date = isset($data['end_date']) ? $data['end_date'] : "";
            $start_date = isset($data['start_date']) ? $data['start_date'] : "";
            $movies = isset($data['movies']) ? $data['movies'] : "";
            $result = [];
            $columns_add = [];
            switch ($type) {
                case 4:
                    $period = new DatePeriod(
                        new DateTime($start_date),
                        new DateInterval('P1D'),
                        new DateTime($end_date)
                    );
                    // 

                    $weeks = [];


                    $date_list = [];

                    $temp_date = "";
                    $i = 1;
                    foreach ($period as $key => $value) {
                        $date = $value->format('Y-m-d');
                        $d_m = new Carbon($date);
                        $start_weak = $d_m->startOfWeek()->format('Y-m-d');
                        $end_weak = $d_m->endOfWeek()->format('Y-m-d');

                        if ($start_weak != $temp_date) {
                            array_push($date_list, [
                                'name' => 'Tuần ' . $i,
                                'range' => [
                                    'start_weak' => $start_weak,
                                    'end_weak' => $end_weak,
                                ]
                            ]);
                            $temp_date = $start_weak;
                            $i++;
                        }
                    }


                    $index = 0;
                    foreach ($date_list as $key => $value) {
                        // get revenue

                        $start_weak = $value['range']['start_weak'];
                        $end_weak =  $value['range']['end_weak'];



                        $total_revenue_movie = [];
                        foreach ($movies as $m) {
                            if ($index == 0) {
                                $movie_get = Movies::where('id', $m)->first();
                                array_push($columns_add, [
                                    'name' => $movie_get->title,
                                    'id' => $movie_get->id
                                ]);
                            }


                            $query = "
                            select sum(price) as total, movie_id, movies.title from `show` , show_seat, reservation, movies

                                WHERE show_seat.show_id = `show`.id
                                AND `show`.`date` >= '" . $start_weak . "'
                                AND `show`.`date` <= '" . $end_weak . "'
                                AND show_seat.reservation_id = reservation.id

                                AND movies.id = `show`.movie_id
                                AND movies.id = " . $m . "

                                AND reservation.`status` = 'Thanh toán'
                                

                                GROUP BY movie_id, movies.title
                            ";
                            $seat = DB::select($query);


                            foreach ($seat as $s) {
                                array_push(
                                    $total_revenue_movie,
                                    [
                                        'movie_name' => $s->title,
                                        'movie_revenue' => $s->total
                                    ]
                                );
                            }
                        }

                        array_push($result, [
                            'index' => $index,
                            'week' => $value['name'],
                            'start_weak' => $start_weak,
                            'end_weak' => $end_weak,
                            'total' =>  $total_revenue_movie
                        ]);
                        $index++;
                    }



                    break;
                case 3:
                    $period = new DatePeriod(
                        new DateTime($start_date),
                        new DateInterval('P1D'),
                        new DateTime($end_date)
                    );
                    $index = 0;
                    foreach ($period as $key => $value) {
                        $date = $value->format('Y-m-d');

                        // get revenue
                        $movies_revenue = [];
                        $total_revenue_movie = [];
                        foreach ($movies as $m) {
                            if ($index == 0) {
                                $movie_get = Movies::where('id', $m)->first();
                                array_push($columns_add, [
                                    'name' => $movie_get->title,
                                    'id' => $movie_get->id
                                ]);
                            }


                            $query = "
                            select sum(price) as total, movie_id, movies.title from `show` , show_seat, reservation, movies

                                WHERE show_seat.show_id = `show`.id
                                AND `show`.`date` = '" . $date . "'
                                AND show_seat.reservation_id = reservation.id

                                AND movies.id = `show`.movie_id
                                AND movies.id = " . $m . "

                                AND reservation.`status` = 'Thanh toán'
                                

                                GROUP BY movie_id, movies.title
                            ";
                            $seat = DB::select($query);
                            foreach ($seat as $s) {
                                array_push(
                                    $total_revenue_movie,
                                    [
                                        'movie_name' => $s->title,
                                        'movie_revenue' => $s->total
                                    ]
                                );
                            }
                        }

                        array_push($result, [
                            'index' => $index,
                            'date' => $date,
                            'total' =>  $total_revenue_movie
                        ]);
                        $index++;
                    }

                    break;
                default:
            }
            return response()->json([
                'data' => $result,
                'columns_add' => $columns_add,
                'type' => $type
            ]);
        } catch (Exception $err) {
        }
    }


    public function show(Request $request)
    {
        $data = $request->all();
        try {
            $movie_id = $data['id'];
            $query = "
            select sum(price) as total, movie_id, movies.title, `show`.id, `show`.date, `show`.start_time, `show`.end_time   from `show` , show_seat, reservation, movies
            WHERE show_seat.show_id = `show`.id
            AND show_seat.reservation_id = reservation.id
            AND movies.id = `show`.movie_id
            AND movies.id = " . $movie_id . "
            AND reservation.`status` = 'Thanh toán'
            GROUP BY movie_id, movies.title, `show`.id, `show`.date, `show`.start_time, `show`.end_time
            ORDER BY `show`.date DESC";


            $data = DB::select($query);

            $result = [];
            if ($data) {
                foreach ($data as $key => $value) {
                    $total_ticket = ShowSeat::where('show_id', $value->id)->get()->count();
                    $solve_ticket = ShowSeat::where('show_id', $value->id)
                        ->join('reservation', 'reservation.id', 'show_seat.reservation_id')
                        ->where('reservation.status', 'Thanh toán')
                        ->get()->count();


                    $value->total_ticket = $total_ticket ? $total_ticket : 0;
                    $value->solve_ticket = $solve_ticket ? $solve_ticket : 0;

                    array_push($result, $value);
                }
            }

            return response()->json([
                'data' =>  $result
            ]);
        } catch (Exception $err) {
            dd($err);
        }
    }
}
