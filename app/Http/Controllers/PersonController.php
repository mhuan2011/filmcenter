<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use App\Models\Person;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PersonController extends Controller
{
    public function getlist()
    {
        $data = Person::orderBy('person_id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }
    public function getitem($id)
    {
        $item = Person::where("person_id", $id)->first();
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
        $new = new Person();
        $file_url = '';
        if (request()->has('upload')) {
            $file_url = $this->upload($request['upload']);
        }

        try {
            $validatedData = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'gender' => 'required|boolean',
                'date_of_birth' => 'required|string|max:255',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }

            $new->name = $request->name;
            $new->gender = $request->gender;
            $new->date_of_birth = $request->date_of_birth;
            $new->description = $request->description;
            $new->image = $file_url;

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

        $person = Person::where('person_id', $request->person_id)->first();
        if ($person == "") {
            return response()->json([
                'status' => false,
                'message' => "Person not found"
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
        $category = Person::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete category successfully!',
        ]);
    }

    public function upload($file, $existfile = '/none')
    {
        if ($existfile) {
            if (file_exists(public_path() . '/images' . $existfile)) {
                unlink(public_path() . '/images' . $existfile);
            };
        }
        $extension = $file->getClientOriginalExtension(); // you can also use file name
        $fileName = time() . '.' . $extension;
        $path = public_path() . '/images';
        $upload = $file->move($path, $fileName);
        if ($upload) {
            return '/' . $fileName;
        }
        return '';
    }
}
