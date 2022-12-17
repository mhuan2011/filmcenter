<?php

namespace App\Http\Controllers;

use App\Models\Seat;
use App\Models\Show;
use App\Models\ShowSeat;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ShowController extends Controller
{
    //
    public function getlist()
    {
        $data = Show::orderBy('id', 'DESC')->with('movies')->with('cinema_hall')
            ->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getlistTicket(Request $request)
    {
        $all = $request->all();
        try {
            $id = $all['show_id'];
            $keyword = $all['key_search'] ? $all['key_search'] : "";
            $data = ShowSeat::selectRaw("show_seat.id, show_seat.status, seat.row, seat.number, users.id as user_id, users.name as username, reservation.id as reservation_id, reservation.status as reservation_status")->where('show_id', $id)
                ->leftJoin("seat", "seat.id", "=", "show_seat.seat_id")
                ->leftJoin("reservation", "reservation.id", "=", "show_seat.reservation_id")
                ->leftJoin("users", "users.id", "=", "reservation.user_id")
                ->orderBy('show_seat.id', 'ASC');

            if ($keyword != '') {
                $data = $data->whereRaw('reservation.id LIKE \'%' . $keyword . '%\'');
            }

            $data = $data->get();

            return response()->json([
                'status' => true,
                'data' => $data,
            ]);
        } catch (Error $err) {
        }
    }

    public function getSeatMap(Request $request)
    {
        try {
            $show_id = $request->show_id;
            $cinema_hall = Show::where('id', $show_id)->first();
            $row = Seat::where('cinema_hall_id', $cinema_hall->cinema_hall_id)->groupBy('row')->orderBy('row', 'DESC')->get('row');


            $data = [];

            $show_seat = ShowSeat::where('show_id', $show_id)->get();
            foreach ($row as $r) {
                $temp = Seat::where('row', $r->row)
                    ->selectRaw('show_seat.id, show_seat.seat_id, seat.number, show_seat.status, show_seat.show_id')
                    ->rightJoin('show_seat', 'show_seat.seat_id', '=', 'seat.id')
                    ->where('show_seat.show_id', $show_id)
                    ->get();
                array_push($data, [
                    'row' => $r->row,
                    'seat' => $temp
                ]);
            };

            return response()->json([
                'status' => true,
                'data' => $data,
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function getitem($id)
    {
        $item = Show::where("id", $id)->with(["movies", "cinema_hall"])->first();
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
        $new = new Show();
        try {
            $validatedData = Validator::make($request->all(), []);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }

            $new->date = $request->date;
            $new->start_time = $request->start_time;
            $new->end_time = $request->end_time;
            $new->movie_id = $request->movie_id;
            $new->cinema_hall_id = $request->cinema_hall_id;
            $new->price = $request->price;

            $result = $new->save();
            if ($result) {

                $seat = Seat::where('cinema_hall_id',  $new->cinema_hall_id)->get('id');
                $show_seat = [];
                foreach ($seat as $item) {
                    array_push($show_seat, ['seat_id' => $item->id, 'status' => 0, 'show_id' => $new->id]);
                }

                foreach ($show_seat as $key => $value) {
                    ShowSeat::create($value);
                }

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

        $person = Show::where('id', $request->id)->first();
        if ($person == "") {
            return response()->json([
                'status' => false,
                'message' => "Show not found"
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
        $category = Show::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete category successfully!',
        ]);
    }
}
