<?php

namespace App\Http\Controllers;

use App\Models\CinemaHall;
use App\Models\Movies;
use App\Models\Show;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

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

        $date_show = Show::where('movie_id', $movie_id)->where([['start_time', '>', $time], ['date', '=', $date]])->orWhere('date', '>', $date)->whereIn('cinema_hall_id', $cinema_hall_id_list)->groupBy('date')->get('date');

        if (!$date_selected) {
            foreach ($date_show as $d) {
                $temp = Show::selectRaw('id, cinema_hall_id, start_time')->where([['start_time', '>', $time], ['date', '=', $date]])->orWhere('date', '>', $date)->where('movie_id', $movie_id)->where('date', $d->date)->whereIn('cinema_hall_id', $cinema_hall_id_list)->orderBy('start_time', 'asc')->get();

                array_push($data, [
                    'date' => $d->date,
                    'show' => $temp
                ]);
            };
        } else {

            if ($date == $date_selected) {
                $data = Show::selectRaw('id, cinema_hall_id, start_time')
                    ->where([['start_time', '>', $time], ['date', '=', $date]])
                    ->where('date', $date_selected)->whereIn('cinema_hall_id', $cinema_hall_id_list)
                    ->orderBy('start_time', 'asc')->get();
            } else {
                $data = Show::selectRaw('id, cinema_hall_id, start_time')
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
            $temp = Show::selectRaw('show.id, cinema.id, cinema.name')->where([['start_time', '>', $time], ['date', '=', $date]])->orWhere('date', '>', $date)->where('date', $d->date)->orderBy('start_time', 'asc');

            $result = $temp->leftJoin('cinema_hall', 'cinema_hall.id', '=', 'show.cinema_hall_id')
                ->leftJoin('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')->get();
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
}
