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
            $user->role_id = 3;

            $result = $user->save();


            $user->assignRole(3);
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
                'message' => 'Đăng ký tài khoản thành công.',
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
                    'message' => 'Sai tên đăng nhập hoặc mật khẩu.'
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
            'message' => 'Cập nhật thông tin thành công! Vui lòng đăng nhập lại!',
        ]);
    }

    public function logout()
    {
        /** @var \App\Models\User */
        $user = Auth::user();
        // Revoke current user token
        // dd(Auth::user());
        $user->access_token = "";
        $user->api_token = "";

        $user->update();
        $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();

        return response([
            'message' => 'Đăng xuất thành công!',
            'data' => $user->tokens()->where('id', $user->currentAccessToken()->id)
        ]);
    }
}
