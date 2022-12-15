<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    //
    public function getlist()
    {
        $data = User::with('roles')->get();
        return $data;
    }

    public function getAccountDetail(Request $request)
    {
        $id =  $request->id;
        $user  = User::where("id", $id)->first();
        if ($user) {
            if ($user->role_id == null) {
                $user->role_id = 0;
            }

            return response()->json([
                'status' => true,
                'data' => $user,
                'message' => ""
            ]);
        } else {
            return response()->json([
                'status' => false,
                'message' => "Account not found!"
            ]);
        }
    }

    public function creatAccount(Request $request)
    {
        try {
            $validatedData = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'username' => 'required|unique:users',
                'phone' => 'required|unique:users',
                'password' => 'required|string|min:8',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'status' => false,
                    'message'  => $validatedData->errors()->first()
                ]);
            }

            $user = User::create([
                'name' => $request['name'],
                'email' => isset($request['email']) ? $request['email'] : $request['email'],
                'username' => $request['username'],
                'phone' => $request['phone'],
                'password' => Hash::make($request['password']),
                'role_id' => 1,
                'address' => isset($request['address']) ? $request['address'] : "",

            ]);

            $token = $user->createToken('auth_token')->plainTextToken;
            $user['access_token'] = $token;
            $user->update();

            return response()->json([
                'status' => true,
                'message' => 'Create account successfully.',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);
        } catch (\Exception $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function updateAccount(Request $request)
    {

        $data = $request->all();
        $user = User::where('id', $data['id']);
        if ($request->input('password')) {
            $request['password'] = Hash::make($request->input('password'));
        }
        $user->update($request->all());
        return response()->json([
            'status' => true,
            'data' => [
                'user' => $user,
            ],
            'message' => 'Update info successfully! Please login again!',
        ]);
    }


    public function getRoleOfUser(Request $request)
    {
        $data = $request->all();
        try {
            $user_id =  $data['user_id'] ? $data['user_id'] : "";
            $user_role = User::with('roles')->where("id", $user_id)->first();

            return response()->json([
                'status' => true,
                'data' => $user_role->roles
            ]);
        } catch (Error $err) {
            return response()->json([
                'status' => false,
                'message' => $err->getMessage()
            ]);
        }
    }

    public function updateRoleForUser(Request $request)
    {
        $user = Auth::user();
        $data = $request->all();
        try {
            $user_id =  $data['user_id'] ? $data['user_id'] : "";
            $role_id = isset($data['role_id']) ? $data['role_id'] : "";
            $type = isset($data['type']) ? $data['type'] : "";

            $role = Role::where('id', $role_id)->first();
            $user = User::where("id", $user_id)->first();
            if ($user && $role) {

                $check = $user->hasRole($role->name);

                if ($check == 1) {
                    $user->removeRole($role);
                    $type = "remove";
                } else {
                    $user->assignRole($role);
                    $type = "add";
                }
                return response()->json([
                    'status' => true,
                    'message' => $type . ' role successfully!',
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
