<?php

namespace App\Http\Controllers;

use App\Models\CinemaHall;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CinemaHallController extends Controller
{
    public function getlist()
    {
        $data = CinemaHall::orderBy('id', 'DESC')->with('cinema')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }
    public function getitem($id)
    {
        $item = CinemaHall::where("id", $id)->first();
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
        $new = new CinemaHall();

        try {
            $validatedData = Validator::make($request->all(), [
                'name' => 'required|string',
                'total_seat' => 'required|integer',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }


            $new->name = $request->name;
            $new->total_seat = $request->total_seat;
            $new->cinema_id = $request->cinema;

            $result = $new->save();
            if ($result) {
                $id_cinema_hall = $new->id;

                $row = $new->total_seat / 14;
                $row_seat =  array_slice(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'], 0, $row);

                $seat = [];

                foreach ($row_seat as $row) {
                    $index = 1;
                    while ($index < 15) {
                        array_push($seat, ['row' => $row, 'number' => $index, 'price' => 80000, 'cinema_hall_id' => $id_cinema_hall]);
                        $index++;
                    }
                }

                foreach ($seat as $key => $value) {
                    Seat::create($value);
                }

                return response()->json([
                    'status' => true,
                    'message' => 'Create new cinema hall successfully!',
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

        $cinemalhall = CinemaHall::where('id', $request->id)->first();
        if ($cinemalhall == "") {
            return response()->json([
                'status' => false,
                'message' => "movies not found"
            ]);
        }
        try {
            $cinemalhall->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Update cinema hall successfully!',
                'movies' => $cinemalhall
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
        $category = CinemaHall::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete cinema hall successfully!',
        ]);
    }

    public function upload($file, $existfile = '/none')
    {
        if ($existfile) {
            if (file_exists(public_path() . '/images/movies' . $existfile)) {
                unlink(public_path() . '/images/movies' . $existfile);
            };
        }
        $extension = $file->getClientOriginalExtension(); // you can also use file name
        $fileName = time() . '.' . $extension;
        $path = public_path() . '/images/movies';
        $upload = $file->move($path, $fileName);
        if ($upload) {
            return '/' . $fileName;
        }
        return '';
    }
}
