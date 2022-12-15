<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Permission;
use Error;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function getlist()
    {
        $data = Permission::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getitem($id)
    {
        $item = Permission::where("id", $id)->first();
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

    public function store(Request $request)
    {
        $data = $request->all();
        try {
            $name = $data['name'];

            $role = Permission::create(['name' => $name, 'guard_name' => 'web']);
            return response()->json([
                'status' => true,
                'data' => $role,
            ]);
        } catch (Error $error) {
            return response()->json([
                'status' => false,
                'data' => null,
                'message' => $error
            ]);
        }
    }

    public function update(Request $request)
    {

        $cinemalhall = Permission::where('id', $request->id)->first();
        if ($cinemalhall == "") {
            return response()->json([
                'status' => false,
                'message' => "Role not found"
            ]);
        }
        try {
            $cinemalhall->update($request->all());
            return response()->json([
                'status' => true,
                'message' => 'Update role successfully!',
                'movies' => $cinemalhall
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }
}
