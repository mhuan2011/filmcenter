<?php

namespace App\Http\Controllers;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleController extends Controller
{
    public function getlist()
    {
        $data = Role::orderBy('id', 'DESC')->get();
        return response()->json([
            'status' => true,
            'data' => $data,
        ]);
    }

    public function getitem($id)
    {
        $item = Role::where("id", $id)->first();
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

            $role = Role::create(['name' => $name, 'guard_name' => 'web']);
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

        $cinemalhall = Role::where('id', $request->id)->first();
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

    public function getPermissionOfRole(Request $request)
    {
        $data = $request->all();
        try {
            $role_id = isset($data['role_id']) ? $data['role_id'] : "";
            $role = Role::where('id', $role_id)->first();

            $permissions = $role->permissions;
            return response()->json([
                'status' => true,
                'data' => $permissions
            ]);
        } catch (Error $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function addPermissonToRole(Request $request)
    {
        $user = Auth::user();
        $data = $request->all();
        try {
            $role_id = isset($data['role_id']) ? $data['role_id'] : "";
            $permission_id = isset($data['permission_id']) ? $data['permission_id'] : "";
            $type = isset($data['type']) ? $data['type'] : "";

            $role = Role::where('id', $role_id)->first();
            $permission = Permission::where('id', $permission_id)->first();

            if ($role && $permission) {
                if ($type == "add") {
                    $role->givePermissionTo($permission);
                } else if ($type == "remove") {
                    $role->revokePermissionTo($permission);
                }
                return response()->json([
                    'status' => true,
                    'message' => $type . ' perrmission successfully!',
                ]);
            }
        } catch (Error $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }
}
