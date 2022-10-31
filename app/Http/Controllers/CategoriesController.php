<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriesController extends Controller
{

    public function getlist()
    {
        $data = Categories::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getfilter()
    {
        $format = [];
        $data = Categories::select('name', 'id')->get();
        foreach ($data as $temp) {
            $temp = [
                'text' => $temp->name,
                'value' => $temp->id
            ];

            array_push($format, $temp);
        };

        return response()->json([
            'status' => true,
            'data' => $format,
        ]);
    }

    public function getitem($id)
    {
        $item = Categories::find($id);
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
        $this->authorize('create-update-categories');
        $new = new Categories();
        try {
            $validatedData = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }

            $new->name = $request->name;
            $new->description = $request->description;
            $result = $new->save();
            if ($result) {
                return response()->json([
                    'status' => true,
                    'message' => 'Create new category successfully!',
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
    public function update(Request $request, $id)
    {
        $this->authorize('create-update-categories');
        $category = Categories::where('id', $id)->first();
        if ($category == "") {
            return response()->json([
                'status' => false,
                'message' => "Category not found"
            ]);
        }
        try {
            $category->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Update category successfully!',
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
        $this->authorize('create-update-categories');
        $category = Categories::findOrFail($id);
        $category->delete();
        return response()->json([
            'status' => true,
            'message' => 'Delete category successfully!',
        ]);
    }
}
