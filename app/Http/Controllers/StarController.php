<?php

namespace App\Http\Controllers;

use App\Models\Directors;
use App\Models\Stars;
use Exception;
use Illuminate\Http\Request;

class StarController extends Controller
{
    //
    public function updateStar(Request $request)
    {
        try {
            $data = $request->all();

            $id = $data['keyID'] ? $data['keyID'] : null;
            $star = $data['star'] ? $data['star'] : [];
            $director = $data['director'] ? $data['director'] : [];

            $movie_id = (int)$id;

            $star_old = Stars::where('movie_id', $id)->get();
            $director_old = Directors::where('movie_id', $id)->get();


            $star_del = [];

            foreach ($star_old as $s_o) {
                $check = true;
                foreach ($star as $s) {
                    if ((int)$s_o->person_id == (int)$s) {
                        $check = false;
                    }
                }
                if ($check) array_push($star_del, $s_o->person_id);
            }

            foreach ($star as $s) {
                $res = Stars::updateOrCreate(
                    ['movie_id' => $movie_id, 'person_id' => $s]
                );
            }
            $director_del = [];
            foreach ($director_old as $d_o) {
                $check = true;
                foreach ($director as $d) {
                    if ((int)$d_o->person_id == (int)$d) {
                        $check = false;
                    }
                }
                if ($check) array_push($director_del, $d_o->person_id);
            }

            foreach ($director as $s) {
                Directors::updateOrCreate(
                    ['movie_id' => $movie_id, 'person_id' => $s]
                );
            }


            $res1 = Stars::whereIn('person_id', $star_del)->delete();

            $res2 = Directors::whereIn('person_id', $director_del)->delete();
            return response()->json([
                'status' => true,
                'message' => 'Update actor successfully',
                'delete' => [
                    'director' => $res2,
                    'star' => $res1
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Have error ' . $e,

            ]);
        }
    }

    public function getActors(Request $request)
    {

        $data = $request->all();

        $id = $data['keyID'] ? $data['keyID'] : null;

        $star = Stars::where('movie_id', $id)
            ->leftJoin('person', 'person.person_id', '=', 'stars.person_id')->get();
        $director = Directors::where('movie_id', $id)
            ->leftJoin('person', 'person.person_id', '=', 'directors.person_id')->get();


        return response()->json([
            'status' => true,
            'data' => [
                'star' => $star,
                'director' => $director
            ],
        ]);
    }
}
