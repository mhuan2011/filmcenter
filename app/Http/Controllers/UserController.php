<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    //
    public function getlist()
    {
        $data = User::all();
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
                'address' => $request['address'],
                'role_id' => $request['role_id'] == 0 ? null : $request['role_id'],
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
}
