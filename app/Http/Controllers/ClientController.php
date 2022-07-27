<?php

namespace App\Http\Controllers;

use App\Models\Movies;
use App\Models\Show;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;

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
}
