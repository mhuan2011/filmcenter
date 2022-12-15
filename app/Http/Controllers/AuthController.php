<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AuthController extends Controller
{
    public function register(Request $request)
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

            $user = new User();
            $user->name = $request['name'];
            $user->email = isset($request['email']) ? $request['email'] : "";
            $user->username = $request['username'];
            $user->phone = $request['phone'];
            $user->password = Hash::make($request['password']);
            $user->address = isset($request['address']) ? $request['address'] : "";
            $user->role_id = 1;

            $result = $user->save();

            // $user = User::create([
            //     'name' => $request['name'],
            //     'email' => isset($request['email']) ? $request['email'] : "",
            //     'username' => $request['username'],
            //     'phone' => $request['phone'],
            //     'password' => Hash::make($request['password']),
            //     'address' => isset($request['address']) ? $request['address'] : "",
            //     'role_id' => 1,

            // ]);



            // $token = $user->createToken('auth_token')->plainTextToken;
            // $user['access_token'] = $token;
            // $user->update();

            return response()->json([
                'status' => true,
                'message' => 'Register successfully.',
                'data' => [
                    // 'access_token' => $token,
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
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('username', 'password'))) {
            if (!Auth::attempt(["phone" => $request['username'], "password" => $request['password']])) {
                return response()->json([
                    'status' => false,
                    'message' => 'Wrong username/phone number or password.'
                ]);
            }
        }
        /** @var \App\Models\User */
        $user = Auth::user();

        $token = $user->createToken('token')->plainTextToken;
        $user->access_token = $token;
        $user->api_token = $token;

        $user->update();
        return response()->json([
            'status' => true,
            'message' => "Login successfully",
            'data' => [
                'user' => $user,
            ]
        ]);
    }

    public function update(Request $request)
    {

        $data = $request->all();
        $user = User::where('id', $data['id']);
        // if($request->input('password')){
        //     $request['password'] = Hash::make($request->input('password'));
        // }
        $user->update($request->all());
        return response()->json([
            'status' => true,
            'data' => [
                'user' => $user,
            ],
            'message' => 'Update info successfully! Please login again!',
        ]);
    }

    public function logout()
    {
        /** @var \App\Models\User */
        auth()->user()->currentAccessToken()->delete();
        return response([
            'message' => 'Successfully Logged Out!'
        ]);
    }
}
