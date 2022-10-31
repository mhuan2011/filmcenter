<?php

namespace App\Http\Controllers;

use App\Models\Movies;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MoviesController extends Controller
{
    //
    public function getlist()
    {
        $data = Movies::orderBy('id', 'DESC')->with('category')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function filtermovies(Request $request)
    {
        $data = $request->all();
        if ($data == []) {
            $result = Movies::orderBy('id', 'DESC')->with('category')->get();
        } else {
            $result = [];

            if ($request->title) {
                $result = Movies::where('title', 'like', '%' . $data['title'] . '%');
            } else {
                $result = Movies::selectRaw("*");
            }

            if ($request->country) {
                $result = $result->where("country_id", $data['country']);
            }

            if ($request->category) {
                $result = $result->where("category_id", $data['category']);
            }

            $result =  $result->get();
        }
        return response()->json([
            'status' => true,
            'data' => $result,
        ]);
    }



    public function getitem($id)
    {
        $item = Movies::where("id", $id)->with('category')->first();
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
        $new = new Movies();
        $file_url = '';
        if (request()->has('image')) {
            $file_url = $this->upload($request['image']);
        }

        try {
            $validatedData = Validator::make($request->all(), [
                'title' => 'required|string',
                'duration' => 'required|string|max:255',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }


            $new->title = $request->title;
            $new->duration = $request->duration;
            $new->release_date =  $request->release_date;
            $new->language = $request->language;
            $new->description = $request->description;
            $new->country_id = $request->country_id;
            $new->category_id = $request->category_id;
            $new->image = $file_url;

            $result = $new->save();
            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'Create new movies successfully!',
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
        $file_url = '';
        if (request()->has('image')) {
            $file_url = $this->upload($request['image']);
        }

        $movies = Movies::where('id', $request->id)->first();
        if ($movies == "") {
            return response()->json([
                'status' => false,
                'message' => "movies not found"
            ]);
        }
        try {
            $movies->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Update movies successfully!',
                'movies' => $movies
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
        $category = Movies::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete movies successfully!',
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
