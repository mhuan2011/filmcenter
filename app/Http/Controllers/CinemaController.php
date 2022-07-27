<?php

namespace App\Http\Controllers;

use App\Models\Cinema;
use App\Models\CinemaHall;
use App\Models\Show;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CinemaController extends Controller
{
    //
    public function getCinemaWithMovie($id)
    {
        $data = Cinema::selectRaw('cinema.name, cinema_hall.id')
            ->join('cinema_hall', 'cinema_hall.cinema_id', '=', 'cinema.id')
            ->join('show', 'show.cinema_hall_id', '=', 'cinema_hall.id')
            ->where('show.movie_id', $id)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getShowWithMovieCinema(Request $request)
    {
        $cinema_id = $request->cinema_id;
        $movie_id = $request->movie_id;
        $data = [];
        $cinema_hall = CinemaHall::selectRaw('cinema_hall.id')
            ->join('cinema', 'cinema.id', '=', 'cinema_hall.cinema_id')->where('cinema.id', $cinema_id)->get();

        $date_show = Show::where('movie_id', $movie_id)->whereIn('cinema_hall_id', $cinema_hall)->get();

        foreach ($date_show as $d) {
            $temp = Show::where(['movie_id', $movie_id])->where(['date', $d->date])->whereIn('cinema_hall_id', $cinema_hall)->get();

            array_push($data, [
                'date' => $d->date,
                'seat' => $temp
            ]);
        };


        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getlist()
    {
        $data = Cinema::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }


    public function getitem($id)
    {
        $item = Cinema::where("id", $id)->first();
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
    //store category
    public function store(Request $request)
    {
        $new = new Cinema();
        try {
            $validatedData = Validator::make($request->all(), []);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }

            $new->name = $request->name;
            $new->address = $request->address;


            $result = $new->save();
            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'Create new person successfully!',
                ]);
            }
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }
    //update
    public function update(Request $request)
    {
        $person = Cinema::where('id', $request->id)->first();
        if ($person == "") {
            return response()->json([
                'status' => false,
                'message' => "Cinema not found"
            ]);
        }
        try {
            $person->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Update person successfully!',
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function delete($id)
    {
        $category = Cinema::where('id', $id)->first();
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete category successfully!',
        ]);
    }
}
